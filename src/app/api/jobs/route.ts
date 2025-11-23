import { NextResponse } from 'next/server';
import { SupabaseJobPostingRepository } from '@/infrastructure/supabase/SupabaseJobPostingRepository';
import { FilterJobPostings } from '@/application/use-cases/job-seeker/FilterJobPostings';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // No cachear nunca

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const jobPostingRepo = new SupabaseJobPostingRepository();
        const filterJobsUseCase = new FilterJobPostings(jobPostingRepo);

        const filters = {
            searchText: searchParams.get('searchText') || undefined,
            location: searchParams.get('location') || undefined,
            industrialSector: searchParams.get('industrialSector') || undefined,
            jobArea: searchParams.get('jobArea') || undefined,
            contractType: (searchParams.get('contractType') as any) || undefined,
            modality: (searchParams.get('modality') as any) || undefined,
        };

        console.log('🔍 DEBUG /api/jobs - Filters:', filters);

        const jobs = await filterJobsUseCase.execute(filters);

        console.log('📋 DEBUG /api/jobs - Found jobs:', jobs.length);
        console.log('📋 DEBUG /api/jobs - Jobs:', JSON.stringify(jobs.map(j => ({
            id: j.id,
            title: j.title,
            sector: j.industrialSector,
            isActive: j.isActive
        })), null, 2));

        return NextResponse.json(jobs, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch jobs' },
            { status: 500 }
        );
    }
}
