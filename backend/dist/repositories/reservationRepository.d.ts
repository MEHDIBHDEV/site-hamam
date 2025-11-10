import type { ReservationRow } from '../types/db';
export type ReservationWithServiceRow = ReservationRow & {
    service_slug: string;
    service_title: string;
};
export declare function listForUser(userId: number): Promise<ReservationWithServiceRow[]>;
export declare function createReservation({ userId, serviceId, startAt, people, totalCents, note, }: {
    userId: number;
    serviceId: number;
    startAt: Date;
    people: number;
    totalCents: number;
    note?: string | null;
}): Promise<ReservationWithServiceRow>;
export declare function findByIdForUser(id: number, userId: number): Promise<ReservationWithServiceRow | null>;
export declare function cancelReservation(id: number, userId: number): Promise<void>;
//# sourceMappingURL=reservationRepository.d.ts.map