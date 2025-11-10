import { z } from 'zod';
export declare const logEventSchema: z.ZodObject<{
    level: z.ZodEnum<{
        error: "error";
        info: "info";
        warn: "warn";
        security: "security";
    }>;
    name: z.ZodString;
    page: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sessionId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    payload: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>;
export type LogEventInput = z.infer<typeof logEventSchema>;
//# sourceMappingURL=logSchemas.d.ts.map