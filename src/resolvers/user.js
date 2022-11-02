export default{
    catalogue: async(user, args, context) => {
        return await context.prisma.catalogueItem.findMany({
            where: {
                providerId: user.id
            }
        })
    },
    reqNotifications: async(user, args, context) => {
        return await context.prisma.request.findMany({
            where: {
                id: {
                    in: user.reqNotifications
                }
            }
        })
    },
    profile: async(user, args, context) => {
        return await context.prisma.profile.findUnique({
            where: {
                user: user.id
            }
        })
    }
}