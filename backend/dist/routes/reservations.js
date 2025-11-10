"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationsRouter = void 0;
const express_1 = require("express");
const asyncHandler_1 = require("../middleware/asyncHandler");
const auth_1 = require("../middleware/auth");
const reservationSchemas_1 = require("../schemas/reservationSchemas");
const reservationRepository_1 = require("../repositories/reservationRepository");
const serviceRepository_1 = require("../repositories/serviceRepository");
const errors_1 = require("../lib/errors");
const mappers_1 = require("../lib/mappers");
const logRepository_1 = require("../repositories/logRepository");
const router = (0, express_1.Router)();
router.get('/', auth_1.requireAuth, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const rows = await (0, reservationRepository_1.listForUser)(req.user.id);
    res.json({ reservations: rows.map(mappers_1.mapReservation) });
}));
function combineDateTime(dateISO, time) {
    const [year, month, day] = dateISO.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    return new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
}
router.post('/', auth_1.requireAuth, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = reservationSchemas_1.createReservationSchema.parse(req.body);
    const service = await (0, serviceRepository_1.findBySlug)(body.serviceSlug);
    if (!service || !service.is_active) {
        throw errors_1.errors.badRequest('Service indisponible');
    }
    const startAt = combineDateTime(body.dateISO, body.time);
    const totalCents = service.price_cents * body.people;
    try {
        const reservation = await (0, reservationRepository_1.createReservation)({
            userId: req.user.id,
            serviceId: service.id,
            startAt,
            people: body.people,
            totalCents,
            note: body.note ?? null,
        });
        await (0, logRepository_1.createLogEvent)({
            level: 'info',
            name: 'reservation_confirmed',
            sessionId: req.authSessionToken ?? null,
            userId: req.user.id,
            page: '/reservation',
            payload: {
                reservationId: reservation.id,
                serviceSlug: reservation.service_slug,
                people: reservation.people,
                totalCents,
            },
        });
        res.status(201).json({ reservation: (0, mappers_1.mapReservation)(reservation) });
    }
    catch (err) {
        if (err?.code === 'ER_DUP_ENTRY') {
            throw errors_1.errors.conflict('Ce créneau est déjà réservé');
        }
        throw err;
    }
}));
router.patch('/:id/cancel', auth_1.requireAuth, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const params = reservationSchemas_1.cancelReservationSchema.parse({ id: req.params.id });
    const existing = await (0, reservationRepository_1.findByIdForUser)(params.id, req.user.id);
    if (!existing)
        throw errors_1.errors.notFound('Réservation introuvable');
    if (existing.status === 'canceled') {
        return res.json({ reservation: (0, mappers_1.mapReservation)(existing) });
    }
    await (0, reservationRepository_1.cancelReservation)(params.id, req.user.id);
    await (0, logRepository_1.createLogEvent)({
        level: 'info',
        name: 'reservation_cancelled',
        sessionId: req.authSessionToken ?? null,
        userId: req.user.id,
        page: '/account',
        payload: { reservationId: existing.id, reason: 'user_action' },
    });
    const updated = await (0, reservationRepository_1.findByIdForUser)(params.id, req.user.id);
    if (!updated)
        throw errors_1.errors.server('Impossible de retrouver la réservation');
    res.json({ reservation: (0, mappers_1.mapReservation)(updated) });
}));
exports.reservationsRouter = router;
//# sourceMappingURL=reservations.js.map