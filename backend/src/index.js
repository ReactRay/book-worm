import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import bookRoutes from './routes/bookRoutes.js'
import bodyParser from 'body-parser'
import { connectDB } from './lib/db.js'
import cors from 'cors'

dotenv.config()

// ✅ Initialize app FIRST
const app = express()

// ✅ Now use middleware
app.use(bodyParser.json({ limit: '5mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }))
app.use(express.json())
app.use(cors())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`listening on port: http://localhost:${PORT}`)
  connectDB()
})
