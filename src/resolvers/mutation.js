import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {GraphQLError} from 'graphql'
import dotenv from 'dotenv'
dotenv.config()




    
const isUser = async (context, Role) => {
    if(!context.user) {
        throw new GraphQLError("You have to be signed in.")
    }

    const user = await context.prisma.user.findUnique({
        where: {
            id: context.user.id
        }
    })
    if(user.role !== Role){
        throw new GraphQLError("You can't take this action")
    }else{
        return user
    }
}

const isStylist = async (context, Role) => {
    if(!context.stylist) {
        throw new GraphQLError("You have to be signed in.")
    }

    const stylist = await context.prisma.stylist.findUnique({
        where: {
            id: context.stylist.id
        }
    })
    if(stylist.role !== Role){
        throw new GraphQLError("You can't take this action")
    }else{
        return stylist
    }
}

export default{
    userSignUp: async(parent, {username, email, password}, context) => {
        var email = email.trim().toLowerCase();
        var saltRounds = 10;
        var encryptedPassword = await bcrypt.hash(password, saltRounds);
        
        
        try{
            const user = await context.prisma.user.create({
                data: {
                    username,
                    email,
                    password: encryptedPassword,
                    role: 'USER'
                }
            })
            
            
            return jwt.sign({id: user.id}, process.env.JWT_SECRET)
        }catch(err){
            console.error(err)
            throw new Error('Error creating account')
        }
    },
    userSignIn: async(parent, {username, email, password}, context) => {
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
        // console.log('userid', userId[0])
        // console.log('password',...hashPassword)

        const match = await bcrypt.compare(password, ...hashPassword)
        
        if(!match){
            throw new GraphQLError("Error Signing in")
        }

        return await jwt.sign({id: userId[0]}, process.env.JWT_SECRET)


    },
    stylistSignUp: async(parent, {username, email, password}, context) => {
        var email = email.trim().toLowerCase();
        var saltRounds = 10;
        var encryptedPassword = await bcrypt.hash(password, saltRounds);
        
        
        try{
            const stylist = await context.prisma.stylist.create({
                data: {
                    username,
                    email,
                    password: encryptedPassword,
                    role: 'STYLIST'
                }
            })
            
            
            return jwt.sign({id: stylist.id}, process.env.JWT_SECRET)
        }catch(err){
            console.error(err)
            throw new Error('Error creating account')
        }
    },
    stylistSignIn: async(parent, {username, email, password}, context) => {
        if(email) {
            var email = email.trim().toLowerCase();
        }

        const findStylist = await context.prisma.stylist.findMany({
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
        
        

        if(!findStylist) {
            throw new GraphQLError('Error signing in');
        }

        const hashPassword = findStylist.map(stylist => stylist.password)
        
        const stylistId = findStylist.map(stylist => stylist.id)

        const match = await bcrypt.compare(password, ...hashPassword)
        
        if(!match){
            throw new GraphQLError("Error Signing in")
        }

        return await jwt.sign({id: stylistId[0]}, process.env.JWT_SECRET)


    },
    createService: async(parent, {name, price}, context) => {
        isStylist(context, 'STYLIST')
        
        const service = await context.prisma.service.create({
            data: {
                name,
                price,
                owner: {
                    connect: {
                        id: context.stylist.id
                    }
                }
            }
        })
        
        return service;
    },
    sendServiceRequest: async(parent, {stylistId, message}, context) => { 
        isUser(context, 'USER')
        
        const stylist = await context.prisma.stylist.findUnique({
            where: {
                id: parseInt(stylistId)
            }
        })
        
        
        if(!stylist){
            throw new GraphQLError("stylist not found.")
        }

       
        //create a new request
         const serviceRequest =  await context.prisma.serviceRequest.create({
             data: {
                 message,
                 sender:{
                    connect: {
                        id: context.user.id
                    }
                 },
                 receiver: {
                    connect:{
                        id: parseInt(stylistId)
                    }
                 },
                 status: 'REQUESTED'
             }
        })

        return serviceRequest;     
    },

    updateSerivceRequestStatus: async(parent, {requestId, status}, context) => {
        isStylist(context, 'STYLIST')
    
    
        
        const serviceRequest = await context.prisma.serviceRequest.findUnique({
            where: {
                id: parseInt(requestId)   
            },
            select:{
                receiver: true
            }
        })

        //check if current user has the request in their notifications
       if(!serviceRequest || serviceRequest.receiver.id !== context.stylist.id){
        throw new GraphQLError("service request not found")
       }

       const updatedServiceRequest = await context.prisma.serviceRequest.update({
            where: {
                id: parseInt(requestId)
            },
            data: {
                status
            }
       })
       
       
       return updatedServiceRequest
    },
    updateService: async(parent, {id, name ,price}, context) => {
        isStylist(context, 'STYLIST')
        
        // const stylist = isStylist(context, 'STYLIST')
        
        const service = await context.prisma.service.findUnique({
            where: {
                id: parseInt(id)
            },
            select:{
                owner: true
            }
        })

        if(!service || service.owner.id !== context.stylist.id){
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
    updateUserProfile: async(parent, {bio, location}, context) => {
        isUser(context, 'USER')

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
    updateStylistProfile: async(parent, {bio, location}, context) => {
       isStylist(context, 'STYLIST')
       

        const updatedStylistProfile = await context.prisma.stylist.update({
            where: {
                id: context.stylist.id
            },
            data: {
                bio,
                location
            }
        })
        
        return updatedStylistProfile;
    },
    createProduct: async(parent, {name, price, quantity}, context) => {
        isStylist(context, 'STYLIST')
        
        const product = context.prisma.product.create({
            data: {
                name,
                price,
                quantity,
                owner: {
                    connect: {
                        id: context.stylist.id
                    }
                }
            }
        })
        
        return product
    },
    updateProduct: async(parent, {id, name, price, quantity}, context) => {
        isStylist(context, 'STYLIST')
        
        const product = context.prisma.product.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                owner: true
            }
        })
        
        if(!product || product.owner.id !== context.stylist.id){
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
    }
}
