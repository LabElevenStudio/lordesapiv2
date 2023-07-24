// import {GraphQLcontext as context} from '../context'

export default {
    owner: async(service, args, context) => {
        return await context.prisma.user.findUnique({
            where: {
                id: service.ownerId
            }
        })
    }
}