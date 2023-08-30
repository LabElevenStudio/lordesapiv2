import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {GraphQLError} from 'graphql'
import dotenv from 'dotenv'
import {createWriteStream} from 'fs'
dotenv.config()


    
const isUser = async (context, Role) => {
    if(!context.user) {
        throw new GraphQLError("You have to be signed in as a user.")
    }

    const user = await context.prisma.user.findUnique({
        where: {
            id: context.user.id
        },
        select: {
            role: true
        }
    })
    if(user.role !== Role){
        throw new GraphQLError("You can't take this action")
    }else{
        return user
    }
}

const isStylist = async (context, Role) => {
    if(!context.user) {
        throw new GraphQLError("You have to be signed in as a stylist.")
    }

    const stylist = await context.prisma.user.findUnique({
        where: {
            id: context.user.id
        },
        select: {
            role: true
        }
    })
    if(stylist.role !== Role){
        throw new GraphQLError("You can't take this action")
    }else{
        return stylist
    }
}

const isMerchant = async(context, Role) => {
    if(!context.user){
        throw new GraphQLError("You have to be signed in as a merchant")
    }
    
    const merchant = await context.prisma.user.findUnique({
        where: {
            id: context.user.id
        },
        select: {
            role: true
        }
    })
    
    if(merchant.role !== Role){
        throw new GraphQLError("You can't take this action")
    }else{
        return merchant
    }
}
const isUserOrStylist = async(context) => {
    if(!context.user) {
        throw new GraphQLError("You have to be signed in.")       
    }
    
    const user = await context.prisma.user.findUnique({
        where: {
            id: context.user.id
        },
        select: {
            role: true
        }
    })
    
    if(user.role === 'USER' || user.role === 'STYLIST'){
        return user
    }else{
        throw new GraphQLError("you can't take this action")
    }
}

export default{
    signUp: async(parent, {username, email, password, role}, context) => {
        var email = email.trim().toLowerCase();
        var saltRounds = 10;
        var encryptedPassword = await bcrypt.hash(password, saltRounds);
        
        
        try{
            if(role === 'user'){
                    const user = await context.prisma.user.create({
                    data: {
                        username,
                        email,
                        password: encryptedPassword,
                        role: 'USER'
                    }
                })
                    
                    return jwt.sign({id: user.id}, process.env.JWT_SECRET)
            }else if(role === 'stylist'){
                    const user = await context.prisma.user.create({
                    data: {
                        username,
                        email,
                        password: encryptedPassword,
                        role: 'STYLIST'
                    }
                })
                    
                    return jwt.sign({id: user.id}, process.env.JWT_SECRET)
        }else if(role === 'merchant'){
            const user = await context.prisma.user.create({
                data: {
                    username,
                    email,
                    password: encryptedPassword,
                    role: 'MERCHANT'
                }
            })
            
            return jwt.sign({id: user.id}, process.env.JWT_SECRET)
        }
              
            
        }catch(err){
            console.error(err)
            throw new Error('Error creating account')
        }
    },
    signIn: async (parent, {username, email, password}, context) => {
        if(email) {
            var email = email.trim().toLowerCase();
        }
        
        

        const findUser = await context.prisma.user.findMany({
            where: {
                OR:[
                    {
                    email: {
                         contains: email
                    }
                }, {
                        username: {
                            contains: username
                    }}
                ]
            }
        })
        
        
        
        

        if(!findUser) {
            throw new GraphQLError('Error signing in');
        }

        const hashPassword = findUser.map(user => user.password)
        
        
        
        const userId = findUser.map(user => user.id)
        
        
        
        const matches = await Promise.all(
            hashPassword.map(async (hash) => {
                return bcrypt.compare(password, hash)
            }))
        
        
        
        const match = matches.includes(true)
        
        
        
        if(!match){
            throw new GraphQLError("Error Signing in")
        }
        
        
        let matchIndex = matches.indexOf(match)

        return jwt.sign({id: userId[matchIndex]}, process.env.JWT_SECRET)


    },
    createService: async(parent, {name, price}, context) => {
        isStylist(context, 'STYLIST')
        
        const service = await context.prisma.service.create({
            data: {
                name,
                price,
                owner: {
                    connect: {
                        id: context.user.id
                    }
                }
            }
        })
        
        console.log(service)
        console.log(service.owner)
        
        
        return service;
    },
    updateService: async(parent, {id, name ,price}, context) => {
        isStylist(context, 'STYLIST')
        

        
        const service = await context.prisma.service.findUnique({
            where: {
                id: parseInt(id)
            },
            select:{
                owner: true
            }
        })

        if(!service || service.owner.id !== context.user.id){
            throw new GraphQLError('Service not found')
        }
        
        const updatedService = await context.prisma.service.update({
            where:{
                id: parseInt(id)
            },
            data: {
                name,
                price
            }
        })
        
        
        return updatedService
    },
    updateProfile: async(parent, {bio, location}, context) => {
        if(isUser(context, 'USER') || isStylist(context, 'STYLIST') || isMerchant(context, 'MERCHANT')) return

        const updatedUserProfile = await context.prisma.user.update({
            where: {
                id: context.user.id
            },
            data:{
                bio,
                location
            }
        })
        
        
        return updatedUserProfile 
        
    },
    createProduct: async(parent, {name, price, quantity}, context) => {
        isMerchant(context, 'MERCHANT')
        
        const product = await context.prisma.product.create({
            data: {
                name,
                price,
                quantity,
                owner: {
                    connect: {
                        id: context.user.id
                    }
                }
            }
        })
        
        return product
    },
    updateProduct: async(parent, {id, name, price, quantity}, context) => {
        isMerchant(context, 'MERCHANT')
        
        const product = await context.prisma.product.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                owner: true
            }
        })
        
        if(!product || product.owner.id !== context.user.id){
            throw new GraphQLError('product not found')
        }
        
        
        const updatedProduct = context.prisma.product.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                price,
                quantity
            }
        })
        
        return updatedProduct
    },
    uploadProfileImage: async(parent, {file}, context) => {
        if(isUser(context, 'USER') || isStylist(context, 'STYLIST') || isMerchant(context, 'MERCHANT')) return;  
        
        const {createReadStream, filename, mimetype, encoding} = await file
        const stream = createReadStream()
        
        const path = `../uploads/${filename}`
        
        await new Promise((resolve, reject) => {
            stream
            .pipe(createWriteStream(path))
            .on('finish', resolve)
            .on('error', reject)
        })
        
        
        const image = await context.prisma.profileImage.create({
            data: {
                filename,
                mimetype,
                encoding,
                url: path,
                owner: {
                    connect:{
                        id: context.user.id
                    }
                }
            }
        })
        
        return image
        
    },
    
    uploadServiceImage: async(parent, {file, serviceId}, context) => {
        isStylist(context, 'STYLIST')
        
        
        const service = await context.prisma.service.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                owner: true  
            }
        })
        
        
        
        if(!service || service.owner.id !== context.user.id){
            throw new GraphQLError("service not owned by user")
        }
        
        const {createReadStream, filename, mimetype, encoding} = await file
        const stream = createReadStream()
        
        const path = `../uploads/${filename}`
        
        await new Promise((resolve, reject) => {
            stream
            .pipe(createWriteStream(path))
            .on('finish', resolve)
            .on('error', reject)
        })
        
        
        const service2 = await context.prisma.service.findUnique({
            where: {
                id: parseInt(id)
            }        
        })
        
        const image = await context.prisma.serviceImage.create({
            data: {
                filename,
                mimetype,
                encoding,
                url: path,
                service: {
                    connect:{
                        id: service2.id
                    }
                }
            }
        })
        
        return image
        
    },
    
    uploadProductImage: async(parent, {file, productId}, context) => {
        isMerchant(context, 'MERCHANT')
        
        //get product
        const product = await context.prisma.product.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                owner: true
            }
        })
        
        
        //confirm that product belongs to stylist
        if(!product || product.owner.id !== context.user.id){
            throw new GraphQLError('product not owned by user.')
        }
        
        const {createReadStream, filename, mimetype, encoding} = await file
        const stream = createReadStream()
        
        const path = `../uploads/${filename}`
        
        await new Promise((resolve, reject) => {
            stream
            .pipe(createWriteStream(path))
            .on('finish', resolve)
            .on('error', reject)
        })
        
        
        const product2 = await context.prisma.product.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        
        const image = await context.prisma.productImage.create({
            data: {
                filename,
                mimetype,
                encoding,
                url: path,
                product: {
                    connect:{
                        id: product2.id
                    }
                }
            }
        })
        
        return image
        
    },
    bookService: async(parent, {receiverId, message}, context) => {
        isUser(context, 'USER')
        
        
        const receiver = await context.prisma.user.findUnique({
            where: {
                id: parseInt(receiverId)
            }  
        })
        
               
        const notification = await context.prisma.serviceNotification.create({
                data: {
                    message,
                    sender:{
                        connect: {
                            id: context.user.id
                        }
                    },
                    receiver: {
                        connect: {
                            id: receiver.id
                        }
                    }
                }
        })
        
        await context.pubSub.publish('newNotification', notification)
        
        return notification
    },
    createChat: async(parent, {userIds}, context) => {
        isUser(context, 'USER') //update this later for family and school
        
        const {userOne, userTwo} = userIds
    
        
        const firstUser = await context.prisma.user.findUnique({
            where: {
                id: parseInt(userOne)
            }
        })
    
        
        const secondUser = await context.prisma.user.findUnique({
            where: {
                id: parseInt(userTwo)
            }
        })
        
        
        const chat = await context.prisma.chat.create({
            data: {
                participants: {
                    connect: [{id: firstUser.id}, {id: secondUser.id}]
                }
            }
        })
        
        return chat
    },
    sendMessage: async(parent, {chatId, content}, context) => {
        isUserOrStylist(context)
            
            
        const chat = await context.prisma.chat.findUnique({
            where: {
                id: parseInt(chatId)
            }
        })
        
        if(!chat && !chat.participants.includes(context.user.id)){
            throw new Error("You are not a participant of this chat. You can't send a message here")
        }
        
        
        const newMessage = await context.prisma.message.create({
            data: {
                content,
                sender: {
                    connect: {
                        id: context.user.id
                    }
                },
                chat: {
                    connect: {
                        id: chat.id
                    }
                }
            }
        })
        
        await context.pubSub.publish(`newMessage_${chatId}`, newMessage)
        
        
        return newMessage
    }
    
}
