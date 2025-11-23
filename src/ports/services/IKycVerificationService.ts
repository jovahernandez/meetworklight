export type KycStatus = 'pending' | 'verified' | 'rejected';

export interface KycVerificationResult {
    sessionId: string;
    verificationUrl: string;
}

export interface IKycVerificationService {
    /**
     * Inicia el proceso de verificación de identidad para un usuario
     * @param userId ID del usuario a verificar
     * @param role Rol del usuario (recruiter o seeker)
     * @returns ID de sesión y URL para completar verificación
     */
    startVerification(
        userId: string,
        role: 'recruiter' | 'seeker'
    ): Promise<KycVerificationResult>;

    /**
     * Actualiza el estado de verificación de un usuario
     * @param userId ID del usuario
     * @param role Rol del usuario
     * @param status Nuevo estado (verified, rejected)
     * @param metadata Información adicional de MetaMap
     */
    updateVerificationStatus(
        userId: string,
        role: 'recruiter' | 'seeker',
        status: KycStatus,
        metadata?: Record<string, any>
    ): Promise<void>;

    /**
     * Obtiene el estado actual de verificación
     * @param userId ID del usuario
     * @param role Rol del usuario
     * @returns Estado actual de KYC
     */
    getVerificationStatus(
        userId: string,
        role: 'recruiter' | 'seeker'
    ): Promise<KycStatus>;
}
