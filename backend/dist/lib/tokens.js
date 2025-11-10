"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionToken = createSessionToken;
exports.signAccessToken = signAccessToken;
exports.verifyAccessToken = verifyAccessToken;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../env");
function createSessionToken() {
    return crypto_1.default.randomBytes(32).toString('hex');
}
function signAccessToken(sessionToken, userId) {
    return jsonwebtoken_1.default.sign({
        sid: sessionToken,
        sub: userId,
    }, env_1.env.jwtSecret, { expiresIn: `${env_1.env.sessionTtlHours}h` });
}
function isAccessPayload(payload) {
    return (payload &&
        typeof payload === 'object' &&
        'sid' in payload &&
        'sub' in payload);
}
function verifyAccessToken(token) {
    const payload = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
    if (!isAccessPayload(payload)) {
        throw new Error('Invalid token payload');
    }
    return payload;
}
//# sourceMappingURL=tokens.js.map