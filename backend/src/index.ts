import express from 'express'
import cors from 'cors'
import { prisma } from './utils/prisma'

// Import routes
import userRoutes from './routes/userRoutes'
import barangRoutes from './routes/barangRoutes'
import transactionRoutes from './routes/transactionRoutes'

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// API Routes
app.use('/api/users', userRoutes)
app.use('/api/barang', barangRoutes)
app.use('/api/transactions', transactionRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`)
  console.log(`Health check: http://localhost:${port}/health`)
  console.log(`API endpoints:`)
  console.log(`   - Users: http://localhost:${port}/api/users`)
  console.log(`   - Barang: http://localhost:${port}/api/barang`)
  console.log(`   - Transactions: http://localhost:${port}/api/transactions`)
})
