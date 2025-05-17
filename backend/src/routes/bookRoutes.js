import express from 'express'
import cloudinary from '../lib/cloudinary'
import Book from '../models/Book'
import protectRoute from '../middlewares/auth.middleware.js'

const router = express.Router()

//create ,delete,fetchone , fetch all

router.post('/', protectRoute, async (req, res) => {
  try {
    const { title, caption, image, rating } = req.body

    if (!image || !title || !caption || !rating) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    //upload image to cloudinary and save book to mongodb

    const uploadResponse = await cloudinary.uploader.upload(image)

    const imageUrl = uploadResponse.secure_url

    const book = new Book({
      title,
      caption,
      image: imageUrl,
      rating,
      user: req.user._id,
    })

    await book.save()

    res.status(201).json({ book })
  } catch (error) {
    console.log(error, 'error in creating book route')
    res.status(500).json({ message: 'something went wrong' })
  }
})

//pagination => infinite scroll
router.get('/', protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1
    const limit = req.query.limit || 5
    const skip = (page - 1) * limit

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username profileImage')
const totalBooks =  await Book.countDocuments()
      
    res.send({
        books,
        currentPage: page,
        totalBooks,
        totalPages:  Math.ceil(totalBooks / limit);
    })
  } catch (error) {
    console.log('error in fetching books', error)
    res.status(500).json({ message: 'something went wrong' })
  }
})

export default router
