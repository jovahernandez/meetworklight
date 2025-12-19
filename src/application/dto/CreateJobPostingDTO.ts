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
    // Iteración 6: Imagen de vacante
    imageUrl?: string;
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
    // Iteración 6: Imagen de vacante
    imageUrl?: string;
}
