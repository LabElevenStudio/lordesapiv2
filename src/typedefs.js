
 const typeDefs = `
     scalar DateTime
     
    interface Profile{
        id: ID!
        bio: String
        location: String
     }

     type User implements Profile{
         id: ID!
         username: String!
         email: String!
         password: String!
         bio: String
         location: String
         serviceRequests: [ServiceRequest]
         role: UserRole!
         createdAt: DateTime!
         updatedAt: DateTime!
     }
     
     type Stylist implements Profile{
        id: ID!
        username: String!
        email: String!
        password: String!
        bio: String
        location: String
        catalogue: [Service]
        productCatalogue: [Product]
        serviceRequests: [ServiceRequest]
        role: UserRole!
        createdAt: DateTime!
        updatedAt: DateTime!
     }


     type Service{
         id: ID!
         name: String!
         price: Float!
         owner: Stylist!
         createdAt: DateTime!
     }

     type ServiceRequest{
         id: ID!
         message: String
         sender: User!
         receiver: Stylist!
         status: ServiceRequestStatus!
         createdAt: DateTime!
         updatedAt: DateTime!
     }
     
     type Product{
        id: ID!
        name: String!
        price: Float!
        owner: Stylist!
        quantity: Int!
        createdAt: DateTime!
     }
     
     

     enum UserRole{
         USER
         STYLIST
     }

     enum ServiceRequestStatus{
         REQUESTED
         REJECTED
         ACCEPTED
     }
     
     
     

     type Query{
        products: [Product!]
        product(name: String!): Product!
        sentServiceRequests: [ServiceRequest!]
        recievedServiceRequests: [ServiceRequest!]
        acceptedServiceRequests: [ServiceRequest!]
        stylists: [Stylist!]!
        stylist(username: String!): Stylist!
        users: [User!]!
        user(username: String!): User!
        userSelf: User!
        stylistSelf: Stylist!
     }

     type Mutation{
         createProduct(name: String!, price: Float!, quantity: Int!): Product!
         updateProduct(id: ID!, name: String, price: Float, quantity: Int): Product
         updateStylistProfile(bio: String, location: String): Stylist!
         updateUserProfile(bio: String, location: String): User!
         createService(name: String!, price: Float!): Service!
         updateService(id: ID!, name: String, price: Float): Service!
         sendServiceRequest(stylistId: ID!, message: String): ServiceRequest!
         updateSerivceRequestStatus(requestId: ID!, status: ServiceRequestStatus!): ServiceRequest!
         userSignUp(username: String!, email: String!, password: String!): String!
         userSignIn(username: String, email: String, password: String!): String!
         stylistSignUp(username: String!, email: String!, password: String!): String!
         stylistSignIn(username: String, email: String, password: String!): String!
     }
 `



export default typeDefs


