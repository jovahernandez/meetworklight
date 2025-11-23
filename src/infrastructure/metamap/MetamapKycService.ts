import {
    IKycVerificationService,
    KycVerificationResult,
    KycStatus
} from '@/ports/services/IKycVerificationService';
import { metamapConfig, isMetamapConfigured } from './MetamapConfig';
import { createClient } from '@/lib/supabase/server';

export class MetamapKycService implements IKycVerificationService {
    async startVerification(
        userId: string,
        role: 'recruiter' | 'seeker'
    ): Promise<KycVerificationResult> {
        // TODO: Implementar integración real con MetaMap SDK
        // Por ahora, devolvemos un stub para desarrollo

        if (!isMetamapConfigured()) {
            console.warn('⚠️ MetaMap no está configurado. Usando modo stub.');
            return {
                sessionId: `stub-session-${userId}-${Date.now()}`,
                verificationUrl: `https://metamap.com/verify?stub=true&userId=${userId}`,
            };
        }

        // TODO: Cuando se implemente la integración real:
        // 1. Llamar a MetaMap API para crear una sesión de verificación
        // 2. Usar el flowId correspondiente según el rol
        // 3. Devolver el sessionId y verificationUrl reales

        const flowId = role === 'recruiter'
            ? metamapConfig.flowIdRecruiter
            : metamapConfig.flowIdSeeker;

        // Stub temporal
        return {
            sessionId: `metamap-${userId}-${Date.now()}`,
            verificationUrl: `https://metamap.com/flow/${flowId}?userId=${userId}`,
        };
    }

    async updateVerificationStatus(
        userId: string,
        role: 'recruiter' | 'seeker',
        status: KycStatus,
        metadata?: Record<string, any>
    ): Promise<void> {
        const supabase = await createClient();
        const tableName = role === 'recruiter' ? 'recruiter_profiles' : 'job_seeker_profiles';

        const updateData: any = {
            kyc_status: status,
        };

        if (status === 'verified') {
            updateData.kyc_verified_at = new Date().toISOString();
        }

        const { error } = await supabase
            .from(tableName)
            .update(updateData)
            .eq('user_id', userId);

        if (error) {
            throw new Error(`Error al actualizar estado de verificación: ${error.message}`);
        }
    }

    async getVerificationStatus(
        userId: string,
        role: 'recruiter' | 'seeker'
    ): Promise<KycStatus> {
        const supabase = await createClient();
        const tableName = role === 'recruiter' ? 'recruiter_profiles' : 'job_seeker_profiles';

        const { data, error } = await supabase
            .from(tableName)
            .select('kyc_status')
            .eq('user_id', userId)
            .single();

        if (error) {
            throw new Error(`Error al obtener estado de verificación: ${error.message}`);
        }

        return (data?.kyc_status as KycStatus) ?? 'pending';
    }
}
