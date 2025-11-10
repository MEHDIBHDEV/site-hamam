import type { SessionRow, UserRow } from '../types/db';
export declare function createSession({ userId, ttlHours, userAgent, ipAddress, }: {
    userId: number;
    ttlHours: number;
    userAgent?: string | null;
    ipAddress?: string | null;
}): Promise<{
    token: string;
    expiresAt: Date;
}>;
export declare function deleteSessionByToken(token: string): Promise<void>;
export type SessionWithUser = {
    session: SessionRow;
    user: UserRow;
};
export declare function findSessionWithUser(token: string): Promise<SessionWithUser | null>;
//# sourceMappingURL=sessionRepository.d.ts.map