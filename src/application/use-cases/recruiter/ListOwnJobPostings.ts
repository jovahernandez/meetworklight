import { IJobPostingRepository } from '@/ports/repositories/IJobPostingRepository';
import { JobPosting } from '@/domain/entities/JobPosting';

export class ListOwnJobPostings {
    constructor(private jobPostingRepository: IJobPostingRepository) { }

    async execute(recruiterId: string): Promise<JobPosting[]> {
        return await this.jobPostingRepository.findByRecruiterId(recruiterId);
    }
}
