export interface CreateRecruiterProfileDTO {
    companyName: string;
    contactName: string;
    phone: string;
    emailContact: string;
    location: string;
    industrialSector: string;
    website?: string;
}

export interface UpdateRecruiterProfileDTO {
    companyName?: string;
    contactName?: string;
    phone?: string;
    emailContact?: string;
    location?: string;
    industrialSector?: string;
    website?: string;
}

export interface CreateJobSeekerProfileDTO {
    fullName: string;
    mainRole: string;
    yearsExperience: number;
    preferredSectors: string[];
    location: string;
    openToRelocation: boolean;
}

export interface UpdateJobSeekerProfileDTO {
    fullName?: string;
    mainRole?: string;
    yearsExperience?: number;
    preferredSectors?: string[];
    location?: string;
    openToRelocation?: boolean;
}
