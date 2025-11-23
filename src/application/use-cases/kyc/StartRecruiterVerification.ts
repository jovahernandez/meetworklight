import { IKycVerificationService, KycVerificationResult } from '@/ports/services/IKycVerificationService';
import { createClient } from '@/lib/supabase/server';

export class StartRecruiterVerification {
    constructor(private kycService: IKycVerificationService) { }

    async execute(userId: string): Promise<KycVerificationResult> {
        const supabase = await createClient();

        // Verificar que existe el perfil de reclutador
        const { data: profile, error: profileError } = await supabase
            .from('recruiter_profiles')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (profileError || !profile) {
            throw new Error('Perfil de reclutador no encontrado');
        }

        // Iniciar verificación con MetaMap
        const result = await this.kycService.startVerification(userId, 'recruiter');

        // Guardar session ID en BD
        const { error: updateError } = await supabase
            .from('recruiter_profiles')
            .update({
                metamap_session_id: result.sessionId,
                kyc_status: 'pending',
            })
            .eq('user_id', userId);

        if (updateError) {
            throw new Error(`Error al guardar sesión de verificación: ${updateError.message}`);
        }

        return result;
    }
}
