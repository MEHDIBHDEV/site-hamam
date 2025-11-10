"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listActiveServices = listActiveServices;
exports.findBySlug = findBySlug;
exports.findById = findById;
const client_1 = require("../db/client");
async function listActiveServices() {
    return (0, client_1.queryRows)('SELECT * FROM services WHERE is_active = 1 ORDER BY is_signature DESC, title ASC');
}
async function findBySlug(slug) {
    const rows = await (0, client_1.queryRows)('SELECT * FROM services WHERE slug = :slug LIMIT 1', { slug });
    return rows[0] ?? null;
}
async function findById(id) {
    const rows = await (0, client_1.queryRows)('SELECT * FROM services WHERE id = :id LIMIT 1', { id });
    return rows[0] ?? null;
}
//# sourceMappingURL=serviceRepository.js.map