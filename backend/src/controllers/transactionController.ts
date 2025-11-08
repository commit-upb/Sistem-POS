import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { user: true }
    })
    res.json(transactions)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
}

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) },
      include: { user: true }
    })
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' })
    }
    
    res.json(transaction)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction' })
  }
}

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { userId, totalAmount } = req.body
    const transaction = await prisma.transaction.create({
      data: { userId, totalAmount },
      include: { user: true }
    })
    res.status(201).json(transaction)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' })
  }
}

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { totalAmount } = req.body
    const transaction = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: { totalAmount },
      include: { user: true }
    })
    res.json(transaction)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction' })
  }
}

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.transaction.delete({
      where: { id: parseInt(id) }
    })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' })
  }
}
