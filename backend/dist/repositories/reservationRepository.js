"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listForUser = listForUser;
exports.createReservation = createReservation;
exports.findByIdForUser = findByIdForUser;
exports.cancelReservation = cancelReservation;
const client_1 = require("../db/client");
async function listForUser(userId) {
    const rows = await (0, client_1.queryRows)(`SELECT r.*, s.slug as service_slug, s.title as service_title
     FROM reservations r
     INNER JOIN services s ON s.id = r.service_id
     WHERE r.user_id = :userId
     ORDER BY r.start_at DESC`, { userId });
    return rows;
}
async function createReservation({ userId, serviceId, startAt, people, totalCents, note, }) {
    const result = await (0, client_1.execute)(`INSERT INTO reservations (user_id, service_id, start_at, people, total_cents, status, note)
     VALUES (:userId, :serviceId, :startAt, :people, :totalCents, 'confirmed', :note)`, { userId, serviceId, startAt, people, totalCents, note });
    const rows = await (0, client_1.queryRows)(`SELECT r.*, s.slug as service_slug, s.title as service_title
     FROM reservations r
     INNER JOIN services s ON s.id = r.service_id
     WHERE r.id = :id`, { id: result.insertId });
    const row = rows[0];
    if (!row) {
        throw new Error('Reservation lookup failed');
    }
    return row;
}
async function findByIdForUser(id, userId) {
    const rows = await (0, client_1.queryRows)(`SELECT r.*, s.slug as service_slug, s.title as service_title
     FROM reservations r
     INNER JOIN services s ON s.id = r.service_id
     WHERE r.id = :id AND r.user_id = :userId
     LIMIT 1`, { id, userId });
    return rows[0] ?? null;
}
async function cancelReservation(id, userId) {
    await (0, client_1.execute)(`UPDATE reservations
     SET status = 'canceled'
     WHERE id = :id AND user_id = :userId`, { id, userId });
}
//# sourceMappingURL=reservationRepository.js.map