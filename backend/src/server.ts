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

app.use(
  cors({
    origin: env.clientUrl.split(',').map((v) => v.trim()),
  }),
)
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
