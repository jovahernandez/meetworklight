import { IJobPostingRepository } from '@/ports/repositories/IJobPostingRepository';
import { JobPosting } from '@/domain/entities/JobPosting';

export class ListJobPostings {
    constructor(private jobPostingRepository: IJobPostingRepository) { }

    async execute(): Promise<JobPosting[]> {
        return await this.jobPostingRepository.findAll({ isActive: true });
    }
}
