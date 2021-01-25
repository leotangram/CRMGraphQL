const resolvers = {
  Query: {
    getCourse: () => 'Holi'
  },
  Mutation: {
    newUser: (_, { input }) => {
      console.log(input)
      return 'Creating...'
    }
  }
}

module.exports = resolvers
