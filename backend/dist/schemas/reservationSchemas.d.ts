import { z } from 'zod';
export declare const createReservationSchema: z.ZodObject<{
    serviceSlug: z.ZodString;
    dateISO: z.ZodString;
    time: z.ZodString;
    people: z.ZodNumber;
    note: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const cancelReservationSchema: z.ZodObject<{
    id: z.ZodPipe<z.ZodTransform<number, unknown>, z.ZodNumber>;
}, z.core.$strip>;
export type CreateReservationInput = z.infer<typeof createReservationSchema>;
//# sourceMappingURL=reservationSchemas.d.ts.map