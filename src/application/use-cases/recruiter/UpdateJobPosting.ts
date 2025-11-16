import { IJobPostingRepository } from '@/ports/repositories/IJobPostingRepository';
import { JobPosting } from '@/domain/entities/JobPosting';
import { UpdateJobPostingDTO } from '@/application/dto/CreateJobPostingDTO';
import { NotFoundError } from '@/domain/errors/NotFoundError';
import { UnauthorizedError } from '@/domain/errors/UnauthorizedError';
import { ValidationError } from '@/domain/errors/ValidationError';

export class UpdateJobPosting {
    constructor(private jobPostingRepository: IJobPostingRepository) { }

    async execute(userId: string, jobId: string, dto: UpdateJobPostingDTO): Promise<JobPosting> {
        const job = await this.jobPostingRepository.findById(jobId);
        if (!job) {
            throw new NotFoundError('JobPosting', jobId);
        }

        // Verify ownership
        if (job.recruiterId !== userId) {
            throw new UnauthorizedError('You can only update your own job postings');
        }

        // Validate email if provided
        if (dto.contactEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(dto.contactEmail)) {
                throw new ValidationError('Invalid email format', 'contactEmail');
            }
        }

        return await this.jobPostingRepository.update(jobId, dto);
    }
}
