export interface JobSeekerProfile {
    id: string;
    userId: string;
    fullName: string;
    mainRole: string;
    yearsExperience: number;
    preferredSectors: string[];
    location: string;
    openToRelocation: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateJobSeekerProfileParams {
    userId: string;
    fullName: string;
    mainRole: string;
    yearsExperience: number;
    preferredSectors: string[];
    location: string;
    openToRelocation: boolean;
}

export interface UpdateJobSeekerProfileParams {
    fullName?: string;
    mainRole?: string;
    yearsExperience?: number;
    preferredSectors?: string[];
    location?: string;
    openToRelocation?: boolean;
}
