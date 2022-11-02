import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

// const prisma = new PrismaClient()

// function getUser(token) {
//     if(token){
//         try {
//             return jwt.verify(token, process.env.JWT_SECRET)
//         } catch (error) {
//             throw new Error('Session Invalid')
//         }
//     }
// }

// async function context({req}){
//     const token = req.headers.authorization
//     const user = getUser(token)
//     return {prisma, user}
// }

const messages = []

export default messages
