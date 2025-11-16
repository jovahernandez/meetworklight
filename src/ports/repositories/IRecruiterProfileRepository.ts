import {
    RecruiterProfile,
    CreateRecruiterProfileParams,
    UpdateRecruiterProfileParams
} from '@/domain/entities/RecruiterProfile';

export interface IRecruiterProfileRepository {
    findById(id: string): Promise<RecruiterProfile | null>;
    findByUserId(userId: string): Promise<RecruiterProfile | null>;
    create(params: CreateRecruiterProfileParams): Promise<RecruiterProfile>;
    update(id: string, params: UpdateRecruiterProfileParams): Promise<RecruiterProfile>;
}
