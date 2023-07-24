
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
         catalogue: [Service]
         productCatalogue: [Product]
         role: UserRole!
         createdAt: DateTime!
         updatedAt: DateTime!
     }


     type Service{
         id: ID!
         name: String!
         price: Float!
         owner: User!
         createdAt: DateTime!
     }
     
     type Product{
        id: ID!
        name: String!
        price: Float!
        quantity: Int!
        owner: User!
        createdAt: DateTime!
     }
     
     

     enum UserRole{
         USER
         STYLIST
     }

     
     

     type Query{
        products: [Product!]
        product(id: ID!): Product!
        services: [Service!]
        service(id: ID!): Service!
        users: [User!]!
        user(username: String!): User!
        me: User!
     }

     type Mutation{
         signUp(username: String!, email: String!, password: String!, role: String!): String!
         signIn(username: String, email: String, password: String!): String!
         createService(name: String!, price: Float!): Service!
         updateService(id: ID!, name: String, price: Float): Service!
         updateProfile(bio: String, location: String): User!
         createProduct(name: String!, price: Float!, quantity: Int!): Product!
         updateProduct(id: ID!, name: String, price: Float, quantity: Int): Product!
     }
 `



export default typeDefs


