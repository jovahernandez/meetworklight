import { IJobPostingRepository } from '@/ports/repositories/IJobPostingRepository';
import { JobPosting } from '@/domain/entities/JobPosting';
import { UpdateJobPostingDTO } from '@/application/dto/CreateJobPostingDTO';
import { NotFoundError } from '@/domain/errors/NotFoundError';
import { UnauthorizedError } from '@/domain/errors/UnauthorizedError';
import { ValidationError } from '@/domain/errors/ValidationError';

export class UpdateJobPosting {
    constructor(private jobPostingRepository: IJobPostingRepository) { }

    async execute(userId: string, jobId: string, dto: UpdateJobPostingDTO): Promise<JobPosting> {
        const job = await this.jobPostingRepository.findById(jobId);
        if (!job) {
            throw new NotFoundError('JobPosting', jobId);
        }

        // Verify ownership
        if (job.recruiterId !== userId) {
            throw new UnauthorizedError('You can only update your own job postings');
        }

        // Validate email if provided
        if (dto.contactEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(dto.contactEmail)) {
                throw new ValidationError('Invalid email format', 'contactEmail');
            }
        }

        // Iteración 2: Validar campos de seguridad si se proporcionan
        if (dto.companyRfc !== undefined) {
            if (!dto.companyRfc?.trim()) {
                throw new ValidationError('Company RFC cannot be empty', 'companyRfc');
            }
            if (dto.companyRfc.length < 12 || dto.companyRfc.length > 13) {
                throw new ValidationError('Company RFC must be 12-13 characters', 'companyRfc');
            }
        }
        if (dto.companyLocation !== undefined && !dto.companyLocation?.trim()) {
            throw new ValidationError('Company location cannot be empty', 'companyLocation');
        }
        if (dto.worksiteLocation !== undefined && !dto.worksiteLocation?.trim()) {
            throw new ValidationError('Worksite location cannot be empty', 'worksiteLocation');
        }
        if (dto.worksiteGoogleMapsUrl !== undefined && dto.modality !== 'remote') {
            if (!dto.worksiteGoogleMapsUrl?.trim()) {
                throw new ValidationError('Google Maps URL is required for non-remote jobs', 'worksiteGoogleMapsUrl');
            }
            const isValidMapsUrl = dto.worksiteGoogleMapsUrl.includes('google.com/maps') ||
                dto.worksiteGoogleMapsUrl.includes('maps.app.goo.gl');
            if (!isValidMapsUrl) {
                throw new ValidationError('Invalid Google Maps URL', 'worksiteGoogleMapsUrl');
            }
        }
        if (dto.contractorPhoneWhatsapp !== undefined) {
            if (!dto.contractorPhoneWhatsapp?.trim()) {
                throw new ValidationError('Contractor phone cannot be empty', 'contractorPhoneWhatsapp');
            }
            if (dto.contractorPhoneWhatsapp.length < 8) {
                throw new ValidationError('Contractor phone must be at least 8 characters', 'contractorPhoneWhatsapp');
            }
        }
        if (dto.companyPhone !== undefined) {
            if (!dto.companyPhone?.trim()) {
                throw new ValidationError('Company phone cannot be empty', 'companyPhone');
            }
            if (dto.companyPhone.length < 8) {
                throw new ValidationError('Company phone must be at least 8 characters', 'companyPhone');
            }
        }
        if (dto.startDate !== undefined) {
            if (!(dto.startDate instanceof Date) || isNaN(dto.startDate.getTime())) {
                throw new ValidationError('Invalid start date', 'startDate');
            }
        }

        // Iteración 3.1: Validar y recalcular vigencia si se proporciona
        let expiresAt: Date | undefined;
        if (dto.validityDays !== undefined) {
            if (dto.validityDays < 7 || dto.validityDays > 30) {
                throw new ValidationError('Validity must be between 7 and 30 days', 'validityDays');
            }
            // Recalcular fecha de expiración con fecha actual
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            expiresAt = new Date(today.getTime() + (dto.validityDays * 24 * 60 * 60 * 1000));
        }

        return await this.jobPostingRepository.update(jobId, {
            ...dto,
            ...(expiresAt && { expiresAt }),
        });
    }
}
