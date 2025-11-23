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
    // Iteración 2: Datos de seguridad
    companyRfc: string;
    companyLocation: string;
    worksiteLocation: string;
    worksiteGoogleMapsUrl?: string; // opcional solo si remote
    contractorPhoneWhatsapp: string;
    companyPhone: string;
    startDate: Date;
    // Iteración 3.1: Vigencia (expiresAt puede ser null para vacantes viejas)
    validityDays: number;
    expiresAt: Date | null;
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
    // Iteración 2: Datos de seguridad
    companyRfc: string;
    companyLocation: string;
    worksiteLocation: string;
    worksiteGoogleMapsUrl?: string;
    contractorPhoneWhatsapp: string;
    companyPhone: string;
    startDate: Date;
    // Iteración 3.1: Vigencia
    validityDays: number;
    expiresAt: Date; // Calculado en backend
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
    // Iteración 2: Datos de seguridad
    companyRfc?: string;
    companyLocation?: string;
    worksiteLocation?: string;
    worksiteGoogleMapsUrl?: string;
    contractorPhoneWhatsapp?: string;
    companyPhone?: string;
    startDate?: Date;
    // Iteración 3.1: Vigencia
    validityDays?: number;
    expiresAt?: Date; // Recalculado si cambia validityDays
}
