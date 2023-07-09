
export default {
    receiver: async (serviceRequest, args, context) => {
        return await context.prisma.user.findUnique({
            where: {
                id: serviceRequest.receiverId
            }
        })
    },
    sender: async(serviceRequest, args, context) => {
        return await context.prisma.user.findUnique({
            where: {
                id: serviceRequest.senderId
            }
        })
    }
}