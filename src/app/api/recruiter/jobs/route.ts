import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SupabaseJobPostingRepository } from '@/infrastructure/supabase/SupabaseJobPostingRepository';
import { SupabaseRecruiterProfileRepository } from '@/infrastructure/supabase/SupabaseRecruiterProfileRepository';
import { CreateJobPosting } from '@/application/use-cases/recruiter/CreateJobPosting';
import { ListOwnJobPostings } from '@/application/use-cases/recruiter/ListOwnJobPostings';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            );
        }

        console.log('🔍 DEBUG - Fetching jobs for user:', user.id);

        const jobRepo = new SupabaseJobPostingRepository();
        const listJobsUseCase = new ListOwnJobPostings(jobRepo);
        const jobs = await listJobsUseCase.execute(user.id);

        console.log('📋 DEBUG - Found jobs:', jobs.length);
        console.log('📋 DEBUG - Jobs data:', JSON.stringify(jobs, null, 2));

        return NextResponse.json({
            success: true,
            data: jobs,
            count: jobs.length,
        });
    } catch (error: any) {
        console.error('Error in GET recruiter jobs:', error);
        return NextResponse.json(
            { error: 'Error al obtener vacantes' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            );
        }

        const body = await request.json();

        console.log('✏️ DEBUG - Creating job for user:', user.id);
        console.log('✏️ DEBUG - Job data:', JSON.stringify(body, null, 2));

        const jobPostingRepo = new SupabaseJobPostingRepository();
        const recruiterProfileRepo = new SupabaseRecruiterProfileRepository();

        const createJobUseCase = new CreateJobPosting(jobPostingRepo, recruiterProfileRepo);
        const job = await createJobUseCase.execute(user.id, body);

        console.log('✅ DEBUG - Job created:', job.id);

        return NextResponse.json({
            success: true,
            data: job,
            message: 'Vacante creada exitosamente',
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error in POST recruiter job:', error);

        if (error.message?.includes('Only recruiters can create job postings')) {
            return NextResponse.json(
                { error: 'Solo los reclutadores pueden crear vacantes. Cambia tu rol desde tu perfil.' },
                { status: 403 }
            );
        }

        if (error.message?.includes('profile not found')) {
            return NextResponse.json(
                { error: 'Debes crear tu perfil de reclutador primero' },
                { status: 403 }
            );
        }

        if (error.message?.includes('Validation')) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Error al crear vacante' },
            { status: 500 }
        );
    }
}
