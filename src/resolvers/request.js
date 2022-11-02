
export default {
    catItem: async (request, args, context) => {
        return await context.prisma.catalogueItem.findUnique({
            where: {
                id: request.catItemId
            }
        })
    },
    sender: async(request, args, context) => {
        return await context.prisma.user.findUnique({
            where: {
                id: request.senderId
            }
        })
    }
}