import {
    JobSeekerProfile,
    CreateJobSeekerProfileParams,
    UpdateJobSeekerProfileParams
} from '@/domain/entities/JobSeekerProfile';

export interface IJobSeekerProfileRepository {
    findById(id: string): Promise<JobSeekerProfile | null>;
    findByUserId(userId: string): Promise<JobSeekerProfile | null>;
    create(params: CreateJobSeekerProfileParams): Promise<JobSeekerProfile>;
    update(id: string, params: UpdateJobSeekerProfileParams): Promise<JobSeekerProfile>;
}
