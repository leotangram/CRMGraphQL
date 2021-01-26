require('dotenv').config({ path: '.env' })
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const createToken = (user, secretWord, expiresIn) => {
  const { id, email, name, surname } = user
  return jwt.sign({ id, email, name, surname }, secretWord, { expiresIn })
}

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
      const { email, password } = input
      const userExists = await User.findOne({ email })
      if (!userExists) throw new Error('El usuario no existe')

      const correctPassword = await bcryptjs.compare(
        password,
        userExists.password
      )
      if (!correctPassword) throw new Error('El password es incorrecto')

      return {
        token: createToken(userExists, process.env.SECRET_WORD, '24h')
      }
    }
  }
}

module.exports = resolvers
