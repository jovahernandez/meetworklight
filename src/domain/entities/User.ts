export type UserRole = 'recruiter' | 'seeker';

export interface User {
    id: string;
    email: string;
    role: UserRole | null; // Allow null for users who haven't chosen a role yet
    createdAt: Date;
}

export interface CreateUserParams {
    email: string;
    password: string;
    role: UserRole;
}
