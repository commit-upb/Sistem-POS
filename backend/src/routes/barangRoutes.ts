import { Router } from 'express'
import {
  getAllBarang,
  getBarangById,
  createBarang,
  updateBarang,
  deleteBarang
} from '../controllers/barangController'
import {
  validateProductData,
  validateProductId,
  checkStockAvailability
} from '../middleware/productMiddleware'

const router = Router()

router.get('/', getAllBarang)
router.get('/:id', validateProductId, getBarangById)
router.post('/', validateProductData, createBarang)
router.put('/:id', validateProductId, checkStockAvailability, updateBarang)
router.delete('/:id', validateProductId, deleteBarang)

export default router
