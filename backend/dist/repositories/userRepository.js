"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByEmail = findByEmail;
exports.findById = findById;
exports.createUser = createUser;
const client_1 = require("../db/client");
async function findByEmail(email) {
    const rows = await (0, client_1.queryRows)('SELECT * FROM users WHERE email = :email LIMIT 1', { email });
    return rows[0] ?? null;
}
async function findById(id) {
    const rows = await (0, client_1.queryRows)('SELECT * FROM users WHERE id = :id LIMIT 1', { id });
    return rows[0] ?? null;
}
async function createUser({ name, email, passwordHash }) {
    const result = await (0, client_1.execute)('INSERT INTO users (name, email, password_hash) VALUES (:name, :email, :passwordHash)', { name, email, passwordHash });
    return findById(result.insertId);
}
//# sourceMappingURL=userRepository.js.map