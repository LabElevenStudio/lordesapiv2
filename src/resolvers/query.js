

export default {
    products: async(parent, args, context) => {
        return await context.prisma.product.findMany({})
    },
    product: async(parent, {name}, context) => {
        return await context.prisma.product.findUnique({
            where: {
                name
            }
        })
    },
    sentServiceRequests: async(parent, args, context) => {
        return await context.prisma.serviceRequest.findMany({
            where: {
                status: 'REQUESTED',
                senderId: context.user.id
            }
        })
    },
    recievedServiceRequests: async(parent, args, context) => {
        return await context.prisma.serviceRequest.findMany({
            where: {
                status: 'REQUESTED',
                receiverId: context.stylist.id
            }
        })
    },
    acceptedServiceRequests: async(parent, args, context) => {
        return await context.prisma.serviceRequest.findMany({
            where: {
                status: 'ACCEPTED',
                receiverId: context.stylist.id
            }
        })
    },
    stylists: async(parent, args, context) => {
        return await context.prisma.stylist.findMany({})
    },
    stylist: async(parent, {username}, context) => {
        return await context.prisma.stylist.findUnique({
            where: {
                username: username,
            }
        })
    },
    users: async(parent, args, context) => {
        return await context.prisma.user.findMany({})
    },
    user: async(parent, {username}, context) => {
        return await context.prisma.user.findUnique({
            where: {
                username: username
            }
        })
    },

    userSelf: async(parent, args, context) => {
        return await context.prisma.user.findUnique({where: {id: context.user.id}})
    },
    
    stylistSelf: async(parent, args, context) => {
        return await context.prisma.stylist.findUnique({
                where: {
                    id: context.stylist.id
            }
        })
    }
}