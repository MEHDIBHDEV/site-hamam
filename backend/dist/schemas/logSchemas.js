"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logEventSchema = void 0;
const zod_1 = require("zod");
exports.logEventSchema = zod_1.z.object({
    level: zod_1.z.enum(['info', 'warn', 'error', 'security']),
    name: zod_1.z.string().min(1),
    page: zod_1.z.string().optional().nullable(),
    sessionId: zod_1.z.string().max(64).optional().nullable(),
    payload: zod_1.z.unknown().optional(),
});
//# sourceMappingURL=logSchemas.js.map