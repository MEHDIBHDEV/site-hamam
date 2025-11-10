"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const tokens_1 = require("../lib/tokens");
const errors_1 = require("../lib/errors");
const sessionRepository_1 = require("../repositories/sessionRepository");
const mappers_1 = require("../lib/mappers");
async function requireAuth(req, _res, next) {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            throw errors_1.errors.unauthorized();
        }
        const token = header.slice('Bearer '.length);
        const payload = (0, tokens_1.verifyAccessToken)(token);
        const session = await (0, sessionRepository_1.findSessionWithUser)(payload.sid);
        if (!session) {
            throw errors_1.errors.unauthorized('Session expired');
        }
        req.user = (0, mappers_1.mapUser)(session.user);
        req.authSessionToken = session.session.token;
        next();
    }
    catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            next(errors_1.errors.unauthorized('Invalid token'));
            return;
        }
        next(err);
    }
}
//# sourceMappingURL=auth.js.map