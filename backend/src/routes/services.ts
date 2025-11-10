import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler'
import { listActiveServices, findBySlug } from '../repositories/serviceRepository'
import { mapService } from '../lib/mappers'
import { errors } from '../lib/errors'

export const servicesRouter = Router()

servicesRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const rows = await listActiveServices()
    res.json({ services: rows.map(mapService) })
  }),
)

servicesRouter.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const service = await findBySlug(req.params.slug!)
    if (!service) throw errors.notFound('Service introuvable')
    res.json({ service: mapService(service) })
  }),
)
