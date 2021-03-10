const { ApolloServer } = require('apollo-server')
const jwt = require('jsonwebtoken')
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')
const dbConnect = require('./config/db')
require('dotenv').config({ path: '.env' })

dbConnect()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }: { req: { headers: { authorization: string } } }) => {
    const token = req.headers.authorization || ''
    if (token) {
      try {
        const secretWord = process.env.SECRET_WORD
        const user = jwt.verify(token, secretWord)
        return { user }
      } catch (error) {}
    }
  }
})

server
  .listen({ port: process.env.PORT || 4000 })
  .then(({ url }: { url: string }) => {
    console.log(`Server ready in URL: ${url}`)
  })
