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


router.delete('/:id', protectRoute, async (req, res) => {
  try {
    const { id } = req.params
    
    const book = await Book.findById(id)
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }
    
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    
    if(book.image && book.image.includes('cloudinary')){
       try {
        await cloudinary.uploader.destroy(book.image.split('/').pop())
       } catch (error) {
        console.log(error, 'error in deleting image from cloudinary')
       }
    }
    
    
    await book.deleteOne()
    
    res.status(200).json({ message: 'Book deleted successfully' })
  
  } catch (error) {
    console.log(error, 'error in deleting book')
    res.status(500).json({ message: 'something went wrong' })
  }
})


router.get('/user' , async (req,res) => {
    
    
    try {
        const books = await Book.find({user: req.user._id}).sort({createdAt: -1})
        res.send(books)
    } catch (error) {
        console.log(error, 'error in fetching user books')
        res.status(500).json({ message: 'server error' })
    }
})
export default router
