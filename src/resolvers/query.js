

export default {
    products: async(parent, args, context) => {
        return await context.prisma.product.findMany({})
    },
    product: async(parent, {id}, context) => {
        return await context.prisma.product.findUnique({
            where: {
                id
            }
        })
    },
    services: async(parent, args, context) => {
        return await context.prisma.service.findMany({})
    },
    service: async(parent, {id}, context) => {
        return await context.prisma.service.findUnique({
            where: {
                id
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
    me: async(parent, args, context) => {
        return await context.prisma.user.findUnique({where: {id: context.user.id}})
    }
}