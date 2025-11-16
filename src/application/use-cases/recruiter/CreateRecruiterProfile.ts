import { IRecruiterProfileRepository } from '@/ports/repositories/IRecruiterProfileRepository';
import { RecruiterProfile } from '@/domain/entities/RecruiterProfile';
import { CreateRecruiterProfileDTO } from '@/application/dto/ProfileDTO';
import { ValidationError } from '@/domain/errors/ValidationError';

export class CreateRecruiterProfile {
    constructor(private recruiterProfileRepository: IRecruiterProfileRepository) { }

    async execute(userId: string, dto: CreateRecruiterProfileDTO): Promise<RecruiterProfile> {
        // Validate required fields
        if (!dto.companyName?.trim()) {
            throw new ValidationError('Company name is required', 'companyName');
        }
        if (!dto.contactName?.trim()) {
            throw new ValidationError('Contact name is required', 'contactName');
        }
        if (!dto.phone?.trim()) {
            throw new ValidationError('Phone is required', 'phone');
        }
        if (!dto.emailContact?.trim()) {
            throw new ValidationError('Contact email is required', 'emailContact');
        }
        if (!dto.location?.trim()) {
            throw new ValidationError('Location is required', 'location');
        }
        if (!dto.industrialSector?.trim()) {
            throw new ValidationError('Industrial sector is required', 'industrialSector');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(dto.emailContact)) {
            throw new ValidationError('Invalid email format', 'emailContact');
        }

        // Check if profile already exists for this user
        const existingProfile = await this.recruiterProfileRepository.findByUserId(userId);
        if (existingProfile) {
            throw new ValidationError('Recruiter profile already exists for this user');
        }

        return await this.recruiterProfileRepository.create({
            userId,
            ...dto,
        });
    }
}
