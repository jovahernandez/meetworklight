import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const jobId = params.id;

        // Fetch job posting - public endpoint, only show active jobs
        const { data: job, error } = await supabase
            .from('job_postings')
            .select('*')
            .eq('id', jobId)
            .eq('status', 'active') // Only show active jobs to public
            .single();

        if (error || !job) {
            return NextResponse.json(
                { error: 'Vacante no encontrada o no disponible' },
                { status: 404 }
            );
        }

        return NextResponse.json(job);
    } catch (error) {
        console.error('Error fetching job:', error);
        return NextResponse.json(
            { error: 'Error al obtener la vacante' },
            { status: 500 }
        );
    }
}
