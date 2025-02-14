export interface User {
    id: string;
    name: string;
    identityId: string;
}

export interface CreateUser {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUser {
    name?: string;
    email?: string;
    password?: string;
}

export interface Credential {
    email: string;
    password: string;
}