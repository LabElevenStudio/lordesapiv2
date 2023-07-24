export default{
    catalogue: async (user, args, context) => {
    	return await context.prisma.service.findMany({
    		where: {
    			ownerId: user.id
    		}
    	})
    },
    productCatalogue: async (user, args, context) => {
    	return await context.prisma.product.findMany({
    		where: {
    			ownerId: user.id
    		}
    	})
    }
}