"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = createSession;
exports.deleteSessionByToken = deleteSessionByToken;
exports.findSessionWithUser = findSessionWithUser;
const client_1 = require("../db/client");
const tokens_1 = require("../lib/tokens");
const TTL_MS = (hours) => hours * 60 * 60 * 1000;
async function createSession({ userId, ttlHours, userAgent, ipAddress, }) {
    const token = (0, tokens_1.createSessionToken)();
    const expiresAt = new Date(Date.now() + TTL_MS(ttlHours));
    await (0, client_1.execute)(`INSERT INTO sessions (user_id, token, user_agent, ip_address, expires_at)
     VALUES (:userId, :token, :userAgent, :ipAddress, :expiresAt)`, { userId, token, userAgent, ipAddress, expiresAt });
    return { token, expiresAt };
}
async function deleteSessionByToken(token) {
    await (0, client_1.execute)('DELETE FROM sessions WHERE token = :token', { token });
}
async function findSessionWithUser(token) {
    const rows = await (0, client_1.queryRows)(`SELECT s.*, u.name as user_name, u.email as user_email, u.password_hash as user_password_hash,
            u.created_at as user_created_at, u.updated_at as user_updated_at
     FROM sessions s
     INNER JOIN users u ON u.id = s.user_id
     WHERE s.token = :token AND s.expires_at > NOW()`, { token });
    const row = rows[0];
    if (!row)
        return null;
    const session = {
        id: row.id,
        user_id: row.user_id,
        token: row.token,
        user_agent: row.user_agent,
        ip_address: row.ip_address,
        created_at: row.created_at,
        expires_at: row.expires_at,
    };
    const user = {
        id: row.user_id,
        name: row.user_name,
        email: row.user_email,
        password_hash: row.user_password_hash,
        created_at: row.user_created_at,
        updated_at: row.user_updated_at,
    };
    return { session, user };
}
//# sourceMappingURL=sessionRepository.js.map