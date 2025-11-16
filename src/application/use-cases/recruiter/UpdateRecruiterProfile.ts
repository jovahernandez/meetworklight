import { IRecruiterProfileRepository } from '@/ports/repositories/IRecruiterProfileRepository';
import { RecruiterProfile } from '@/domain/entities/RecruiterProfile';
import { UpdateRecruiterProfileDTO } from '@/application/dto/ProfileDTO';
import { NotFoundError } from '@/domain/errors/NotFoundError';
import { ValidationError } from '@/domain/errors/ValidationError';

export class UpdateRecruiterProfile {
    constructor(private recruiterProfileRepository: IRecruiterProfileRepository) { }

    async execute(userId: string, dto: UpdateRecruiterProfileDTO): Promise<RecruiterProfile> {
        const profile = await this.recruiterProfileRepository.findByUserId(userId);
        if (!profile) {
            throw new NotFoundError('RecruiterProfile', userId);
        }

        // Validate email if provided
        if (dto.emailContact) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(dto.emailContact)) {
                throw new ValidationError('Invalid email format', 'emailContact');
            }
        }

        return await this.recruiterProfileRepository.update(profile.id, dto);
    }
}
