import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a new Supabase client instance
export function createClient() {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables');
    }
    
    return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
    });
}

// Lazy singleton for use in services (only created when accessed)
let _supabase: ReturnType<typeof createClient> | null = null;

export const getSupabase = () => {
    if (!_supabase) {
        _supabase = createClient();
    }
    return _supabase;
};

// For backward compatibility
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
    get(target, prop) {
        return getSupabase()[prop as keyof ReturnType<typeof createClient>];
    }
});
