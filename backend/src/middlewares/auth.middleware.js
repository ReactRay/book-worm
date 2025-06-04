import jwt from 'jsonwebtoken'
import User from '../models/User.js'

async function protectRoute(req, res, next) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    //find user

    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      return res.status(401).json({ message: 'token not valid' })
    }
    req.user = user
    next()
  } catch (error) {
    console.log(error, 'error in auth middleware')
    res.status(401).json({ message: 'token not valid' })
  }
}

export default protectRoute
