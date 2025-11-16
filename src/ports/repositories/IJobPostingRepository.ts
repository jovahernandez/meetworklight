import {
    JobPosting,
    CreateJobPostingParams,
    UpdateJobPostingParams,
    ContractType,
    Modality
} from '@/domain/entities/JobPosting';

export interface JobPostingFilters {
    searchText?: string;
    location?: string;
    industrialSector?: string;
    jobArea?: string;
    contractType?: ContractType;
    modality?: Modality;
    isActive?: boolean;
}

export interface IJobPostingRepository {
    findById(id: string): Promise<JobPosting | null>;
    findByRecruiterId(recruiterId: string): Promise<JobPosting[]>;
    findAll(filters?: JobPostingFilters): Promise<JobPosting[]>;
    create(params: CreateJobPostingParams): Promise<JobPosting>;
    update(id: string, params: UpdateJobPostingParams): Promise<JobPosting>;
    delete(id: string): Promise<void>;
}
