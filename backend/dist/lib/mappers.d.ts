import { ReservationRow, ServiceRow, UserRow } from '../types/db';
import { PublicUser, ReservationDto, ServiceDto } from '../types';
export declare function mapUser(row: UserRow): PublicUser;
export declare function mapService(row: ServiceRow): ServiceDto;
type ReservationRowWithService = ReservationRow & {
    service_slug: string;
    service_title: string;
};
export declare function mapReservation(row: ReservationRowWithService): ReservationDto;
export {};
//# sourceMappingURL=mappers.d.ts.map