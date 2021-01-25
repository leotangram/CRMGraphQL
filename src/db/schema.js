const { gql } = require('apollo-server')

const typeDefs = gql`
  type User {
    id: ID
    name: String
    surname: String
    email: String
    created: String
  }

  type Query {
    getCourse: String
  }

  type Mutation {
    newUser: String
  }
`

module.exports = typeDefs
