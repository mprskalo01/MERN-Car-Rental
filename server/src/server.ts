import express, { json } from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import path from 'path'
import connectDB from './config/connectDB'

config()
connectDB()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(json())
app.use('/uploads', express.static('uploads'))

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
