export class AppError extends Error {
  status: number
  details?: any

  constructor(status: number, message: string, details?: any) {
    super(message)
    this.status = status
    this.details = details
  }
}

export const errors = {
  badRequest(message: string, details?: any) {
    return new AppError(400, message, details)
  },
  unauthorized(message = 'Unauthorized') {
    return new AppError(401, message)
  },
  forbidden(message = 'Forbidden') {
    return new AppError(403, message)
  },
  notFound(message = 'Not found') {
    return new AppError(404, message)
  },
  conflict(message = 'Conflict', details?: any) {
    return new AppError(409, message, details)
  },
  server(message = 'Server error', details?: any) {
    return new AppError(500, message, details)
  },
}
