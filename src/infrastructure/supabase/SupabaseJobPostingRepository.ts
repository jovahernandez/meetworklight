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
        console.log('🔎 DEBUG - Finding jobs for recruiter:', recruiterId);

        const { data, error } = await supabase
            .from('job_postings')
            .select('*')
            .eq('recruiter_id', recruiterId)
            .order('created_at', { ascending: false });

        console.log('🔎 DEBUG - Query result:', {
            found: data?.length || 0,
            error: error?.message
        });

        if (error) {
            console.error('❌ DEBUG - Error fetching jobs:', error);
        }

        if (data) {
            console.log('📦 DEBUG - Raw data from DB:', JSON.stringify(data, null, 2));
        }

        if (error || !data) {
            return [];
        }

        return data.map(this.mapToEntity);
    }

    async findAll(filters?: JobPostingFilters): Promise<JobPosting[]> {
        console.log('🔎 DEBUG findAll - Filters received:', filters);

        let query = supabase.from('job_postings').select('*');

        // Iteración 3.1: Usar is_active (BOOLEAN) en lugar de status
        if (filters?.isActive !== undefined) {
            query = query.eq('is_active', filters.isActive);
            console.log('🔎 DEBUG findAll - Filtering by is_active =', filters.isActive);
        } else {
            // By default, only show active jobs
            query = query.eq('is_active', true);
            console.log('🔎 DEBUG findAll - Filtering by is_active = true (default)');
        }

        // Iteración 3.1: Filtrar vacantes expiradas (solo para buscadores)
        // Si expires_at existe, debe ser >= hoy. Si es NULL, se muestra (vacantes viejas)
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        console.log('🔎 DEBUG findAll - Today date for expiry check:', today);
        query = query.or(`expires_at.is.null,expires_at.gte.${today}`);

        if (filters?.location) {
            query = query.ilike('location', `%${filters.location}%`);
        }

        if (filters?.industrialSector) {
            console.log('🔎 DEBUG findAll - Filtering by sector:', filters.industrialSector);
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

        console.log('🔎 DEBUG findAll - Query result:', {
            found: data?.length || 0,
            error: error?.message,
            errorDetails: error
        });

        if (data) {
            console.log('📦 DEBUG findAll - Raw data:', JSON.stringify(data.map(d => ({
                id: d.id,
                title: d.title,
                sector: d.industrial_sector,
                is_active: d.is_active,
                expires_at: d.expires_at,
                created_at: d.created_at
            })), null, 2));
        } else {
            console.log('❌ DEBUG findAll - NO DATA RETURNED');
        }

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
                is_active: true, // Iteración 3.1: usar is_active BOOLEAN
                // Iteración 2: Datos de seguridad
                company_rfc: params.companyRfc,
                company_location: params.companyLocation,
                worksite_location: params.worksiteLocation,
                worksite_google_maps_url: params.worksiteGoogleMapsUrl,
                contractor_phone_whatsapp: params.contractorPhoneWhatsapp,
                company_phone: params.companyPhone,
                start_date: params.startDate,
                // Iteración 3.1: Vigencia
                validity_days: params.validityDays,
                expires_at: params.expiresAt,
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
        if (params.isActive !== undefined) updateData.is_active = params.isActive; // Iteración 3.1: usar is_active BOOLEAN
        // Iteración 2: Datos de seguridad
        if (params.companyRfc !== undefined) updateData.company_rfc = params.companyRfc;
        if (params.companyLocation !== undefined) updateData.company_location = params.companyLocation;
        if (params.worksiteLocation !== undefined) updateData.worksite_location = params.worksiteLocation;
        if (params.worksiteGoogleMapsUrl !== undefined) updateData.worksite_google_maps_url = params.worksiteGoogleMapsUrl;
        if (params.contractorPhoneWhatsapp !== undefined) updateData.contractor_phone_whatsapp = params.contractorPhoneWhatsapp;
        if (params.companyPhone !== undefined) updateData.company_phone = params.companyPhone;
        if (params.startDate !== undefined) updateData.start_date = params.startDate;
        // Iteración 3.1: Vigencia
        if (params.validityDays !== undefined) updateData.validity_days = params.validityDays;
        if (params.expiresAt !== undefined) updateData.expires_at = params.expiresAt;

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
            isActive: data.is_active ?? false, // Iteración 3.1: usar is_active BOOLEAN
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
            // Iteración 2: Datos de seguridad
            companyRfc: data.company_rfc || '',
            companyLocation: data.company_location || '',
            worksiteLocation: data.worksite_location || '',
            worksiteGoogleMapsUrl: data.worksite_google_maps_url,
            contractorPhoneWhatsapp: data.contractor_phone_whatsapp || '',
            companyPhone: data.company_phone || '',
            startDate: data.start_date ? new Date(data.start_date) : new Date(),
            // Iteración 3.1: Vigencia (sin inventar fechas para vacantes viejas)
            validityDays: data.validity_days || 30,
            expiresAt: data.expires_at ? new Date(data.expires_at) : null,
        };
    }
}
