import { createClient } from '@/lib/supabase/server';

export class CheckTermsAcceptance {
    async execute(userId: string): Promise<boolean> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('users')
            .select('terms_accepted')
            .eq('id', userId)
            .single();

        if (error) {
            throw new Error(`Error al verificar términos: ${error.message}`);
        }

        return data?.terms_accepted ?? false;
    }
}
