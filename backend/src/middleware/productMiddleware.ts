import { Request, Response, NextFunction } from 'express'

export const validateProductData = (req: Request, res: Response, next: NextFunction) => {
  const { name, price, stock } = req.body

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Product name is required and must be a valid string' })
  }

  if (price === undefined || typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Price is required and must be a positive number' })
  }

  if (stock === undefined || typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
    return res.status(400).json({ error: 'Stock is required and must be a non-negative integer' })
  }

  next()
}

export const validateProductId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const productId = parseInt(id)

  if (isNaN(productId) || productId <= 0) {
    return res.status(400).json({ error: 'Invalid product ID' })
  }

  next()
}

export const checkStockAvailability = (req: Request, res: Response, next: NextFunction) => {
  const { stock } = req.body

  if (stock !== undefined && stock < 0) {
    return res.status(400).json({ error: 'Stock cannot be negative' })
  }

  next()
}
