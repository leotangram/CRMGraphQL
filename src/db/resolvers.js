const User = require('../models/User')

const resolvers = {
  Query: {
    getCourse: () => 'Holi'
  },
  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password } = input
      const userExists = await User.findOne({ email })
      if (userExists) throw new Error('El usuario ya está registrado')

      try {
        const user = new User(input)
        user.save()
        return user
      } catch (error) {
        console.log(error)
      }
    }
  }
}

module.exports = resolvers
