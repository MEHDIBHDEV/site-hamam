import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './env'
import { authRouter } from './routes/auth'
import { servicesRouter } from './routes/services'
import { reservationsRouter } from './routes/reservations'
import { logsRouter } from './routes/logs'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.set('trust proxy', 1)

/**
 * CORS configuration
 * - Dev: allow every http://localhost:* so Vite hot reload stays happy
 * - Prod: only allow the URLs listed in CLIENT_URL (comma separated)
 */
const allowedOrigins = (env.clientUrl ?? '')
  .split(',')
  .map((v) => v.trim())
  .filter(Boolean)

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow Postman/curl when there is no Origin header
    if (!origin) return callback(null, true)

    // Dev mode: accept any localhost origin (ports change often with Vite)
    if (env.nodeEnv !== 'production' && origin.startsWith('http://localhost')) {
      return callback(null, true)
    }

    // Production (or when we want to reduce the surface): only allow explicit list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error(`CORS blocked: ${origin}`), false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions)) // ✅ preflight safe Express 5


app.use(helmet())
app.use(express.json())
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.use('/api/auth', authRouter)
app.use('/api/services', servicesRouter)
app.use('/api/reservations', reservationsRouter)
app.use('/api/logs', logsRouter)

app.use(errorHandler)

app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`)
})
