const { gql } = require('apollo-server')

const typeDefs = gql`
  type User {
    id: ID
    name: String
    surname: String
    email: String
    created: String
  }

  type Token {
    token: String
  }

  input UserInput {
    name: String!
    surname: String!
    email: String!
    password: String!
  }

  input AuthenticateInput {
    email: String!
    password: String!
  }

  type Query {
    getCourse: String
  }

  type Mutation {
    newUser(input: UserInput): User
    authenticateUser(input: AuthenticateInput): Token
  }
`

module.exports = typeDefs
