import type { ServiceRow } from '../types/db';
export declare function listActiveServices(): Promise<ServiceRow[]>;
export declare function findBySlug(slug: string): Promise<ServiceRow | null>;
export declare function findById(id: number): Promise<ServiceRow | null>;
//# sourceMappingURL=serviceRepository.d.ts.map