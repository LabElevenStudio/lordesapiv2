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
        throw new GraphQLError("You have to be signed in.")
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
            hashPassword.map(async hash => {
                return bcrypt.compare(password, hash)
            }))
        
        const match = matches.includes(true)
        
        if(!match){
            throw new GraphQLError("Error Signing in")
        }

        return jwt.sign({id: userId[0]}, process.env.JWT_SECRET)


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
        
        return service;
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
    createProduct: async(parent, {name, price, quantity}, context) => {
        isStylist(context, 'STYLIST')
        
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
        isStylist(context, 'STYLIST')
        
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
    }
}
