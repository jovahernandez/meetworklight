import { createClient } from '@/lib/supabase/server';

export interface AcceptTermsInput {
    userId: string;
    version: string; // ej: "v1"
}

export class AcceptTerms {
    async execute(input: AcceptTermsInput): Promise<void> {
        const supabase = await createClient();

        const { error } = await supabase
            .from('users')
            .update({
                terms_accepted: true,
                terms_accepted_at: new Date().toISOString(),
                terms_version: input.version,
            })
            .eq('id', input.userId);

        if (error) {
            throw new Error(`Error al aceptar términos: ${error.message}`);
        }
    }
}
