import { supabase } from './client';
import { IJobPostingRepository, JobPostingFilters } from '@/ports/repositories/IJobPostingRepository';
import {
    JobPosting,
    CreateJobPostingParams,
    UpdateJobPostingParams,
    ContractType,
    Modality,
    Shift,
} from '@/domain/entities/JobPosting';

export class SupabaseJobPostingRepository implements IJobPostingRepository {
    async findById(id: string): Promise<JobPosting | null> {
        const { data, error } = await supabase
            .from('job_postings')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return null;
        }

        return this.mapToEntity(data);
    }

    async findByRecruiterId(recruiterId: string): Promise<JobPosting[]> {
        const { data, error } = await supabase
            .from('job_postings')
            .select('*')
            .eq('recruiter_id', recruiterId)
            .order('created_at', { ascending: false });

        if (error || !data) {
            return [];
        }

        return data.map(this.mapToEntity);
    }

    async findAll(filters?: JobPostingFilters): Promise<JobPosting[]> {
        let query = supabase.from('job_postings').select('*');

        // Filter by status instead of is_active
        if (filters?.isActive !== undefined) {
            query = query.eq('status', filters.isActive ? 'active' : 'inactive');
        } else {
            // By default, only show active jobs
            query = query.eq('status', 'active');
        }

        if (filters?.location) {
            query = query.ilike('location', `%${filters.location}%`);
        }

        if (filters?.industrialSector) {
            query = query.eq('industrial_sector', filters.industrialSector);
        }

        if (filters?.jobArea) {
            query = query.ilike('job_area', `%${filters.jobArea}%`);
        }

        if (filters?.contractType) {
            query = query.eq('contract_type', filters.contractType);
        }

        if (filters?.modality) {
            query = query.eq('modality', filters.modality);
        }

        if (filters?.searchText) {
            query = query.or(
                `title.ilike.%${filters.searchText}%,` +
                `company_name.ilike.%${filters.searchText}%,` +
                `description_short.ilike.%${filters.searchText}%`
            );
        }

        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error || !data) {
            return [];
        }

        return data.map(this.mapToEntity);
    }

    async create(params: CreateJobPostingParams): Promise<JobPosting> {
        const { data, error } = await supabase
            .from('job_postings')
            .insert({
                recruiter_id: params.recruiterId,
                title: params.title,
                company_name: params.companyName,
                location: params.location,
                industrial_sector: params.industrialSector,
                job_area: params.jobArea,
                contract_type: params.contractType,
                modality: params.modality,
                salary_range: params.salaryRange,
                shift: params.shift,
                description_short: params.descriptionShort,
                description_long: params.descriptionLong,
                contact_phone: params.contactPhone,
                contact_email: params.contactEmail,
            })
            .select()
            .single();

        if (error || !data) {
            throw new Error(`Failed to create job posting: ${error?.message}`);
        }

        return this.mapToEntity(data);
    }

    async update(id: string, params: UpdateJobPostingParams): Promise<JobPosting> {
        const updateData: any = {};
        if (params.title !== undefined) updateData.title = params.title;
        if (params.companyName !== undefined) updateData.company_name = params.companyName;
        if (params.location !== undefined) updateData.location = params.location;
        if (params.industrialSector !== undefined) updateData.industrial_sector = params.industrialSector;
        if (params.jobArea !== undefined) updateData.job_area = params.jobArea;
        if (params.contractType !== undefined) updateData.contract_type = params.contractType;
        if (params.modality !== undefined) updateData.modality = params.modality;
        if (params.salaryRange !== undefined) updateData.salary_range = params.salaryRange;
        if (params.shift !== undefined) updateData.shift = params.shift;
        if (params.descriptionShort !== undefined) updateData.description_short = params.descriptionShort;
        if (params.descriptionLong !== undefined) updateData.description_long = params.descriptionLong;
        if (params.contactPhone !== undefined) updateData.contact_phone = params.contactPhone;
        if (params.contactEmail !== undefined) updateData.contact_email = params.contactEmail;
        if (params.isActive !== undefined) updateData.status = params.isActive ? 'active' : 'inactive';

        const { data, error } = await supabase
            .from('job_postings')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error || !data) {
            throw new Error(`Failed to update job posting: ${error?.message}`);
        }

        return this.mapToEntity(data);
    }

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('job_postings')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Failed to delete job posting: ${error.message}`);
        }
    }

    private mapToEntity(data: any): JobPosting {
        return {
            id: data.id,
            recruiterId: data.recruiter_id,
            title: data.title,
            companyName: data.company_name,
            location: data.location,
            industrialSector: data.industrial_sector,
            jobArea: data.job_area,
            contractType: data.contract_type as ContractType,
            modality: data.modality as Modality,
            salaryRange: data.salary_range,
            shift: data.shift as Shift,
            descriptionShort: data.description_short,
            descriptionLong: data.description_long,
            contactPhone: data.contact_phone,
            contactEmail: data.contact_email,
            isActive: data.status === 'active',
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
        };
    }
}
