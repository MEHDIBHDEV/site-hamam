export declare class AppError extends Error {
    status: number;
    details?: any;
    constructor(status: number, message: string, details?: any);
}
export declare const errors: {
    badRequest(message: string, details?: any): AppError;
    unauthorized(message?: string): AppError;
    forbidden(message?: string): AppError;
    notFound(message?: string): AppError;
    conflict(message?: string, details?: any): AppError;
    server(message?: string, details?: any): AppError;
};
//# sourceMappingURL=errors.d.ts.map