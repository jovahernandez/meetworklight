import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SupabaseJobPostingRepository } from '@/infrastructure/supabase/SupabaseJobPostingRepository';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            );
        }

        const jobRepo = new SupabaseJobPostingRepository();
        const job = await jobRepo.findById(params.id);

        if (!job) {
            return NextResponse.json(
                { error: 'Vacante no encontrada' },
                { status: 404 }
            );
        }

        // Verificar que la vacante pertenece al usuario
        if (job.recruiterId !== user.id) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            data: job,
        });
    } catch (error: any) {
        console.error('Error in GET recruiter job:', error);
        return NextResponse.json(
            { error: 'Error al obtener vacante' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        const jobRepo = new SupabaseJobPostingRepository();

        // Verificar que la vacante existe y pertenece al usuario
        const existingJob = await jobRepo.findById(params.id);
        if (!existingJob || existingJob.recruiterId !== user.id) {
            return NextResponse.json(
                { error: 'Vacante no encontrada o no autorizado' },
                { status: 403 }
            );
        }

        const updatedJob = await jobRepo.update(params.id, body);

        return NextResponse.json({
            success: true,
            data: updatedJob,
        });
    } catch (error: any) {
        console.error('Error in PATCH recruiter job:', error);
        return NextResponse.json(
            { error: 'Error al actualizar vacante' },
            { status: 500 }
        );
    }
}
