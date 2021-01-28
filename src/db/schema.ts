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

  type Client {
    id: ID
    name: String
    surname: String
    company: String
    email: String
    phone: String
    seller: ID
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

  input ClientInput {
    name: String!
    surname: String!
    company: String!
    email: String!
    phone: String
  }

  type Query {
    # Users
    getUser(token: String!): User

    # Products
    getProducts: [Product]
    getProduct(id: ID!): Product
  }

  type Mutation {
    # Users
    newUser(input: UserInput): User
    authenticateUser(input: AuthenticateInput): Token

    # Products
    newProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): String

    # Clients
    newClient(input: ClientInput): Client
  }
`

module.exports = typeDefs
