import { NextResponse } from 'next/server';
import { SupabaseJobPostingRepository } from '@/infrastructure/supabase/SupabaseJobPostingRepository';
import { FilterJobPostings } from '@/application/use-cases/job-seeker/FilterJobPostings';

export const dynamic = 'force-dynamic';

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

        const jobs = await filterJobsUseCase.execute(filters);

        return NextResponse.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch jobs' },
            { status: 500 }
        );
    }
}
