export {}
const mongoose = require('mongoose')
require('dotenv').config({ path: '.env' })

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    console.log('DB connected')
  } catch (error) {
    console.log('Hubo un error')
    console.log(error)
    process.exit(1) // Stop the App
  }
}

module.exports = dbConnect
