export type UserRow = {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_at: string;
    updated_at: string;
};
export type ServiceRow = {
    id: number;
    slug: string;
    title: string;
    description: string | null;
    duration_min: number;
    price_cents: number;
    is_signature: number;
    is_active: number;
    created_at: string;
    updated_at: string;
};
export type ReservationRow = {
    id: number;
    user_id: number;
    service_id: number;
    start_at: string;
    people: number;
    status: 'pending' | 'confirmed' | 'canceled';
    total_cents: number;
    note: string | null;
    created_at: string;
    updated_at: string;
};
export type SessionRow = {
    id: number;
    user_id: number;
    token: string;
    user_agent: string | null;
    ip_address: string | null;
    created_at: string;
    expires_at: string;
};
export type LogEventRow = {
    id: number;
    ts: string;
    level: 'info' | 'warn' | 'error' | 'security';
    name: string;
    page: string | null;
    session_id: string | null;
    user_id: number | null;
    payload: any;
    created_at: string;
};
//# sourceMappingURL=db.d.ts.map