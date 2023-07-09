export default{
    serviceRequests: async(user, args, context) => {
        return await context.prisma.serviceRequests.findMany({
            where: {
                senderId: user.id
            }
        })
    }
}