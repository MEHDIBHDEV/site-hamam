"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogEvent = createLogEvent;
const client_1 = require("../db/client");
async function createLogEvent({ level, name, page, sessionId, userId, payload, }) {
    await (0, client_1.execute)(`INSERT INTO log_events (level, name, page, session_id, user_id, payload, ts)
     VALUES (:level, :name, :page, :sessionId, :userId, CAST(:payload AS JSON), NOW())`, { level, name, page, sessionId, userId, payload: JSON.stringify(payload ?? {}) });
}
//# sourceMappingURL=logRepository.js.map