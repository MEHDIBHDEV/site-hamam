import type { ErrorRequestHandler } from 'express'
import { AppError } from '../lib/errors'

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = err instanceof AppError ? err.status : 500
  const payload =
    err instanceof AppError
      ? { message: err.message, details: err.details }
      : { message: 'Unexpected error' }
  if (status >= 500) {
    console.error(err)
  }
  res.status(status).json(payload)
}
