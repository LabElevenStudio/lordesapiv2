export default {
	owner: async(product, args, context) => {
		return await context.prisma.user.findUnique({
			where: {
				id: product.ownerId
			}
		})
	}
}