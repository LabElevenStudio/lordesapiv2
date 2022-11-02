import express from 'express'
import {createServer} from '@graphql-yoga/node'
import {PrismaClient} from '@prisma/client'
// import { makeExecutableSchema } from '@graphql-tools/schema'
import typeDefs from './typedefs'
import {resolvers} from './resolvers'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

const prisma = new PrismaClient()

function getUser(token) {
    // console.log('token',token)
    if(token){
        try {
            // console.log('verify', jwt.verify(token, process.env.JWT_SECRET))
            return jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            throw new Error('Session Invalid')
        }
    }
}


const graphQLServer = createServer({
    schema:{
        typeDefs: typeDefs,
        resolvers: resolvers
    },
    context({req}) {
        const token = req.headers.authorization
        const user = getUser(token)
        return{prisma, user}
    }
})


app.use(cors())
app.use('/graphql', graphQLServer)


app.listen(4000, () => {
    console.log("🚀 GraphQL API server running at http://localhost:4000/graphql")
})



