import { IndustrySector } from '@/domain/entities/IndustrySector';

export interface IIndustrySectorRepository {
    findAll(): Promise<IndustrySector[]>;
    findBySlug(slug: string): Promise<IndustrySector | null>;
}
