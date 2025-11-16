export interface RecruiterProfile {
    id: string;
    userId: string;
    companyName: string;
    contactName: string;
    phone: string;
    emailContact: string;
    location: string;
    industrialSector: string;
    website?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateRecruiterProfileParams {
    userId: string;
    companyName: string;
    contactName: string;
    phone: string;
    emailContact: string;
    location: string;
    industrialSector: string;
    website?: string;
}

export interface UpdateRecruiterProfileParams {
    companyName?: string;
    contactName?: string;
    phone?: string;
    emailContact?: string;
    location?: string;
    industrialSector?: string;
    website?: string;
}
