import { supabase } from './client';
import { IJobSeekerProfileRepository } from '@/ports/repositories/IJobSeekerProfileRepository';
import {
    JobSeekerProfile,
    CreateJobSeekerProfileParams,
    UpdateJobSeekerProfileParams,
} from '@/domain/entities/JobSeekerProfile';

export class SupabaseJobSeekerProfileRepository implements IJobSeekerProfileRepository {
    async findById(id: string): Promise<JobSeekerProfile | null> {
        const { data, error } = await supabase
            .from('job_seeker_profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return null;
        }

        return this.mapToEntity(data);
    }

    async findByUserId(userId: string): Promise<JobSeekerProfile | null> {
        const { data, error } = await supabase
            .from('job_seeker_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error || !data) {
            return null;
        }

        return this.mapToEntity(data);
    }

    async create(params: CreateJobSeekerProfileParams): Promise<JobSeekerProfile> {
        const { data, error } = await supabase
            .from('job_seeker_profiles')
            .insert({
                user_id: params.userId,
                full_name: params.fullName,
                main_role: params.mainRole,
                years_experience: params.yearsExperience,
                preferred_sectors: params.preferredSectors,
                location: params.location,
                open_to_relocation: params.openToRelocation,
            })
            .select()
            .single();

        if (error || !data) {
            throw new Error(`Failed to create job seeker profile: ${error?.message}`);
        }

        return this.mapToEntity(data);
    }

    async update(id: string, params: UpdateJobSeekerProfileParams): Promise<JobSeekerProfile> {
        const updateData: any = {};
        if (params.fullName !== undefined) updateData.full_name = params.fullName;
        if (params.mainRole !== undefined) updateData.main_role = params.mainRole;
        if (params.yearsExperience !== undefined) updateData.years_experience = params.yearsExperience;
        if (params.preferredSectors !== undefined) updateData.preferred_sectors = params.preferredSectors;
        if (params.location !== undefined) updateData.location = params.location;
        if (params.openToRelocation !== undefined) updateData.open_to_relocation = params.openToRelocation;

        const { data, error } = await supabase
            .from('job_seeker_profiles')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error || !data) {
            throw new Error(`Failed to update job seeker profile: ${error?.message}`);
        }

        return this.mapToEntity(data);
    }

    private mapToEntity(data: any): JobSeekerProfile {
        return {
            id: data.id,
            userId: data.user_id,
            fullName: data.full_name,
            mainRole: data.main_role,
            yearsExperience: data.years_experience,
            preferredSectors: data.preferred_sectors,
            location: data.location,
            openToRelocation: data.open_to_relocation,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
        };
    }
}
