export default {
	sender: async(message, args, context) => {
		return await context.prisma.user.findUnique({
			where: {
				id: message.senderId
			}
		})
	},
	chat: async(message, args, context) => {
		return await context.prisma.chat.findUnique({
			where: {
				messages: {
						some: {
							id: message.id
						}
				}
			}
		})
	}
}