import { Request, Response, NextFunction } from 'express'

export const validateUserData = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body

  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' })
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password is required and must be at least 6 characters long' })
  }

  if (name && (typeof name !== 'string' || name.trim().length === 0)) {
    return res.status(400).json({ error: 'Name must be a valid string if provided' })
  }

  next()
}

export const validateUserUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { email, name, phone } = req.body

  if (email && (typeof email !== 'string' || !isValidEmail(email))) {
    return res.status(400).json({ error: 'Email must be valid if provided' })
  }

  if (name && (typeof name !== 'string' || name.trim().length === 0)) {
    return res.status(400).json({ error: 'Name must be a valid string if provided' })
  }

  if (phone && typeof phone !== 'string') {
    return res.status(400).json({ error: 'Phone must be a valid string if provided' })
  }

  next()
}

export const validateUserId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const userId = parseInt(id)

  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ error: 'Invalid user ID' })
  }

  next()
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
