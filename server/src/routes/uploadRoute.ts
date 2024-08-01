import express, { Request, Response } from 'express'
import multer, { FileFilterCallback, StorageEngine } from 'multer'

// Create a router instance
const router = express.Router()

// Define a custom type for the file object
interface CustomFile extends Express.Multer.File {
  buffer: Buffer
}

// Configure multer storage
const storage: StorageEngine = multer.memoryStorage()

// Define the file filter function
const fileFilter: (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => void = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/png',
    'image/jpg',
    'image/webp',
    'image/jpeg',
  ]

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only .png, .jpg, .jpeg, and .webp formats are allowed!'))
  }
}

// Initialize multer with the storage and file filter
const upload = multer({
  storage,
  fileFilter,
})

// Define the route handler for uploading files
router.post(
  '/',
  upload.array('images', 5),
  async (req: Request, res: Response) => {
    try {
      // Type assertion for req.files
      const files = req.files as CustomFile[]

      // Example code to save files
      const savedFiles = files.map((file) => ({
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer, // This would typically be saved to MongoDB as a Binary object
      }))

      // Example: save files to MongoDB
      // const results = await File.create(savedFiles);

      res.json(savedFiles)
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Something went wrong',
        error: (error as Error).message,
      })
    }
  }
)

// Define the route handler for updating files
router.post(
  '/update',
  upload.array('images', 5),
  async (req: Request, res: Response) => {
    try {
      // Type assertion for req.files
      const files = req.files as CustomFile[]

      // Example code to save files
      const savedFiles = files.map((file) => ({
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer, // This would typically be saved to MongoDB as a Binary object
      }))

      // Example: save files to MongoDB
      // const results = await File.create(savedFiles);

      res.json(savedFiles)
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Something went wrong',
        error: (error as Error).message,
      })
    }
  }
)

export default router
