// import {GraphQLcontext as context} from '../context'

export default {
    provider: async(catalogueItem, args, context) => {
        return await context.prisma.user.findUnique({
            where: {
                id: catalogueItem.providerId || null
            }
        })
    },
    requests: async(catalogueItem, args, context) => {
        return await context.prisma.request.findMany({
            where: {
                id: {
                    in: catalogueItem.requests || null
                }
            }
        })
    }
}