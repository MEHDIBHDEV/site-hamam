"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../lib/errors");
const errorHandler = (err, _req, res, _next) => {
    const status = err instanceof errors_1.AppError ? err.status : 500;
    const payload = err instanceof errors_1.AppError
        ? { message: err.message, details: err.details }
        : { message: 'Unexpected error' };
    if (status >= 500) {
        console.error(err);
    }
    res.status(status).json(payload);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map