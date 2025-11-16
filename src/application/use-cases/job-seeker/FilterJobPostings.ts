import { IJobPostingRepository, JobPostingFilters } from '@/ports/repositories/IJobPostingRepository';
import { JobPosting } from '@/domain/entities/JobPosting';
import { FilterJobsDTO } from '@/application/dto/FilterJobsDTO';

export class FilterJobPostings {
    constructor(private jobPostingRepository: IJobPostingRepository) { }

    async execute(dto: FilterJobsDTO): Promise<JobPosting[]> {
        const filters: JobPostingFilters = {
            searchText: dto.searchText,
            location: dto.location,
            industrialSector: dto.industrialSector,
            jobArea: dto.jobArea,
            contractType: dto.contractType,
            modality: dto.modality,
            isActive: true, // Always filter for active jobs
        };

        return await this.jobPostingRepository.findAll(filters);
    }
}
