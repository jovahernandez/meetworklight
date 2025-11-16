import { supabase } from './client';
import { IRecruiterProfileRepository } from '@/ports/repositories/IRecruiterProfileRepository';
import {
    RecruiterProfile,
    CreateRecruiterProfileParams,
    UpdateRecruiterProfileParams,
} from '@/domain/entities/RecruiterProfile';

export class SupabaseRecruiterProfileRepository implements IRecruiterProfileRepository {
    async findById(id: string): Promise<RecruiterProfile | null> {
        const { data, error } = await supabase
            .from('recruiter_profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return null;
        }

        return this.mapToEntity(data);
    }

    async findByUserId(userId: string): Promise<RecruiterProfile | null> {
        const { data, error } = await supabase
            .from('recruiter_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error || !data) {
            return null;
        }

        return this.mapToEntity(data);
    }

    async create(params: CreateRecruiterProfileParams): Promise<RecruiterProfile> {
        const { data, error } = await supabase
            .from('recruiter_profiles')
            .insert({
                user_id: params.userId,
                company_name: params.companyName,
                contact_name: params.contactName,
                phone: params.phone,
                email_contact: params.emailContact,
                location: params.location,
                industrial_sector: params.industrialSector,
                website: params.website,
            })
            .select()
            .single();

        if (error || !data) {
            throw new Error(`Failed to create recruiter profile: ${error?.message}`);
        }

        return this.mapToEntity(data);
    }

    async update(id: string, params: UpdateRecruiterProfileParams): Promise<RecruiterProfile> {
        const updateData: any = {};
        if (params.companyName !== undefined) updateData.company_name = params.companyName;
        if (params.contactName !== undefined) updateData.contact_name = params.contactName;
        if (params.phone !== undefined) updateData.phone = params.phone;
        if (params.emailContact !== undefined) updateData.email_contact = params.emailContact;
        if (params.location !== undefined) updateData.location = params.location;
        if (params.industrialSector !== undefined) updateData.industrial_sector = params.industrialSector;
        if (params.website !== undefined) updateData.website = params.website;

        const { data, error } = await supabase
            .from('recruiter_profiles')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error || !data) {
            throw new Error(`Failed to update recruiter profile: ${error?.message}`);
        }

        return this.mapToEntity(data);
    }

    private mapToEntity(data: any): RecruiterProfile {
        return {
            id: data.id,
            userId: data.user_id,
            companyName: data.company_name,
            contactName: data.contact_name,
            phone: data.phone,
            emailContact: data.email_contact,
            location: data.location,
            industrialSector: data.industrial_sector,
            website: data.website,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
        };
    }
}
