export declare function createLogEvent({ level, name, page, sessionId, userId, payload, }: {
    level: 'info' | 'warn' | 'error' | 'security';
    name: string;
    page?: string | null;
    sessionId?: string | null;
    userId?: number | null;
    payload?: any;
}): Promise<void>;
//# sourceMappingURL=logRepository.d.ts.map