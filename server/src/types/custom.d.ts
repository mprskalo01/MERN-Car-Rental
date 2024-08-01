// src/types/custom.d.ts
import { User } from '../models/userModel' // Import the User type if it's available

declare global {
  namespace Express {
    interface Request {
      user?: User // Extend the Request interface to include user
    }
  }
}
