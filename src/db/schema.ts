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

  type Order {
    id: ID
    order: [OrderGroup]
    total: Float
    client: Client
    seller: ID
    created: String
    state: OrderState
  }

  type OrderGroup {
    id: ID
    quantity: Int
    name: String
    price: Float
  }

  type TopClient {
    total: Float
    client: [Client]
  }

  type TopSeller {
    total: Float
    seller: [User]
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

  input OrderProductInput {
    id: ID
    quantity: Int
    name: String
    price: Float
  }

  input OrderInput {
    order: [OrderProductInput]
    total: Float
    client: ID
    state: OrderState
  }

  enum OrderState {
    PENDING
    COMPLETED
    CANCELLED
  }

  type Query {
    # Users
    getUser: User

    # Products
    getProducts: [Product]
    getProduct(id: ID!): Product

    # Clients
    getClients: [Client]
    getClientsSeller: [Client]
    getClient(id: ID!): Client

    # Orders
    getOrders: [Order]
    getOrdersSeller: [Order]
    getOrder(id: ID!): Order
    getOrdersByState(state: String!): [Order]

    # Advanced Searchs
    bestClients: [TopClient]
    bestSellers: [TopSeller]
    searchProduct(text: String!): [Product]
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
    updateClient(id: ID!, input: ClientInput): Client
    deleteClient(id: ID!): String

    #Orders
    newOrder(input: OrderInput): Order
    updateOrder(id: ID!, input: OrderInput): Order
    deleteOrder(id: ID!): String
  }
`

module.exports = typeDefs
