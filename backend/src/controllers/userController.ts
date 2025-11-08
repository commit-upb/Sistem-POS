import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        roles: true,
        createdAt: true,
        updatedAt: true
      }
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        roles: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
}
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, phone, name } = req.body
    const user = await prisma.user.create({
      data: { email, password, phone, name },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    })
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { email, phone, name } = req.body
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { email, phone, name },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        updatedAt: true
      }
    })
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.user.delete({
      where: { id: parseInt(id) }
    })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' })
  }
}
