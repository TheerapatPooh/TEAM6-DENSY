export interface Profile {
    profileId: number;
    name?: string;
    age?: number;
    tel?: string;
    address?: string;
    userId: number;
}

export interface User {
    userId: number;
    username?: string;
    email?: string;
    password?: string;
    role?: string;
    department?: string | null;
    createdAt?: string;
    profile?: Profile[];
}