import { IKycVerificationService, KycStatus } from '@/ports/services/IKycVerificationService';

export class UpdateVerificationStatus {
    constructor(private kycService: IKycVerificationService) { }

    async execute(
        userId: string,
        role: 'recruiter' | 'seeker',
        status: KycStatus,
        metadata?: Record<string, any>
    ): Promise<void> {
        await this.kycService.updateVerificationStatus(userId, role, status, metadata);
    }
}
