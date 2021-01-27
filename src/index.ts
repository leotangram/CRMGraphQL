const { ApolloServer } = require('apollo-server')
const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')
const dbConnect = require('./config/db')

dbConnect()

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({ url }: { url: string }) => {
  console.log(`Server ready in URL: ${url}`)
})
