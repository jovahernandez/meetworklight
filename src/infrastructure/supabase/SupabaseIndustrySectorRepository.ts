import { supabase } from './client';
import { IIndustrySectorRepository } from '@/ports/repositories/IIndustrySectorRepository';
import { IndustrySector } from '@/domain/entities/IndustrySector';

export class SupabaseIndustrySectorRepository implements IIndustrySectorRepository {
    async findAll(): Promise<IndustrySector[]> {
        const { data, error } = await supabase
            .from('industry_sectors')
            .select('*')
            .order('name', { ascending: true });

        if (error || !data) {
            return [];
        }

        return data.map(item => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
        }));
    }

    async findBySlug(slug: string): Promise<IndustrySector | null> {
        const { data, error } = await supabase
            .from('industry_sectors')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !data) {
            return null;
        }

        return {
            id: data.id,
            name: data.name,
            slug: data.slug,
        };
    }
}
