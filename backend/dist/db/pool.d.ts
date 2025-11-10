import mysql from 'mysql2/promise';
export declare const pool: mysql.Pool;
export type DB = typeof pool;
export declare function withTransaction<T>(fn: (conn: mysql.PoolConnection) => Promise<T>): Promise<T>;
//# sourceMappingURL=pool.d.ts.map