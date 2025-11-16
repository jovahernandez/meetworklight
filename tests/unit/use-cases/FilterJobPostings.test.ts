import { describe, it, expect, beforeEach } from 'vitest';
import { FilterJobPostings } from '@/application/use-cases/job-seeker/FilterJobPostings';
import { MockJobPostingRepository } from '../../mocks/MockJobPostingRepository';
import { JobPosting } from '@/domain/entities/JobPosting';

describe('FilterJobPostings Use Case', () => {
    let jobPostingRepo: MockJobPostingRepository;
    let useCase: FilterJobPostings;

    beforeEach(() => {
        jobPostingRepo = new MockJobPostingRepository();
        useCase = new FilterJobPostings(jobPostingRepo);

        // Seed with test data
        const testJobs: JobPosting[] = [
            {
                id: 'job-1',
                recruiterId: 'user-1',
                title: 'Ingeniero Civil',
                companyName: 'Constructora ABC',
                location: 'Ciudad de México',
                industrialSector: 'Construcción',
                jobArea: 'Ingeniería',
                contractType: 'full-time',
                modality: 'on-site',
                shift: 'morning',
                descriptionShort: 'Buscamos ingeniero civil con experiencia en obras',
                contactPhone: '5551234567',
                contactEmail: 'rh@abc.com',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 'job-2',
                recruiterId: 'user-1',
                title: 'Operador de Montacargas',
                companyName: 'Logística XYZ',
                location: 'Monterrey',
                industrialSector: 'Logística y Transporte',
                jobArea: 'Operativo',
                contractType: 'full-time',
                modality: 'on-site',
                shift: 'rotating',
                descriptionShort: 'Se requiere operador con licencia vigente',
                contactPhone: '8181234567',
                contactEmail: 'rh@xyz.com',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 'job-3',
                recruiterId: 'user-2',
                title: 'Supervisor de Producción',
                companyName: 'Manufactura DEF',
                location: 'Querétaro',
                industrialSector: 'Manufactura',
                jobArea: 'Supervisión',
                contractType: 'full-time',
                modality: 'hybrid',
                shift: 'morning',
                descriptionShort: 'Supervisor con experiencia en líneas de producción',
                contactPhone: '4421234567',
                contactEmail: 'rh@def.com',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        jobPostingRepo.seed(testJobs);
    });

    it('should return all active jobs when no filters applied', async () => {
        const result = await useCase.execute({});
        expect(result).toHaveLength(3);
    });

    it('should filter by location', async () => {
        const result = await useCase.execute({ location: 'Monterrey' });
        expect(result).toHaveLength(1);
        expect(result[0].location).toBe('Monterrey');
    });

    it('should filter by industrial sector', async () => {
        const result = await useCase.execute({ industrialSector: 'Construcción' });
        expect(result).toHaveLength(1);
        expect(result[0].industrialSector).toBe('Construcción');
    });

    it('should filter by job area', async () => {
        const result = await useCase.execute({ jobArea: 'Operativo' });
        expect(result).toHaveLength(1);
        expect(result[0].jobArea).toBe('Operativo');
    });

    it('should filter by modality', async () => {
        const result = await useCase.execute({ modality: 'hybrid' });
        expect(result).toHaveLength(1);
        expect(result[0].modality).toBe('hybrid');
    });

    it('should filter by search text (title)', async () => {
        const result = await useCase.execute({ searchText: 'ingeniero' });
        expect(result).toHaveLength(1);
        expect(result[0].title).toContain('Ingeniero');
    });

    it('should filter by search text (company)', async () => {
        const result = await useCase.execute({ searchText: 'logística' });
        expect(result).toHaveLength(1);
        expect(result[0].companyName).toContain('Logística');
    });

    it('should combine multiple filters', async () => {
        const result = await useCase.execute({
            industrialSector: 'Manufactura',
            modality: 'hybrid',
        });
        expect(result).toHaveLength(1);
        expect(result[0].industrialSector).toBe('Manufactura');
        expect(result[0].modality).toBe('hybrid');
    });

    it('should return empty array when no jobs match filters', async () => {
        const result = await useCase.execute({
            location: 'Non-existent City',
        });
        expect(result).toHaveLength(0);
    });
});
