import { User, CreateUserParams, UserRole } from '@/domain/entities/User';

export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(params: CreateUserParams): Promise<User>;
    updateRole(userId: string, role: UserRole): Promise<void>;
}
