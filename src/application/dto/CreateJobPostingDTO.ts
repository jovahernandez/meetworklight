import { ContractType, Modality, Shift } from '@/domain/entities/JobPosting';

export interface CreateJobPostingDTO {
    title: string;
    companyName: string;
    location: string;
    industrialSector: string;
    jobArea: string;
    contractType: ContractType;
    modality: Modality;
    salaryRange?: string;
    shift: Shift;
    descriptionShort: string;
    descriptionLong?: string;
    contactPhone: string;
    contactEmail: string;
}

export interface UpdateJobPostingDTO {
    title?: string;
    companyName?: string;
    location?: string;
    industrialSector?: string;
    jobArea?: string;
    contractType?: ContractType;
    modality?: Modality;
    salaryRange?: string;
    shift?: Shift;
    descriptionShort?: string;
    descriptionLong?: string;
    contactPhone?: string;
    contactEmail?: string;
    isActive?: boolean;
}
