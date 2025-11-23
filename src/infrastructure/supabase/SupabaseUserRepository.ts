import { supabase } from './client';
import { IUserRepository } from '@/ports/repositories/IUserRepository';
import { User, CreateUserParams, UserRole } from '@/domain/entities/User';

export class SupabaseUserRepository implements IUserRepository {
    async findById(id: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return null;
        }

        return {
            id: data.id,
            email: data.email,
            role: data.role as UserRole,
            createdAt: new Date(data.created_at),
            termsAccepted: data.terms_accepted || false,
            termsAcceptedAt: data.terms_accepted_at ? new Date(data.terms_accepted_at) : undefined,
            termsVersion: data.terms_version || undefined,
        };
    }

    async findByEmail(email: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) {
            return null;
        }

        return {
            id: data.id,
            email: data.email,
            role: data.role as UserRole,
            createdAt: new Date(data.created_at),
            termsAccepted: data.terms_accepted || false,
            termsAcceptedAt: data.terms_accepted_at ? new Date(data.terms_accepted_at) : undefined,
            termsVersion: data.terms_version || undefined,
        };
    }

    async create(params: CreateUserParams): Promise<User> {
        const { data, error } = await supabase
            .from('users')
            .insert({
                email: params.email,
                role: params.role,
            })
            .select()
            .single();

        if (error || !data) {
            throw new Error(`Failed to create user: ${error?.message}`);
        }

        return {
            id: data.id,
            email: data.email,
            role: data.role as UserRole,
            createdAt: new Date(data.created_at),
            termsAccepted: data.terms_accepted || false,
            termsAcceptedAt: data.terms_accepted_at ? new Date(data.terms_accepted_at) : undefined,
            termsVersion: data.terms_version || undefined,
        };
    }

    async updateRole(userId: string, role: UserRole): Promise<void> {
        const { error } = await supabase
            .from('users')
            .update({ role })
            .eq('id', userId);

        if (error) {
            throw new Error(`Failed to update user role: ${error.message}`);
        }
    }
}
