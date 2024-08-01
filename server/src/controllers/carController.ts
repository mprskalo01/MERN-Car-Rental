import { Request, Response, NextFunction } from 'express'
import Car from '../models/carModel' // Import the Car model

// Define types for request query parameters and body
interface CarQuery {
  rangeValue?: string
  pageNumber?: string
}

interface CreateCarBody {
  name: string
  brand: string
  pricePerDay: number
  transmission: string
  yearModel: number
  seatCapacity: number
  fuelType: string
  images: { Location: string }[]
}

interface UpdateCarBody {
  name?: string
  brand?: string
  pricePerDay?: number
  transmission?: string
  yearModel?: number
  seatCapacity?: number
  fuelType?: string
  images?: string[]
}

// Middleware function types
const getCars = async (
  req: Request<{}, {}, {}, CarQuery>,
  res: Response,
  next: NextFunction
) => {
  const rangeValue = +(req.query.rangeValue ?? 0) // Use nullish coalescing to provide a fallback value
  const pageNumber = +(req.query.pageNumber ?? 1) // Use nullish coalescing to provide a fallback value
  const carLimit = 6

  try {
    const cars = await Car.find({})
      .limit(carLimit)
      .where('pricePerDay')
      .skip(carLimit * (pageNumber - 1))
      .gte(rangeValue)

    const carCount = await Car.countDocuments()

    res.status(200).json({
      cars,
      page: pageNumber,
      pages: Math.ceil(carCount / carLimit),
    })
  } catch (error) {
    res.status(500).json({
      errorMsg: 'Something went wrong',
      message: (error as Error).message,
    })
  }
}

const getCarById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const car = await Car.findById(req.params.id)
  if (car) {
    res.status(200).json(car)
  } else {
    res.status(500).json({ message: 'Car not found' })
  }
}

const getAllCars = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cars = await Car.find({})
    res.status(200).json(cars)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: (error as Error).message,
    })
  }
}

const deleteCarById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  try {
    const car = await Car.findById(id)
    if (car) {
      await car.deleteOne()
      res.status(200).json('Car deleted')
    } else {
      res.status(404).json({ message: 'Car not found' })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: (error as Error).message,
    })
  }
}

const updateCarById = async (
  req: Request<{ id: string }, {}, UpdateCarBody>,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    brand,
    pricePerDay,
    transmission,
    yearModel,
    seatCapacity,
    fuelType,
    images,
  } = req.body

  const { id } = req.params

  try {
    const car = await Car.findById(id)

    if (car) {
      car.name = name || car.name
      car.brand = brand || car.brand
      car.pricePerDay = pricePerDay || car.pricePerDay
      car.transmission = transmission || car.transmission
      car.yearModel = yearModel || car.yearModel
      car.seatCapacity = seatCapacity || car.seatCapacity
      car.fuelType = fuelType || car.fuelType

      // Handle update of images if necessary
      car.images = images || car.images

      const updatedCar = await car.save()

      res.json({
        _id: updatedCar._id,
        name: updatedCar.name,
        brand: updatedCar.brand,
        pricePerDay: updatedCar.pricePerDay,
        transmission: updatedCar.transmission,
        yearModel: updatedCar.yearModel,
        seatCapacity: updatedCar.seatCapacity,
        fuelType: updatedCar.fuelType,
        images: updatedCar.images,
      })
    } else {
      res.status(404)
      throw new Error('Car not found!')
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: (error as Error).message,
    })
  }
}

const createCar = async (
  req: Request<{}, {}, CreateCarBody>,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    brand,
    pricePerDay,
    transmission,
    yearModel,
    seatCapacity,
    fuelType,
    images,
  } = req.body

  try {
    let urlImages: string[] = []
    for (const image of images) {
      urlImages.push(image.Location)
    }

    if (urlImages.length > 0) {
      const car = new Car({
        user: req.user?._id, // Ensure req.user is properly typed and exists
        name,
        brand,
        pricePerDay,
        transmission,
        yearModel,
        seatCapacity,
        fuelType,
        images: urlImages,
      })

      const createdCar = await car.save()
      res.status(201).json(createdCar)
    } else {
      res.status(400).json({
        success: false,
        message: 'Something went wrong',
        error: 'No images provided',
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: (error as Error).message,
    })
  }
}

export {
  getCars,
  getCarById,
  getAllCars,
  deleteCarById,
  updateCarById,
  createCar,
}
