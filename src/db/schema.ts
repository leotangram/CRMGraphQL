export {}
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

  type Product {
    id: ID
    name: String
    existence: Int
    price: Float
    created: String
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

  input ProductInput {
    name: String!
    existence: Int!
    price: Float!
  }

  type Query {
    getUser(token: String!): User
  }

  type Mutation {
    # Users
    newUser(input: UserInput): User
    authenticateUser(input: AuthenticateInput): Token

    # Products
    newProduct(input: ProductInput): Product
  }
`

module.exports = typeDefs
