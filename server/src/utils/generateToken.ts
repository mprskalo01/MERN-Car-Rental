import jwt from 'jsonwebtoken'

// Define a type for the `id` parameter, assuming it's a string.
// If it's a number, you can change `string` to `number` accordingly.
type GenerateTokenParams = string

export default function generateToken(id: GenerateTokenParams): string {
  // Ensure process.env.JWT_SECRET is defined
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not defined')
  }

  return jwt.sign({ id }, secret, { expiresIn: '10 days' })
}
