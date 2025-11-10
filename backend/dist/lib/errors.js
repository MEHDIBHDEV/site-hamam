"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = exports.AppError = void 0;
class AppError extends Error {
    constructor(status, message, details) {
        super(message);
        this.status = status;
        this.details = details;
    }
}
exports.AppError = AppError;
exports.errors = {
    badRequest(message, details) {
        return new AppError(400, message, details);
    },
    unauthorized(message = 'Unauthorized') {
        return new AppError(401, message);
    },
    forbidden(message = 'Forbidden') {
        return new AppError(403, message);
    },
    notFound(message = 'Not found') {
        return new AppError(404, message);
    },
    conflict(message = 'Conflict', details) {
        return new AppError(409, message, details);
    },
    server(message = 'Server error', details) {
        return new AppError(500, message, details);
    },
};
//# sourceMappingURL=errors.js.map