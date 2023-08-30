export default{
	sender: async(serviceNotification, args, context) => {
		return await context.prisma.user.findUnique({
			where: {
				id: serviceNotification.senderId
			}
		})
	},
	receiver: async(serviceNotification, args, context) => {
		return await context.prisma.user.findUnique({
			where: {
				id: serviceNotification.receiverId
			}
		})
	}
}