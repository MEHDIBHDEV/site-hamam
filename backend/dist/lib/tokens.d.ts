export declare function createSessionToken(): string;
export type AccessTokenPayload = {
    sid: string;
    sub: number;
    iat: number;
    exp: number;
};
export declare function signAccessToken(sessionToken: string, userId: number): string;
export declare function verifyAccessToken(token: string): AccessTokenPayload;
//# sourceMappingURL=tokens.d.ts.map