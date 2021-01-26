const bcryptjs = require('bcryptjs')
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

      const salt = bcryptjs.genSaltSync(10)
      input.password = bcryptjs.hashSync(password, salt)

      try {
        const user = new User(input)
        user.save()
        return user
      } catch (error) {
        console.log(error)
      }
    },
    authenticateUser: async (_, { input }) => {
      const { emai, password } = input
      const userExits = await User.findOne({ email })
      if (!userExists) throw new Error('El usuario no existe')
    }
  }
}

module.exports = resolvers
