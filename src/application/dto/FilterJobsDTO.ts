import { ContractType, Modality } from '@/domain/entities/JobPosting';

export interface FilterJobsDTO {
    searchText?: string;
    location?: string;
    industrialSector?: string;
    jobArea?: string;
    contractType?: ContractType;
    modality?: Modality;
}
