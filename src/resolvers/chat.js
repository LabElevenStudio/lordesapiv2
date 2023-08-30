export default{
	participants: async (chat, args, context) => {
		return await context.prisma.user.findMany({
			where: {
				id: {in: chat.participants}
			}
		})
	},
	messages: async (chat, args, context) => {
		return await context.prisma.message.findMany({
			where: {
				id: {in: chat.messages}
			}
		})
	}
}