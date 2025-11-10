export type PublicUser = {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
};
export type ServiceDto = {
    id: number;
    slug: string;
    title: string;
    description: string | null;
    durationMin: number;
    priceCents: number;
    price: number;
    isSignature: boolean;
    isActive: boolean;
    image: string;
    tags: string[];
};
export type ReservationDto = {
    id: number;
    serviceId: number;
    serviceSlug: string;
    serviceTitle: string;
    startAt: string;
    dateISO: string;
    time: string;
    people: number;
    status: 'pending' | 'confirmed' | 'canceled';
    totalCents: number;
    total: number;
    note: string | null;
    createdAt: string;
    updatedAt: string;
};
//# sourceMappingURL=index.d.ts.map