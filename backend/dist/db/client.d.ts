import type { ResultSetHeader } from 'mysql2/promise';
export declare function queryRows<Row>(sql: string, params?: Record<string, any>): Promise<Row[]>;
export declare function execute(sql: string, params?: Record<string, any>): Promise<ResultSetHeader>;
//# sourceMappingURL=client.d.ts.map