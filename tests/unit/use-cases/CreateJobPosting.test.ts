import { describe, it, expect, beforeEach } from 'vitest';
import { CreateJobPosting } from '@/application/use-cases/recruiter/CreateJobPosting';
import { MockJobPostingRepository } from '../../mocks/MockJobPostingRepository';
import { MockRecruiterProfileRepository } from '../../mocks/MockRecruiterProfileRepository';
import { ValidationError } from '@/domain/errors/ValidationError';
import { UnauthorizedError } from '@/domain/errors/UnauthorizedError';

describe('CreateJobPosting Use Case', () => {
    let jobPostingRepo: MockJobPostingRepository;
    let recruiterProfileRepo: MockRecruiterProfileRepository;
    let useCase: CreateJobPosting;

    beforeEach(() => {
        jobPostingRepo = new MockJobPostingRepository();
        recruiterProfileRepo = new MockRecruiterProfileRepository();
        useCase = new CreateJobPosting(jobPostingRepo, recruiterProfileRepo);
    });

    it('should create a job posting successfully', async () => {
        // Arrange
        const userId = 'user-123';
        await recruiterProfileRepo.create({
            userId,
            companyName: 'Constructora ABC',
            contactName: 'Juan Pérez',
            phone: '5551234567',
            emailContact: 'contacto@abc.com',
            location: 'Ciudad de México',
            industrialSector: 'Construcción',
        });

        const jobData = {
            title: 'Ingeniero Civil',
            companyName: 'Constructora ABC',
            location: 'Ciudad de México',
            industrialSector: 'Construcción',
            jobArea: 'Ingeniería',
            contractType: 'full-time' as const,
            modality: 'on-site' as const,
            shift: 'morning' as const,
            descriptionShort: 'Buscamos ingeniero civil con experiencia',
            contactPhone: '5551234567',
            contactEmail: 'rh@abc.com',
        };

        // Act
        const result = await useCase.execute(userId, jobData);

        // Assert
        expect(result).toBeDefined();
        expect(result.title).toBe(jobData.title);
        expect(result.recruiterId).toBe(userId);
        expect(result.isActive).toBe(true);
    });

    it('should throw UnauthorizedError if user is not a recruiter', async () => {
        const userId = 'user-456';
        const jobData = {
            title: 'Test Job',
            companyName: 'Test Company',
            location: 'Test Location',
            industrialSector: 'Test',
            jobArea: 'Test',
            contractType: 'full-time' as const,
            modality: 'on-site' as const,
            shift: 'morning' as const,
            descriptionShort: 'Test description',
            contactPhone: '1234567890',
            contactEmail: 'test@test.com',
        };

        await expect(useCase.execute(userId, jobData)).rejects.toThrow(UnauthorizedError);
    });

    it('should validate required fields', async () => {
        const userId = 'user-123';
        await recruiterProfileRepo.create({
            userId,
            companyName: 'Test Co',
            contactName: 'Test',
            phone: '123',
            emailContact: 'test@test.com',
            location: 'Test',
            industrialSector: 'Test',
        });

        const invalidJobData = {
            title: '', // Invalid: empty title
            companyName: 'Test',
            location: 'Test',
            industrialSector: 'Test',
            jobArea: 'Test',
            contractType: 'full-time' as const,
            modality: 'on-site' as const,
            shift: 'morning' as const,
            descriptionShort: 'Test',
            contactPhone: '123',
            contactEmail: 'test@test.com',
        };

        await expect(useCase.execute(userId, invalidJobData)).rejects.toThrow(ValidationError);
    });

    it('should validate email format', async () => {
        const userId = 'user-123';
        await recruiterProfileRepo.create({
            userId,
            companyName: 'Test Co',
            contactName: 'Test',
            phone: '123',
            emailContact: 'test@test.com',
            location: 'Test',
            industrialSector: 'Test',
        });

        const invalidJobData = {
            title: 'Test Job',
            companyName: 'Test',
            location: 'Test',
            industrialSector: 'Test',
            jobArea: 'Test',
            contractType: 'full-time' as const,
            modality: 'on-site' as const,
            shift: 'morning' as const,
            descriptionShort: 'Test',
            contactPhone: '123',
            contactEmail: 'invalid-email', // Invalid email
        };

        await expect(useCase.execute(userId, invalidJobData)).rejects.toThrow(ValidationError);
    });
});
