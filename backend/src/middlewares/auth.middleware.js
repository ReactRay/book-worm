import jwt from 'jsonwebtoken'
import User from '../models/User.js'

async function protectRoute(req, res, next) {
  try {
    const authHeader = req.header('Authorization')
    console.log('🔐 Received Authorization header:', authHeader)

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No valid auth header' })
    }

    const token = authHeader.split(' ')[1]
    console.log('🧾 Extracted token:', token)

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'token not valid' })
    }

    req.user = user
    next()
  } catch (error) {
    console.log('❌ Error in auth middleware:', error.message)
    res.status(401).json({ message: 'token not valid' })
  }
}

export default protectRoute
