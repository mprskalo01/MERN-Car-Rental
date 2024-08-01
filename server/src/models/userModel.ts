import mongoose, { Schema, Document, CallbackError } from 'mongoose'
import bcrypt from 'bcrypt'

// Define the user interface extending Document

interface IUser extends Document {
  name: string
  email: string
  phoneNumber: string
  isAdmin: boolean
  password: string
  comparePasswords(data: string): Promise<boolean>
}

// Define the user schema
const userSchema: Schema<IUser> = new Schema({
  password: {
    type: String,
    required: true,
  },
})

// Method to compare passwords
userSchema.methods.comparePasswords = async function (
  data: string
): Promise<boolean> {
  return await bcrypt.compare(data, this.password)
}

// Pre-save hook to hash the password
userSchema.pre('save', async function (next: (err?: CallbackError) => void) {
  const user = this as IUser // Type assertion to IUser
  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next()
  }
  try {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    next() // Call next() without arguments when successful
  } catch (error) {
    next(error as CallbackError) // Pass error to next
  }
})

// Create and export the User model
const User = mongoose.model<IUser>('User', userSchema)

export default User
