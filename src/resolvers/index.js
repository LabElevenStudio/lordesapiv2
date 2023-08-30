import Query from './query'
import Mutation from './mutation'
import Service from './service'
import ServiceNotification from './serviceNotification'
import Chat from './chat'
import Message from './message'
import User from './user'
import Product from './product'
import Subscription from './subscription'
import {GraphQLDateTime} from 'graphql-iso-date'


export const resolvers = {
    Query,
    Mutation,
    Service,
    ServiceNotification,
    Chat,
    Message,
    User,
    Product,
    Subscription,
    DateTime: GraphQLDateTime,
}


