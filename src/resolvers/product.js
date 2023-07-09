exports.default = {
	owner: async(product, args, context) => {
		return await context.prisma.stylist.findUnique({
			where: {
				id: product.ownerId
			}
		})
	}
}