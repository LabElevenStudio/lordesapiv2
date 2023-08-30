export default{
    catalogue: async (user, args, context) => {
    	return await context.prisma.service.findMany({
    		where: {
    			ownerId: user.id
    		}
    	})
    },
    productCatalogue: async (user, args, context) => {
    	return await context.prisma.product.findMany({
    		where: {
    			ownerId: user.id
    		}
    	})
    },
    productCatalogueCount: async (user, args, context) => {
        let count = await context.prisma.product.count({
            where: {
                ownerId: user.id
            }
        })
        
        
        return count
    },
    catalogueCount: async(user, args, context) => {
        let count = await context.prisma.service.count({
            where: {
                ownerId: user.id
            }
        })
        
        return count
    },
    profileImage: async(user, args, context) => {
        return await context.prisma.profileImage.findUnique({
            where: {
                ownerId: user.id
            }
        })
    },
    sentNotifications: async(user, args, context) => {
        return await context.prisma.serviceNotification.findMany({
                where: {
                    senderId: user.id
                }
        })
    },
    receivedNotifications: async(user, args, context) => {
        return await context.prisma.serviceNotification.findMany({
            where: {
                receiverId: user.id
            }
        })
    },
    chats: async (user, args, context) => {
        return await context.prisma.chat.findMany({
            where:{
                participants: {
                    some: {
                        id: user.id
                    }
                }
            }
        })
    },
    messages: async (user, args, context) => {
        return await context.prisma.message.findMany({
            where: {
                senderId: user.id
            }
        })
    }
}