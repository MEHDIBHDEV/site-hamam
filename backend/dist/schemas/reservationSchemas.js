"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelReservationSchema = exports.createReservationSchema = void 0;
const zod_1 = require("zod");
exports.createReservationSchema = zod_1.z.object({
    serviceSlug: zod_1.z.string().min(1),
    dateISO: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'dateISO must be YYYY-MM-DD'),
    time: zod_1.z
        .string()
        .regex(/^\d{2}:\d{2}$/, 'time must be HH:mm'),
    people: zod_1.z.number().int().min(1).max(8),
    note: zod_1.z.string().max(500).optional().nullable(),
});
exports.cancelReservationSchema = zod_1.z.object({
    id: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().int().positive()),
});
//# sourceMappingURL=reservationSchemas.js.map