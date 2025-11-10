"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicesRouter = void 0;
const express_1 = require("express");
const asyncHandler_1 = require("../middleware/asyncHandler");
const serviceRepository_1 = require("../repositories/serviceRepository");
const mappers_1 = require("../lib/mappers");
const errors_1 = require("../lib/errors");
exports.servicesRouter = (0, express_1.Router)();
exports.servicesRouter.get('/', (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const rows = await (0, serviceRepository_1.listActiveServices)();
    res.json({ services: rows.map(mappers_1.mapService) });
}));
exports.servicesRouter.get('/:slug', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const service = await (0, serviceRepository_1.findBySlug)(req.params.slug);
    if (!service)
        throw errors_1.errors.notFound('Service introuvable');
    res.json({ service: (0, mappers_1.mapService)(service) });
}));
//# sourceMappingURL=services.js.map