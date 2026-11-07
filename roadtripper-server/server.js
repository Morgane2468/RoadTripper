const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { sequelize, Category } = require('./database')
const { ValidationError, ForeignKeyConstraintError, UniqueConstraintError } = require('sequelize')
const { requireUser } = require('./controllers/user.controller')

const app = express()
const port = Number(process.env.PORT || 3000)
const origins = (process.env.FRONTEND_ORIGINS || 'http://localhost:5173,http://localhost:5174').split(',').map(origin => origin.trim())
app.use(cors({ origin: origins, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/api/categories', async (req, res) => {
  res.json(await Category.findAll())
})
app.use('/api/user', require('./routes/user'))
app.use('/api/trips', requireUser, require('./routes/trips'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'roadtripper' })
})

app.get('/api/health/database', async (req, res) => {
  try {
    await sequelize.authenticate()
    res.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    console.error('MySQL connection failed:', error.original?.code || error.message)
    res.status(503).json({ status: 'error', database: 'unavailable' })
  }
})

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error)
  if (error instanceof UniqueConstraintError) {
    return res.status(409).json({ message: 'Cette valeur est déjà utilisée.' })
  }
  if (error instanceof ValidationError || error instanceof ForeignKeyConstraintError ||
      error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Données invalides.' })
  }
  console.error(error)
  res.status(500).json({ message: 'Erreur du serveur.' })
})

const server = app.listen(port, '127.0.0.1', () => {
  console.log(`RoadTripper API: http://localhost:${server.address().port}/api/health`)
})
