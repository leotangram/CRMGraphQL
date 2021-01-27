import { IUser } from '../interfaces/IUser'
import { IProduct } from '../interfaces/IProduct'
require('dotenv').config({ path: '.env' })
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Product = require('../models/Product')

const createToken = (user: IUser, secretWord: string, expiresIn: string) => {
  const { id, email, name, surname } = user
  return jwt.sign({ id, email, name, surname }, secretWord, { expiresIn })
}

const resolvers = {
  Query: {
    getUser: async (_: any, { token }: { token: string }): Promise<string> => {
      const secretWord = process.env.SECRET_WORD
      const userId = await jwt.verify(token, secretWord)
      return userId
    },
    getProducts: async () => {
      try {
        const products = await Product.find({})
        return products
      } catch (error) {
        console.log(error)
      }
    },
    getProduct: async (_: any, { id }: { id: string }) => {
      const product = await Product.findById(id)
      if (!product) throw new Error('Producto no encontrado')
      return product
    }
  },
  Mutation: {
    newUser: async (_: any, { input }: { input: IUser }) => {
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
    authenticateUser: async (_: any, { input }: { input: IUser }) => {
      const { email, password } = input
      const userExists = await User.findOne({ email })
      if (!userExists) throw new Error('El usuario no existe')

      const correctPassword = await bcryptjs.compare(
        password,
        userExists.password
      )
      if (!correctPassword) throw new Error('El password es incorrecto')

      return {
        token: createToken(userExists, <string>process.env.SECRET_WORD, '24h')
      }
    },
    newProduct: async (_: any, { input }: { input: IProduct }) => {
      try {
        const product = new Product(input)
        const result = await product.save()
        return result
      } catch (error) {
        console.log(error)
      }
    },
    updateProduct: async (
      _: any,
      { id, input }: { id: string; input: IProduct }
    ) => {
      let product = await Product.findById(id)
      if (!product) throw new Error('Producto no encontrado')
      product = await Product.findOneAndUpdate({ _id: id }, input, {
        new: true
      })
      return product
    },
    deleteProduct: async (_: any, { id }: { id: string }) => {
      const product = await Product.findById(id)
      if (!product) throw new Error('Producto no encontrado')
      await Product.findOneAndDelete({ _id: id })
      return 'Producto eliminado'
    }
  }
}

module.exports = resolvers
