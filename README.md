# Lorde's

Make sure to read this before working on the project.

This project is built on the node.js runtime, express, and graphql-yoga as the GraphQL framework.
prisma is used as the ORM for the postgres database.

## Links

- [Installation](#instalation)
- [Database](#database)




## Installation
- fork and clone the repository
- run `npm install`
- checkout to a new branch
- connect a database (preferabley postgres)
- migrate the prisma schema to the database
- run `npm run dev`
- go to localhost:3000/graphql to see graphql-yoga playground
- run prisma studio with `npm run studio`


## Database
First you have to connect prisma to a relational database. To do this you need to create a .env file with the database connection url, then you add the environment variable to the **schema.primsa** file in the prisma folder inside the `datasource db` object.

To be safe you can delete the migrations folder before regenerating the prisma client using `npm run db:generate` although running this won't be necessary. You can just directly migrate the database as it will run `prisma generate` in the background.

To migrate the database, run
`npm run db:migrate`

To open the prisma studio playground run
`npm run studio`