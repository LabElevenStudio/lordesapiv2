export default{
	serviceRequests: async(stylist, args, context) => {
		return await context.prisma.serviceRequest.findMany({
			where: {
				receiverId: stylist.id
			}
		})
	},
	catalogue: async(stylist, args, context) => {
		return await context.prisma.service.findMany({
			where: {
				ownerId: stylist.id
			}
		})
	},
	productCatalogue: async(stylist, args, context) => {
		return await contex.prisma.product.findMany({
			where: {
				ownerId: stylist.id
			}
		})
	}
}