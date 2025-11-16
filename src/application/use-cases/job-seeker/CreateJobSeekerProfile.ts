import { IJobSeekerProfileRepository } from '@/ports/repositories/IJobSeekerProfileRepository';
import { JobSeekerProfile } from '@/domain/entities/JobSeekerProfile';
import { CreateJobSeekerProfileDTO } from '@/application/dto/ProfileDTO';
import { ValidationError } from '@/domain/errors/ValidationError';

export class CreateJobSeekerProfile {
    constructor(private jobSeekerProfileRepository: IJobSeekerProfileRepository) { }

    async execute(userId: string, dto: CreateJobSeekerProfileDTO): Promise<JobSeekerProfile> {
        // Validate required fields
        if (!dto.fullName?.trim()) {
            throw new ValidationError('Full name is required', 'fullName');
        }
        if (!dto.mainRole?.trim()) {
            throw new ValidationError('Main role is required', 'mainRole');
        }
        if (dto.yearsExperience < 0) {
            throw new ValidationError('Years of experience cannot be negative', 'yearsExperience');
        }
        if (!dto.location?.trim()) {
            throw new ValidationError('Location is required', 'location');
        }
        if (!dto.preferredSectors || dto.preferredSectors.length === 0) {
            throw new ValidationError('At least one preferred sector is required', 'preferredSectors');
        }

        // Check if profile already exists for this user
        const existingProfile = await this.jobSeekerProfileRepository.findByUserId(userId);
        if (existingProfile) {
            throw new ValidationError('Job seeker profile already exists for this user');
        }

        return await this.jobSeekerProfileRepository.create({
            userId,
            ...dto,
        });
    }
}
