export type ContractType = 'full-time' | 'part-time' | 'project' | 'temporary';
export type Modality = 'on-site' | 'hybrid' | 'remote';
export type Shift = 'morning' | 'afternoon' | 'night' | 'rotating' | 'flexible';

export interface JobPosting {
    id: string;
    recruiterId: string;
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
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateJobPostingParams {
    recruiterId: string;
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

export interface UpdateJobPostingParams {
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
