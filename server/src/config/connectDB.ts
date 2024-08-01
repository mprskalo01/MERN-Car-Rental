import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined')
    }
    const connect = await mongoose.connect(mongoUri)
    console.log(`MongoDB server started: ${connect.connection.host}`)
  } catch (error: any) {
    console.error(`Error: ${error.message}`)
  }
}

export default connectDB
