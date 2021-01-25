const { gql } = require('apollo-server')

const typeDefs = gql`
  type Query {
    getCourse: String
  }
`

module.exports = typeDefs
