import express from 'express'
import {
  createReservation,
  getAllReservations,
  approveReservation,
  deleteReservation,
  getReservationsByUserId,
  reservationToPaid,
  reservationById,
} from '../controllers/reservationController'
import { protect, admin } from '../middlewares/authMiddleware'

const router = express.Router()

// Route to create a reservation
router.route('/create').post(protect, createReservation)

// Route to get all reservations (admin only)
router.route('/admin').get(protect, admin, getAllReservations)

// Route to approve a reservation (admin only)
router.route('/admin/approve/:id').put(protect, admin, approveReservation)

// Route to delete a reservation (admin only)
router.route('/admin/delete/:id').delete(protect, admin, deleteReservation)

// Route to get reservations by user ID
router.route('/').get(protect, getReservationsByUserId)

// Route to mark a reservation as paid
router.route('/:id/paid').put(protect, reservationToPaid)

// Route to get reservation details by ID
router.route('/:id/details').get(protect, reservationById)

export default router
