import { supabase } from './client';
import {
    IAuthService,
    LoginCredentials,
    RegisterCredentials,
    AuthSession
} from '@/ports/services/IAuthService';
import { User } from '@/domain/entities/User';
import { UnauthorizedError } from '@/domain/errors/UnauthorizedError';

export class SupabaseAuthService implements IAuthService {
    async register(credentials: RegisterCredentials): Promise<User> {
        const { data, error } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
        });

        if (error) {
            throw new Error(`Registration failed: ${error.message}`);
        }

        if (!data.user) {
            throw new Error('Registration failed: No user returned');
        }

        // Create user record in public.users table (RLS is disabled for users table)
        const { error: userError } = await supabase
            .from('users')
            .insert({
                id: data.user.id,
                email: data.user.email!,
                role: null, // Role will be set later via /api/auth/set-role
            });

        if (userError) {
            // If it's a duplicate error, it's ok (user might already exist from previous attempt)
            if (!userError.message.includes('duplicate') && !userError.code?.includes('23505')) {
                throw new Error(`Failed to create user record: ${userError.message}`);
            }
        }

        return {
            id: data.user.id,
            email: data.user.email!,
            role: null,
            createdAt: new Date(data.user.created_at),
            termsAccepted: false,
        };
    }

    async login(credentials: LoginCredentials): Promise<AuthSession> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
        });

        if (error || !data.user || !data.session) {
            throw new UnauthorizedError('Invalid credentials');
        }

        // Fetch user role from public.users
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role, terms_accepted, terms_accepted_at, terms_version')
            .eq('id', data.user.id)
            .single();

        if (userError || !userData) {
            throw new Error('Failed to fetch user role');
        }

        const user: User = {
            id: data.user.id,
            email: data.user.email!,
            role: userData.role as 'recruiter' | 'seeker',
            createdAt: new Date(data.user.created_at),
            termsAccepted: userData.terms_accepted || false,
            termsAcceptedAt: userData.terms_accepted_at ? new Date(userData.terms_accepted_at) : undefined,
            termsVersion: userData.terms_version || undefined,
        };

        return {
            user,
            accessToken: data.session.access_token,
        };
    }

    async logout(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw new Error(`Logout failed: ${error.message}`);
        }
    }

    async getCurrentUser(): Promise<User | null> {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return null;
        }

        // Fetch user role from public.users
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role, terms_accepted, terms_accepted_at, terms_version')
            .eq('id', user.id)
            .single();

        if (userError || !userData) {
            return null;
        }

        return {
            id: user.id,
            email: user.email!,
            role: userData.role as 'recruiter' | 'seeker',
            createdAt: new Date(user.created_at),
            termsAccepted: userData.terms_accepted || false,
            termsAcceptedAt: userData.terms_accepted_at ? new Date(userData.terms_accepted_at) : undefined,
            termsVersion: userData.terms_version || undefined,
        };
    }

    async getSession(): Promise<AuthSession | null> {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
            return null;
        }

        const user = await this.getCurrentUser();
        if (!user) {
            return null;
        }

        return {
            user,
            accessToken: session.access_token,
        };
    }
}
