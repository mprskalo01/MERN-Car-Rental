import { Request, Response } from 'express'
import Reservation from '../models/reservationModel'
import Car from '../models/carModel' // Assuming you have a Car model

// Function to create a reservation
const createReservation = async (req: Request, res: Response) => {
  const { fromDate, toDate, carId, totalCost } = req.body
  try {
    const car = await Car.findById(carId)
    if (!car) {
      return res.status(404).json({ message: 'Car not found' })
    }

    const reservationItem = {
      car: carId,
      name: car.name,
      image: car.images[0],
      brand: car.brand,
      pricePerDay: car.pricePerDay,
    }

    const reservation = new Reservation({
      reservationItem,
      user: req.user?._id, // Ensure req.user is defined and contains _id
      fromDate,
      toDate,
      totalCost,
    })

    car.isReserved = true
    await car.save()
    await reservation.save()

    res.status(201).json(reservation)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

// Function to get all reservations (admin only)
const getAllReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await Reservation.find({}).populate(
      'user',
      'name phoneNumber'
    )
    if (reservations.length === 0) {
      return res.status(404).json({ message: 'No reservations found' })
    }
    res.json(reservations)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

// Function to approve a reservation (admin only)
const approveReservation = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const reservation = await Reservation.findById(id)
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' })
    }
    reservation.isApproved = true
    await reservation.save()
    res.status(200).json({ message: 'Reservation approved' })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

// Function to delete a reservation (admin only)
const deleteReservation = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const reservation = await Reservation.findById(id)
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' })
    }

    const reservationItem = reservation.reservationItem
    if (reservationItem?.car) {
      const car = await Car.findById(reservationItem.car)
      if (car) {
        car.isReserved = false
        await car.save()
      }
    }

    await reservation.deleteOne() // Use deleteOne instead of remove
    res.status(200).json({ message: 'Reservation deleted' })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

// Function to get reservations by user ID
const getReservationsByUserId = async (req: Request, res: Response) => {
  try {
    const reservations = await Reservation.find({ user: req.user?._id })
    if (reservations.length === 0) {
      return res
        .status(404)
        .json({ message: 'No reservations found for this user' })
    }
    res.json(reservations)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

// Function to mark a reservation as paid
const reservationToPaid = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const reservation = await Reservation.findById(id)
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' })
    }
    reservation.isPaid = true
    reservation.paidAt = new Date()
    await reservation.save()
    res.json(reservation)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

// Function to get reservation details by ID
const reservationById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const reservation = await Reservation.findById(id)
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' })
    }
    res.json(reservation)
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'An unknown error occurred' })
    }
  }
}

export {
  createReservation,
  getAllReservations,
  approveReservation,
  deleteReservation,
  getReservationsByUserId,
  reservationToPaid,
  reservationById,
}
