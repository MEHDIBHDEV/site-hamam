"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
function required(name, fallback) {
    const value = process.env[name] ?? fallback;
    if (!value) {
        throw new Error(`Missing required environment variable ${name}`);
    }
    return value;
}
const num = (value, defaultValue) => {
    if (!value)
        return defaultValue;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : defaultValue;
};
exports.env = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: num(process.env.PORT, 4000),
    db: {
        host: required('DB_HOST', '127.0.0.1'),
        port: num(process.env.DB_PORT, 3306),
        user: required('DB_USER'),
        password: required('DB_PASSWORD'),
        database: required('DB_NAME', 'hammam'),
    },
    jwtSecret: required('JWT_SECRET'),
    sessionTtlHours: num(process.env.SESSION_TTL_HOURS, 24 * 7),
    clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
};
//# sourceMappingURL=env.js.map