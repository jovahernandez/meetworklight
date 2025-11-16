import { IJobPostingRepository, JobPostingFilters } from '@/ports/repositories/IJobPostingRepository';
import { JobPosting, CreateJobPostingParams, UpdateJobPostingParams } from '@/domain/entities/JobPosting';

export class MockJobPostingRepository implements IJobPostingRepository {
    private jobs: JobPosting[] = [];
    private nextId = 1;

    async findById(id: string): Promise<JobPosting | null> {
        return this.jobs.find(job => job.id === id) || null;
    }

    async findByRecruiterId(recruiterId: string): Promise<JobPosting[]> {
        return this.jobs.filter(job => job.recruiterId === recruiterId);
    }

    async findAll(filters?: JobPostingFilters): Promise<JobPosting[]> {
        let filtered = [...this.jobs];

        if (filters?.isActive !== undefined) {
            filtered = filtered.filter(job => job.isActive === filters.isActive);
        }

        if (filters?.location) {
            filtered = filtered.filter(job => job.location.toLowerCase().includes(filters.location!.toLowerCase()));
        }

        if (filters?.industrialSector) {
            filtered = filtered.filter(job => job.industrialSector === filters.industrialSector);
        }

        if (filters?.jobArea) {
            filtered = filtered.filter(job => job.jobArea.toLowerCase().includes(filters.jobArea!.toLowerCase()));
        }

        if (filters?.contractType) {
            filtered = filtered.filter(job => job.contractType === filters.contractType);
        }

        if (filters?.modality) {
            filtered = filtered.filter(job => job.modality === filters.modality);
        }

        if (filters?.searchText) {
            const search = filters.searchText.toLowerCase();
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(search) ||
                job.companyName.toLowerCase().includes(search) ||
                job.descriptionShort.toLowerCase().includes(search)
            );
        }

        return filtered;
    }

    async create(params: CreateJobPostingParams): Promise<JobPosting> {
        const job: JobPosting = {
            id: `job-${this.nextId++}`,
            ...params,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.jobs.push(job);
        return job;
    }

    async update(id: string, params: UpdateJobPostingParams): Promise<JobPosting> {
        const index = this.jobs.findIndex(job => job.id === id);
        if (index === -1) {
            throw new Error(`Job posting ${id} not found`);
        }

        const updated: JobPosting = {
            ...this.jobs[index],
            ...params,
            updatedAt: new Date(),
        };
        this.jobs[index] = updated;
        return updated;
    }

    async delete(id: string): Promise<void> {
        this.jobs = this.jobs.filter(job => job.id !== id);
    }

    // Helper methods for testing
    clear() {
        this.jobs = [];
        this.nextId = 1;
    }

    seed(jobs: JobPosting[]) {
        this.jobs = jobs;
    }
}
