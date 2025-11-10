export declare function findByEmail(email: string): Promise<any>;
export declare function findById(id: number): Promise<any>;
export declare function createUser({ name, email, passwordHash }: {
    name: string;
    email: string;
    passwordHash: string;
}): Promise<any>;
//# sourceMappingURL=userRepository.d.ts.map