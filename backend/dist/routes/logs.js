"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logsRouter = void 0;
const express_1 = require("express");
const asyncHandler_1 = require("../middleware/asyncHandler");
const logSchemas_1 = require("../schemas/logSchemas");
const logRepository_1 = require("../repositories/logRepository");
const tokens_1 = require("../lib/tokens");
const sessionRepository_1 = require("../repositories/sessionRepository");
exports.logsRouter = (0, express_1.Router)();
exports.logsRouter.post('/', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = logSchemas_1.logEventSchema.parse(req.body);
    let userId = null;
    let sessionToken = body.sessionId ?? null;
    const header = req.headers.authorization;
    if (!sessionToken && header && header.startsWith('Bearer ')) {
        try {
            const token = header.slice('Bearer '.length);
            const payload = (0, tokens_1.verifyAccessToken)(token);
            const session = await (0, sessionRepository_1.findSessionWithUser)(payload.sid);
            if (session) {
                userId = session.user.id;
                sessionToken = session.session.token;
            }
        }
        catch {
            // ignore auth errors for logging
        }
    }
    await (0, logRepository_1.createLogEvent)({
        level: body.level,
        name: body.name,
        page: body.page ?? null,
        sessionId: sessionToken ?? null,
        userId: userId ?? null,
        payload: body.payload,
    });
    res.status(201).json({ ok: true });
}));
//# sourceMappingURL=logs.js.map