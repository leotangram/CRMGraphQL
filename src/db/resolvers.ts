import { IUser } from '../interfaces/IUser'
import { IProduct } from '../interfaces/IProduct'
import { IClient } from '../interfaces/IClient'
import { IOrder } from 'interfaces/IOrder'
require('dotenv').config({ path: '.env' })
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Product = require('../models/Product')
const Client = require('../models/Client')
const Order = require('../models/Order')

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
    },
    getClients: async () => {
      try {
        const clients = await Client.find({})
        return clients
      } catch (error) {
        console.log(error)
      }
    },
    getClientsSeller: async (_: any, $: any, ctx: { user: IUser }) => {
      try {
        const clients = await Client.find({ seller: ctx.user.id?.toString() })
        return clients
      } catch (error) {
        console.log(error)
      }
    },
    getClient: async (_: any, { id }: { id: string }, ctx: { user: IUser }) => {
      const client: IClient = await Client.findById(id)
      if (!client) throw new Error('Cliente no encontrado')
      if (client.seller.toString() !== ctx.user.id) {
        throw new Error('No es tu cliente')
      }
      return client
    },
    getOrders: async () => {
      try {
        const orders = await Order.find({})
        return orders
      } catch (error) {
        console.log(error)
      }
    },
    getOrdersSeller: async (_: any, $: any, ctx: { user: IUser }) => {
      try {
        const orders = await Order.find({ seller: ctx.user.id })
        return orders
      } catch (error) {
        console.log(error)
      }
    },
    getOrder: async (_: any, { id }: { id: string }, ctx: { user: IUser }) => {
      const order: IOrder = await Order.findById(id)
      if (!order) throw new Error('Pedido no encontrado')
      if (order.seller?.toString() !== ctx.user.id) {
        throw new Error('No tienes las credenciales')
      }
      return order
    },
    getOrdersByState: async (
      _: any,
      { state }: { state: string },
      ctx: { user: IUser }
    ) => {
      const orders = await Order.find({ seller: ctx.user.id, state })
      return orders
    },
    bestClients: async () => {
      const clients = await Order.aggregate([
        { $match: { state: 'COMPLETED' } },
        {
          $group: {
            _id: '$client',
            total: { $sum: '$total' }
          }
        },
        {
          $lookup: {
            from: 'clients',
            localField: '_id',
            foreignField: '_id',
            as: 'client'
          }
        },
        {
          $limit: 10
        },
        {
          $sort: {
            total: -1
          }
        }
      ])
      return clients
    },
    bestSellers: async () => {
      const sellers = await Order.aggregate([
        { $match: { state: 'COMPLETED' } },
        {
          $group: {
            _id: '$seller',
            total: { $sum: '$total' }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'seller'
          }
        },
        {
          $limit: 3
        },
        {
          $sort: {
            total: -1
          }
        }
      ])
      return sellers
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
    },
    newClient: async (
      _: any,
      { input }: { input: IClient },
      ctx: { user: IUser }
    ) => {
      const { email } = input
      const client = await Client.findOne({ email })
      if (client) throw new Error('Ese cliente ya está registrado')
      const newClient = new Client(input)
      newClient.seller = ctx.user.id
      try {
        const result = await newClient.save()
        return result
      } catch (error) {
        console.log(error)
      }
    },
    updateClient: async (
      _: any,
      { id, input }: { id: string; input: IClient },
      ctx: { user: IUser }
    ) => {
      let client: IClient = await Client.findById(id)
      if (!client) throw new Error('Ese cliente no existe')
      if (client.seller.toString() !== ctx.user.id) {
        throw new Error('Ese cliente no lo puedes editar')
      }
      client = await Client.findOneAndUpdate({ _id: id }, input, { new: true })
      return client
    },
    deleteClient: async (
      _: any,
      { id }: { id: string },
      ctx: { user: IUser }
    ) => {
      const client: IClient = await Client.findById(id)
      if (!client) throw new Error('Ese cliente no existe')
      if (client.seller.toString() !== ctx.user.id) {
        throw new Error('Ese cliente no lo puedes editar')
      }
      await Client.findOneAndDelete({ _id: id })
      return 'Cliente eliminado'
    },
    newOrder: async (
      _: any,
      { input }: { input: IOrder },
      ctx: { user: IUser }
    ) => {
      const { client } = input
      const clientExists = await Client.findById(client)
      if (!clientExists) throw new Error('Ese cliente no existe')
      if (clientExists.seller.toString() !== ctx.user.id) {
        throw new Error('No tienes las credenciales')
      }
      for await (const article of input.order) {
        const { id } = article
        const product = await Product.findById(id)
        if (article.quantity > product.existence) {
          throw new Error(
            `El artículo: ${product.name} excede la cantidad disponible`
          )
        } else {
          product.existence = product.existence - article.quantity
          await product.save()
        }
      }
      const newOrder = new Order(input)
      newOrder.seller = ctx.user.id
      const result = await newOrder.save()
      return result
    },
    updateOrder: async (
      _: any,
      { id, input }: { id: string; input: IOrder },
      ctx: { user: IUser }
    ) => {
      const { client } = input
      const orderExists = await Order.findById(id)
      if (!orderExists) {
        throw new Error('El pedido no existe')
      }
      const clientExists: IClient = await Client.findById(client)
      if (!clientExists) {
        throw new Error('El Cliente no existe')
      }
      if (clientExists.seller.toString() !== ctx.user.id) {
        throw new Error('No tienes las credenciales')
      }
      if (input.order) {
        for await (const article of input.order) {
          const { id } = article
          const product = await Product.findById(id)
          if (article.quantity > product.existence) {
            throw new Error(
              `El articulo: ${product.name} excede la cantidad disponible`
            )
          } else {
            product.existence = product.existence - article.quantity

            await product.save()
          }
        }
      }
      const result = await Order.findOneAndUpdate({ _id: id }, input, {
        new: true
      })
      return result
    },
    deleteOrder: async (
      _: any,
      { id }: { id: string },
      ctx: { user: IUser }
    ) => {
      const order: IOrder = await Order.findById(id)
      if (!order) throw new Error('El pedido no existe')
      if (order.seller?.toString() !== ctx.user.id) {
        throw new Error('No tienes las credenciales')
      }
      await Order.findOneAndDelete({ _id: id })
      return 'Pedido eliminado'
    }
  }
}

module.exports = resolvers
