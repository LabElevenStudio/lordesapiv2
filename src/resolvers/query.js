

export default {
    sentRequests: async(parent, args, context) => {
        return await context.prisma.request.findMany({
            where: {
                senderId: context.user.id
            }
        })
    },
    acceptedRequests: async(parent, args, context) => {
        return await context.prisma.request.findMany({
            where: {
                status: ACCEPTED,
                catItem: {
                    has: {
                        providerId: context.user.id
                    }
                }
            }
        })
    },
    getStylists: async(parent, {role, service}, context) => {
        if(role === STYLIST && (service === HOME || service === BOTH)) {
            return await context.prisma.user.findMany({
                where: {
                    role: 'STYLIST',
                    services: 'HOME'
                }
            })
        }else if(role === STYLIST && (service === INSHOP || service === BOTH)){
            return await context.prisma.user.findMany({
                where: {
                    role: 'STYLIST',
                    services: 'INSHOP'
                }
            })
        }else{
            return await context.prisma.user.findMany({
                where: {
                    role: 'STYLIST'
                }
            })
        }
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

    me: async(parent, args, context) => {
        return await context.prisma.user.findUnique({where: {id: context.user.id}})
    }
}