import express from 'express'
import {createYoga, createSchema, createPubSub, pipe, filter} from 'graphql-yoga'
// import { useCSRFPrevention } from '@graphql-yoga/plugin-csrf-prevention'
import {PrismaClient} from '@prisma/client'
import typeDefs from './typedefs'
import { resolvers } from './resolvers'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import dotenv from 'dotenv'
dotenv.config()

//TODO: refactor code to typescript.

const app = express()

const prisma = new PrismaClient()

const pubSub = createPubSub()

function getUser(token) {
    if(token){
        try {
            return jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            throw new Error('Session Invalid')
        }
    }
}

//multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})


const upload = multer ({storage})





const yoga = createYoga({
    schema: createSchema({typeDefs, resolvers}),
    // plugins: [
    //     useCSRFPrevention({
    //         requestHeaders: ['x-graphql-yoga-csrf'] // default
    //     })
    // ],
    context({req}) {
        const token = req.headers.authorization
        const user = getUser(token)
        return{prisma, user, pubSub, pipe, filter}
    }  
})

app.use(cors())
// app.use(express.json())
app.use(upload.single('file'))
// app.use(yoga.graphqlEndpoint, (req, res, next) => {
//     req.headers['x-graphql-yoga-csrf'] = req.body.csrfToken
//     next()
// })
app.use(yoga.graphqlEndpoint, yoga)



app.listen(3000, () => {
    console.log("🚀 GraphQL API server running at http://localhost:3000/graphql")
})



