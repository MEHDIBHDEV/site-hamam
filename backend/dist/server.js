"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./env");
const auth_1 = require("./routes/auth");
const services_1 = require("./routes/services");
const reservations_1 = require("./routes/reservations");
const logs_1 = require("./routes/logs");
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.set('trust proxy', 1);
app.use((0, cors_1.default)({
    origin: env_1.env.clientUrl.split(',').map((v) => v.trim()),
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)(env_1.env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});
app.use('/api/auth', auth_1.authRouter);
app.use('/api/services', services_1.servicesRouter);
app.use('/api/reservations', reservations_1.reservationsRouter);
app.use('/api/logs', logs_1.logsRouter);
app.use(errorHandler_1.errorHandler);
app.listen(env_1.env.port, () => {
    console.log(`API listening on http://localhost:${env_1.env.port}`);
});
//# sourceMappingURL=server.js.map