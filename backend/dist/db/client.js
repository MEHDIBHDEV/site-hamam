"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryRows = queryRows;
exports.execute = execute;
const pool_1 = require("./pool");
async function queryRows(sql, params) {
    const [rows] = await pool_1.pool.query(sql, params);
    return rows;
}
async function execute(sql, params) {
    const [result] = await pool_1.pool.execute(sql, params);
    return result;
}
//# sourceMappingURL=client.js.map