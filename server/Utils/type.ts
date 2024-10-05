import { Role } from "@prisma/client";

export interface Profile {
    id: number;
    name?: string;
    age?: number;
    tel?: string;
    address?: string;
    image?: Image | null;
    userId: number;
}

export interface User {
    id: number;
    username?: string;
    email?: string;
    password?: any;
    role: Role;
    department?: string | null;
    createdAt?: string;
    profile?: Profile[];
}

export interface Image {
    id: number;
    path: string;
    profileId: number;
}