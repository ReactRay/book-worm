import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import { connectDB } from './lib/db.js'
dotenv.config()

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`listening on port: http://localhost:${PORT}`)
  connectDB()
})
