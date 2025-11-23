import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Valores hardcodeados para Vercel
const supabaseUrl = 'https://fvqaczvjimslzupfrjrm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2cWFjenZqaW1zbHp1cGZyanJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMzI2NTQsImV4cCI6MjA3ODgwODY1NH0.2rG53jx_dKGf61mykgUdMzS1VsxZKI1wWa2QvlwPSv4';

// Create a new Supabase client instance
export function createClient() {
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
