export default {
	owner: async(product, args, context) => {
		return await context.prisma.user.findUnique({
			where: {
				id: product.ownerId
			}
		})
	},
	photos: async(product, args, context) => {
		return await context.prisma.productImage.findMany({
			where: {
				productId: product.id
			}
		})
	}
}