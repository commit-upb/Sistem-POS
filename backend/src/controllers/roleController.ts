import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany({
      include: { users: true }
    })
    res.json(roles)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roles' })
  }
}

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const role = await prisma.role.findUnique({
      where: { id: parseInt(id) },
      include: { users: true }
    })
    
    if (!role) {
      return res.status(404).json({ error: 'Role not found' })
    }
    
    res.json(role)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch role' })
  }
}

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name } = req.body
    const role = await prisma.role.create({
      data: { name }
    })
    res.status(201).json(role)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create role' })
  }
}

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name } = req.body
    const role = await prisma.role.update({
      where: { id: parseInt(id) },
      data: { name }
    })
    res.json(role)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role' })
  }
}

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.role.delete({
      where: { id: parseInt(id) }
    })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete role' })
  }
}
