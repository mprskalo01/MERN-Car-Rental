import { Request, Response, NextFunction } from 'express'
import User from '../models/userModel'
import generateToken from '../utils/generateToken'

// Type definitions for request body and params
interface LoginRequestBody {
  email: string
  password: string
}

interface RegisterRequestBody {
  name: string
  email: string
  password: string
  phoneNumber: string
}

interface UpdateUserRequestBody {
  email?: string
  password?: string
  phoneNumber?: string
  name?: string
  isAdmin?: boolean
}

interface UpdateUserParams {
  id: string
}

// Middleware function types
const loginUser = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (user && (await user.comparePasswords(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin,
        token: generateToken(
          (user as { _id: string | { toString(): string } })._id.toString()
        ),
      })
    } else {
      res.status(401).json({
        message: 'Invalid email or password!',
      })
    }
  } catch (error) {
    next(error)
  }
}

const registerUser = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, phoneNumber } = req.body
    const userExist = await User.findOne({ email })

    if (userExist) {
      res.status(400)
      throw new Error('User already exists')
    }

    const user = await User.create({
      name,
      email,
      phoneNumber,
      password,
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin,
        token: generateToken(
          (user as { _id: string | { toString(): string } })._id.toString()
        ),
      })
    } else {
      res.status(400)
      throw new Error('Invalid user data')
    }
  } catch (error) {
    next(error)
  }
}

const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id)

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin,
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  } catch (error) {
    next(error)
  }
}

const getUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id)

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin,
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  } catch (error) {
    next(error)
  }
}

const updateUserById = async (
  req: Request<{}, {}, UpdateUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, phoneNumber } = req.body
    const user = await User.findById(req.user._id)

    if (user) {
      user.email = email || user.email
      user.phoneNumber = phoneNumber || user.phoneNumber

      if (password) {
        user.password = password
      }

      const updatedUser = await user.save()

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(
          (user as { _id: string | { toString(): string } })._id.toString()
        ),
      })
    } else {
      res.status(404).json({ message: 'Could not update user!' })
    }
  } catch (error) {
    next(error)
  }
}

const updateUsersById = async (
  req: Request<UpdateUserParams, {}, UpdateUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, isAdmin, phoneNumber } = req.body
    const { id } = req.params

    const user = await User.findById(id)

    if (user) {
      user.name = name || user.name
      user.email = email || user.email
      user.phoneNumber = phoneNumber || user.phoneNumber
      user.isAdmin = isAdmin || user.isAdmin

      const updatedUser = await user.save()

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      })
    } else {
      res.status(404)
      throw new Error('Could not update user!')
    }
  } catch (error) {
    next(error)
  }
}

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({})
    if (users.length > 0) {
      res.json(users)
    } else {
      res.status(404)
      throw new Error('Could not find any user!')
    }
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id)

    if (user) {
      await user.deleteOne()
      res.json({ message: 'User deleted' })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  } catch (error) {
    next(error)
  }
}

export {
  loginUser,
  getUserById,
  updateUserById,
  updateUsersById,
  registerUser,
  getAllUsers,
  deleteUser,
  getUser,
}
