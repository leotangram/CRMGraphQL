const { gql } = require('apollo-server')

const typeDefs = gql`
  type Course {
    title: String
  }

  type Technology {
    technology: String
  }

  input CourseInput {
    technology: String
  }

  type Query {
    getCourses(input: CourseInput!): [Course]
    getTechnology: [Technology]
  }
`

module.exports = typeDefs
