import { IJobPostingRepository } from '@/ports/repositories/IJobPostingRepository';
import { IRecruiterProfileRepository } from '@/ports/repositories/IRecruiterProfileRepository';
import { JobPosting } from '@/domain/entities/JobPosting';
import { CreateJobPostingDTO } from '@/application/dto/CreateJobPostingDTO';
import { ValidationError } from '@/domain/errors/ValidationError';
import { UnauthorizedError } from '@/domain/errors/UnauthorizedError';

export class CreateJobPosting {
    constructor(
        private jobPostingRepository: IJobPostingRepository,
        private recruiterProfileRepository: IRecruiterProfileRepository
    ) { }

    async execute(userId: string, dto: CreateJobPostingDTO): Promise<JobPosting> {
        // Verify user has recruiter profile
        const recruiterProfile = await this.recruiterProfileRepository.findByUserId(userId);
        if (!recruiterProfile) {
            throw new UnauthorizedError('Only recruiters can create job postings');
        }

        // Validate required fields
        if (!dto.title?.trim()) {
            throw new ValidationError('Job title is required', 'title');
        }
        if (!dto.companyName?.trim()) {
            throw new ValidationError('Company name is required', 'companyName');
        }
        if (!dto.location?.trim()) {
            throw new ValidationError('Location is required', 'location');
        }
        if (!dto.industrialSector?.trim()) {
            throw new ValidationError('Industrial sector is required', 'industrialSector');
        }
        if (!dto.jobArea?.trim()) {
            throw new ValidationError('Job area is required', 'jobArea');
        }
        if (!dto.descriptionShort?.trim()) {
            throw new ValidationError('Short description is required', 'descriptionShort');
        }
        if (!dto.contactPhone?.trim()) {
            throw new ValidationError('Contact phone is required', 'contactPhone');
        }
        if (!dto.contactEmail?.trim()) {
            throw new ValidationError('Contact email is required', 'contactEmail');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(dto.contactEmail)) {
            throw new ValidationError('Invalid email format', 'contactEmail');
        }

        return await this.jobPostingRepository.create({
            recruiterId: userId,
            ...dto,
        });
    }
}
