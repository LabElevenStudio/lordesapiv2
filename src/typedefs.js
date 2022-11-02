
 const typeDefs = `
     scalar DateTime

     type User{
         id: ID!
         username: String!
         email: String!
         password: String!
         profile: Profile
         role: Role!
         services: ServiceType!
         catalogue: [CatalogueItem]!
         sentRequests: [Request!]
         reqNotifications: [Int!]
         reqNotificationCount: Int!
         createdAt: DateTime!
         updatedAt: DateTime!
     }

     type Profile{
         id: ID!
         bio: String
         profilePic: String
         user: User!
         createdAt: DateTime!
     }

     type CatalogueItem{
         id: ID!
         itemName: String!
         itemDesc: String!
         itemCost: String!
         provider: User!
         requests: [Request]
         createdAt: DateTime!
     }

     type Request{
         id: ID!
         servicetype: ServiceType!
         catItem: CatalogueItem!
         sender: User!
         status: Status
         createdAt: DateTime!
         updatedAt: DateTime!
     }

     enum Role{
         USER
         STYLIST
     }

     enum Status{
         REQUESTED
         ACCEPTED
         CANCELED
         FULFILLED
     }

     enum ServiceType{
         HOME
         INSHOP
         BOTH
     }

     type Query{
         sentRequests: [Request!]!
         acceptedRequests: [Request!]!
         getStylists(role: Role!, service: ServiceType): [User!]!
         users: [User!]!
         user(username: String!): User!
         me: User!
     }

     type Mutation{
         createProfile(bio: String, profilePic: String, userId: ID!): Profile!
         updateProfile(bio: String, profilePic: String, userId: ID!): Profile!
         createCatalogueItem(itemName: String!, itemDesc: String!, itemCost: Float!): CatalogueItem!
         updateCatalogueItem(itemId: ID!, cost: Float!): CatalogueItem!
         sendRequest(providerId: ID!, reqStatus: Status!, service: ServiceType!, serviceOption: ID!): Request!
         cancelRequest(requestId: ID!): Boolean!
         deleteCatalogueItem(itemId: ID!): Boolean!
         acceptRequest(requestId: ID!): Request!
         signUp(username: String!, email: String!, password: String!, role: Role!): String!
         signIn(username: String, email: String, password: String!): String!
     }
 `



export default typeDefs


