"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const asyncHandler_1 = require("../middleware/asyncHandler");
const authSchemas_1 = require("../schemas/authSchemas");
const userRepository_1 = require("../repositories/userRepository");
const errors_1 = require("../lib/errors");
const password_1 = require("../lib/password");
const env_1 = require("../env");
const sessionRepository_1 = require("../repositories/sessionRepository");
const tokens_1 = require("../lib/tokens");
const mappers_1 = require("../lib/mappers");
const auth_1 = require("../middleware/auth");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/register', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = authSchemas_1.registerSchema.parse(req.body);
    const existing = await (0, userRepository_1.findByEmail)(body.email);
    if (existing) {
        throw errors_1.errors.conflict('Email déjà utilisé');
    }
    const passwordHash = await (0, password_1.hashPassword)(body.password);
    const user = await (0, userRepository_1.createUser)({ name: body.name, email: body.email, passwordHash });
    if (!user)
        throw errors_1.errors.server('Echec création utilisateur');
    const session = await (0, sessionRepository_1.createSession)({
        userId: user.id,
        ttlHours: env_1.env.sessionTtlHours,
        userAgent: req.headers['user-agent'] ?? null,
        ipAddress: req.ip ?? null,
    });
    const token = (0, tokens_1.signAccessToken)(session.token, user.id);
    res.status(201).json({
        user: (0, mappers_1.mapUser)(user),
        token,
        expiresAt: session.expiresAt,
    });
}));
exports.authRouter.post('/login', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = authSchemas_1.loginSchema.parse(req.body);
    const user = await (0, userRepository_1.findByEmail)(body.email);
    if (!user)
        throw errors_1.errors.unauthorized('Identifiants invalides');
    const ok = await (0, password_1.verifyPassword)(body.password, user.password_hash);
    if (!ok)
        throw errors_1.errors.unauthorized('Identifiants invalides');
    const session = await (0, sessionRepository_1.createSession)({
        userId: user.id,
        ttlHours: env_1.env.sessionTtlHours,
        userAgent: req.headers['user-agent'] ?? null,
        ipAddress: req.ip ?? null,
    });
    const token = (0, tokens_1.signAccessToken)(session.token, user.id);
    res.json({
        user: (0, mappers_1.mapUser)(user),
        token,
        expiresAt: session.expiresAt,
    });
}));
exports.authRouter.post('/logout', auth_1.requireAuth, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (req.authSessionToken) {
        await (0, sessionRepository_1.deleteSessionByToken)(req.authSessionToken);
    }
    res.status(204).send();
}));
exports.authRouter.get('/me', auth_1.requireAuth, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    res.json({ user: req.user });
}));
//# sourceMappingURL=auth.js.map