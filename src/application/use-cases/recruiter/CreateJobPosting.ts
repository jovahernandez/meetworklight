import { IJobPostingRepository } from '@/ports/repositories/IJobPostingRepository';
import { IRecruiterProfileRepository } from '@/ports/repositories/IRecruiterProfileRepository';
import { JobPosting } from '@/domain/entities/JobPosting';
import { CreateJobPostingDTO } from '@/application/dto/CreateJobPostingDTO';
import { ValidationError } from '@/domain/errors/ValidationError';
import { UnauthorizedError } from '@/domain/errors/UnauthorizedError';

export class CreateJobPosting {
    constructor(
        private jobPostingRepository: IJobPostingRepository,
        private recruiterProfileRepository: IRecruiterProfileRepository
    ) { }

    async execute(userId: string, dto: CreateJobPostingDTO): Promise<JobPosting> {
        // Verify user has recruiter profile
        const recruiterProfile = await this.recruiterProfileRepository.findByUserId(userId);
        if (!recruiterProfile) {
            throw new UnauthorizedError('Only recruiters can create job postings');
        }

        // Validate required fields
        if (!dto.title?.trim()) {
            throw new ValidationError('Job title is required', 'title');
        }
        if (!dto.companyName?.trim()) {
            throw new ValidationError('Company name is required', 'companyName');
        }
        if (!dto.location?.trim()) {
            throw new ValidationError('Location is required', 'location');
        }
        if (!dto.industrialSector?.trim()) {
            throw new ValidationError('Industrial sector is required', 'industrialSector');
        }
        if (!dto.jobArea?.trim()) {
            throw new ValidationError('Job area is required', 'jobArea');
        }
        if (!dto.descriptionShort?.trim()) {
            throw new ValidationError('Short description is required', 'descriptionShort');
        }
        if (!dto.contactPhone?.trim()) {
            throw new ValidationError('Contact phone is required', 'contactPhone');
        }
        if (!dto.contactEmail?.trim()) {
            throw new ValidationError('Contact email is required', 'contactEmail');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(dto.contactEmail)) {
            throw new ValidationError('Invalid email format', 'contactEmail');
        }

        // Iteración 2: Validar campos de seguridad
        if (!dto.companyRfc?.trim()) {
            throw new ValidationError('Company RFC is required', 'companyRfc');
        }
        if (dto.companyRfc.length < 12 || dto.companyRfc.length > 13) {
            throw new ValidationError('Company RFC must be 12-13 characters', 'companyRfc');
        }
        if (!dto.companyLocation?.trim()) {
            throw new ValidationError('Company location is required', 'companyLocation');
        }
        if (!dto.worksiteLocation?.trim()) {
            throw new ValidationError('Worksite location is required', 'worksiteLocation');
        }
        // Google Maps URL: obligatorio excepto para remote
        if (dto.modality !== 'remote') {
            if (!dto.worksiteGoogleMapsUrl?.trim()) {
                throw new ValidationError('Google Maps URL is required for non-remote jobs', 'worksiteGoogleMapsUrl');
            }
            const isValidMapsUrl = dto.worksiteGoogleMapsUrl.includes('google.com/maps') ||
                dto.worksiteGoogleMapsUrl.includes('maps.app.goo.gl');
            if (!isValidMapsUrl) {
                throw new ValidationError('Invalid Google Maps URL', 'worksiteGoogleMapsUrl');
            }
        }
        if (!dto.contractorPhoneWhatsapp?.trim()) {
            throw new ValidationError('Contractor phone/WhatsApp is required', 'contractorPhoneWhatsapp');
        }
        if (dto.contractorPhoneWhatsapp.length < 8) {
            throw new ValidationError('Contractor phone must be at least 8 characters', 'contractorPhoneWhatsapp');
        }
        if (!dto.companyPhone?.trim()) {
            throw new ValidationError('Company phone is required', 'companyPhone');
        }
        if (dto.companyPhone.length < 8) {
            throw new ValidationError('Company phone must be at least 8 characters', 'companyPhone');
        }
        if (!dto.startDate) {
            throw new ValidationError('Start date is required', 'startDate');
        }
        if (!(dto.startDate instanceof Date) || isNaN(dto.startDate.getTime())) {
            throw new ValidationError('Invalid start date', 'startDate');
        }

        // Iteración 3.1: Validar vigencia
        if (!dto.validityDays) {
            throw new ValidationError('Validity days is required', 'validityDays');
        }
        if (dto.validityDays < 7 || dto.validityDays > 30) {
            throw new ValidationError('Validity must be between 7 and 30 days', 'validityDays');
        }

        // Calcular fecha de expiración (backend authority)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiresAt = new Date(today.getTime() + (dto.validityDays * 24 * 60 * 60 * 1000));

        return await this.jobPostingRepository.create({
            recruiterId: userId,
            ...dto,
            expiresAt,
        });
    }
}
