import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {GraphQLError} from 'graphql'
import dotenv from 'dotenv'
dotenv.config()




    
const isUser = async (context, Role) => {
    if(!context.user) {
        throw new GraphQLError("You have to be signed in.")
    }

    const currentUser = await context.prisma.user.findUnique({
        where: {
            id: context.user.id
        }
    })
    if(currentUser.role !== Role){
        throw new GraphQLError("You can't take this action")
    }else{
        return currentUser
    }
}

const isStylist = async (context, Role) => {
    if(!context.user) {
        throw new GraphQLError("You have to be signed in.")
    }

    const currentUser = await context.prisma.user.findUnique({
        where: {
            id: context.user.id
        }
    })
    if(currentUser.role !== Role){
        throw new GraphQLError("You can't take this action")
    }else{
        return currentUser
    }
}

export default{
    signUp: async(parent, {username, email, password, role}, context) => {
        var email = email.trim().toLowerCase();
        var saltRounds = 10;
        var encryptedPassword = await bcrypt.hash(password, saltRounds);
        
        //add logic to check if username has already been used
        
        try{
            const user = await context.prisma.user.create({
                data: {
                    username,
                    email,
                    password: encryptedPassword,
                    role
                }
            })

            return jwt.sign({id: user.id}, process.env.JWT_SECRET)
        }catch(err){
            console.error(err)
            throw new Error('Error creating account')
        }
    },
    signIn: async(parent, {username, email, password}, context) => {
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
    createCatalogueItem: async(parent, {itemName, itemDesc, itemCost}, context) => {
        isStylist(context, 'STYLIST')
        console.log(context.user.id)
        return await context.prisma.catalogueItem.create({
            data: {
                itemName,
                itemDesc,
                itemCost,
                providerId: context.user.id
            },
            include: {
                provider: true
            }
        })
    },
    sendRequest: async(parent, {providerId, reqStatus, service, serviceOption}, context) => { 
        isUser(context, 'USER')

        const serviceOpt = parseInt(serviceOption)
        //create a new request
         const newRequest =  await context.prisma.request.create({
             data: {
                 serviceType: service,
                 catItemId: serviceOpt,
                 senderId: context.user.id,
                 status: reqStatus
             },
             include: {
                 sender: true
             }
        })

        //send request to provider
        await context.prisma.user.update({
            where: {
                id: parseInt(providerId)
            },
            data: {
                reqNotifications: {
                    push: [newRequest.id]
                },
                reqNotificationCount: {
                    increment: 1
                }
            }
        })

        return newRequest
        
    },
    deleteCatalogueItem: async(parent, {itemId}, context) => {
        isStylist(context, 'STYLIST')

        let item = await context.prisma.catalogueItem.findUnique({ where: {id: parseInt(itemId)}})
        if(item.providerId !== context.user.id){
            throw new GraphQLError("You don't have permissions to delete this.")
        }

        try{
            await context.prisma.catalogueItem.delete({where: {id: parseInt(itemId)}})
            return true
        }catch(err) {
            console.error(err)
            return false
        }
    },
    cancelRequest: async(parent, {requestId}, context) => {
        isStylist(context, 'STYLIST')
        //find request with id
        const request = await context.prisma.request.findUnique({where: {id: parseInt(requestId)}})

        if(request.senderId !== context.user.id) throw new GraphQLError('You don\'t have permission to delete this request')
        //get service provider of the request
        const catItem = await context.prisma.catalogueItem.findUnique({where: {id: request.catItem}})

        const serviceProvider = await context.prisma.user.findUnique({
            where: {
                id: catItem.provider,
                reqNotifications: {
                    has: parseInt(requestId)
                }
            }
        })

        if(serviceProvider && request.status !== ACCPETED){
            await context.prisma.user.update({
                where:{
                    id: catItem.providerId
                },
                data: {
                    reqNotifications: {
                        increment: -1
                    }
                }
            })
        }
        try{
            await context.prisma.request.delete({where: {id: parseInt(requestId)}})
            return true
        }catch(err) {
            console.log(err)
            return false
        }
    },
    acceptRequest: async(parent, {requestId}, context) => {
        isUser(context, 'USER')

        //check if current user has the request in their notifications
        let isInRequest = await context.prisma.user.findUnique({
            where: {
                id: context.user.id,
                reqNotifications: {
                    has: parseInt(requestId)
                }
            }
        })

        if(isInRequest){
            return await context.prisma.request.update({
                where: {
                    id: parseInt(requestId)
                },
                data: {
                    status: ACCEPTED
                }
            })
        }
    },
    updateCatalogueItem: async(parent, {itemId, cost}, context) => {
        isStylist(context, 'STYLIST')
        
        // const stylist = isStylist(context, 'STYLIST')
        
        const item = await context.prisma.catalogueItem.findUnique({
            where: {
                id: itemId
            }
        })

        if(item && item.provider !== context.user.id){
            throw new GraphQLError('You don\'t have permissions to update this service.')
        }
        
        return await context.prisma.catalogueItem.update({
            where:{
                id: parseInt(itemId)
            },
            data: {
                itemCost: cost
            }
        })
    },
    createProfile: async(parent, {bio, profilePic, userId}, context) => {
        if(!context.user) {
            throw new GraphQLError("You have to be signed in.")
        }


        if(userId !== String(context.user.id)){
            throw new GraphQLError("You don't have permission")
        }
        try{
            const profile =  await context.prisma.profile.create({
                data: {
                    bio,
                    profilePic,
                    userId: parseInt(userId)
                },
                include: {
                    user: true
                }
            })
            return profile
        }catch(err) {
            console.log('couldn\'t create profile')
            console.error(err)
            throw new Error(err)
        }
        
    },
    updateProfile: async(parent, {bio, profilePic, userId}, context) => {
        if(!context.user) {
            throw new GraphQLError("You have to be signed in.")
        }

        if(parseInt(userId) !== context.user.id){
            throw new GraphQLError("You don't have permission")
        }

        return await context.prisma.profile.update({
            where: {
                user: parseInt(userId)
            },
            data: {
                bio,
                profilePic
            }
        })
    }
}
