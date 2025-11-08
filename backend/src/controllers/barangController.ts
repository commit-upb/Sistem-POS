import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'

export const getAllBarang = async (req: Request, res: Response) => {
  try {
    const barang = await prisma.barang.findMany()
    res.json(barang)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}

export const getBarangById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const barang = await prisma.barang.findUnique({
      where: { id: parseInt(id) }
    })
    
    if (!barang) {
      return res.status(404).json({ error: 'Product not found' })
    }
    
    res.json(barang)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
}

export const createBarang = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock } = req.body
    const barang = await prisma.barang.create({
      data: { name, description, price, stock }
    })
    res.status(201).json(barang)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' })
  }
}

export const updateBarang = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, description, price, stock } = req.body
    const barang = await prisma.barang.update({
      where: { id: parseInt(id) },
      data: { name, description, price, stock }
    })
    res.json(barang)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' })
  }
}

export const deleteBarang = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.barang.delete({
      where: { id: parseInt(id) }
    })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' })
  }
}
