import { User } from '@/domain/entities/User';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
}

export interface AuthSession {
    user: User;
    accessToken: string;
}

export interface IAuthService {
    register(credentials: RegisterCredentials): Promise<User>;
    login(credentials: LoginCredentials): Promise<AuthSession>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<User | null>;
    getSession(): Promise<AuthSession | null>;
}
