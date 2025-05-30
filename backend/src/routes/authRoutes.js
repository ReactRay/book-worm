import express from 'express'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

const generateAuthToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' })
}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const userExist = await User.findOne({ email })

    if (!userExist) {
      return res.status(400).json({ message: 'invalid credintials' })
    }

    //check password is correct

    const isPasswordCorrect = await userExist.comparePassword(password)

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = generateAuthToken(userExist._id)

    res.status(200).json({
      token,
      user: {
        id: userExist._id,
        username: userExist.username,
        email: userExist.email,
        profileImage: userExist.profileImage,
      },
    })
  } catch (error) {
    console.log(error, 'error in login route')
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body
    console.log(email, username, password)
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' })
    }

    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: 'Username must be at least 3 characters' })
    }

    //check user existence

    const existingUserName = await User.findOne({ username })
    if (existingUserName) {
      return res.status(400).json({ message: 'Username already exists' })
    }
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`

    const user = new User({ email, username, password, profileImage })

    await user.save()

    const token = generateAuthToken(user._id)

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    })
  } catch (error) {
    console.log(error, 'error in signup')
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
