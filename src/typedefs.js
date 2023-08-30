
 const typeDefs = `
     scalar DateTime
     scalar File
     
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
         profileImage: ProfileImage
         bio: String
         location: String
         catalogue: [Service]
         catalogueCount: Int!
         productCatalogue: [Product]
         productCatalogueCount: Int!
         sentNotifications: [ServiceNotification]
         receivedNotifications: [ServiceNotification]
         chats: [Chat!]
         messages: [Message!]
         role: UserRole!
         createdAt: DateTime!
         updatedAt: DateTime!
     }
     
     type ProfileImage{
        id: ID!
        filename: String!
        mimetype: String!
        encoding: String!
        url: String!
        owner: User!
     }
     
     
     type ServiceImage{
        id: ID!
        filename: String!
        mimetype: String!
        encoding: String!
        url: String!
        service: Service!
     }
     
     type ProductImage{
        id: ID!
        filename: String!
        mimetype: String!
        encoding: String!
        url: String!
        product: Product!
     }


     type Service{
         id: ID!
         photos: [ServiceImage]
         name: String!
         price: Float!
         owner: User!
         createdAt: DateTime!
     }
     
     
     type Product{
        id: ID!
        photos: [ProductImage]
        name: String!
        price: Float!
        quantity: Int!
        owner: User!
        createdAt: DateTime!
     }
     
     
     type ServiceNotification{
      id: ID!
      message: String!
      sender: User!
      receiver: User!
     }
     
     type Message{
      id: ID!
      content: String!
      sender: User!
      chat: Chat!
      sentAt: DateTime!
     }
     
     type Chat{
      id: ID!
      participants: [User!]
      messages: [Message!]
      createdAt: DateTime!
     }
     
     enum UserRole{
         USER
         STYLIST
         MERCHANT
     }
     
     input chatInput{
      userOne: ID!
      userTwo: ID!
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
        uploadProfileImage(file: File!): ProfileImage!
        uploadServiceImage(file: File!, serviceId: ID!): ServiceImage!
        uploadProductImage(file: File!, productId: ID!): ProductImage!
        bookService(receiverId: ID!, message: String!): ServiceNotification!
        createChat(userIds: chatInput!): Chat!
        sendMessage(chatId: ID!, content: String!): Message
     }
     
     type Subscription{
         newNotification: ServiceNotification!
         newMessage(chatId: ID!): Message!
      }
     
 `



export default typeDefs



