

export default {
	newNotification: {
		subscribe: async (parent, args, context) => await context.pubSub.subscribe('newNotification'),
		resolve: payload => payload	
	},
	newMessage: {
		subscribe: async (parent, {chatId}, context) => context.pipe(
				await context.pubSub.subscribe(`newMessage_${chatId}`),
				context.filter(publishedMessage => {
					return context.prisma.chat.findFirst({
						where: {
							id: publishedMessage.chatId,
							participants: {
								some: {
									id: context.user.id
								}
							}
						}
					})
				})
			),
		resolve: payload => payload
	}
}