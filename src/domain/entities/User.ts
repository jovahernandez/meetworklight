export type UserRole = 'recruiter' | 'seeker';

export interface User {
    id: string;
    email: string;
    role: UserRole | null; // Allow null for users who haven't chosen a role yet
    createdAt: Date;
    // Nuevos campos para términos (Iteración 1)
    termsAccepted: boolean;
    termsAcceptedAt?: Date;
    termsVersion?: string;
}

export interface CreateUserParams {
    email: string;
    password: string;
    role: UserRole;
}
