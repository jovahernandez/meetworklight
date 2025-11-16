import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SupabaseRecruiterProfileRepository } from '@/infrastructure/supabase/SupabaseRecruiterProfileRepository';
import { SupabaseUserRepository } from '@/infrastructure/supabase/SupabaseUserRepository';
import { CreateRecruiterProfile } from '@/application/use-cases/recruiter/CreateRecruiterProfile';
import { UpdateRecruiterProfile } from '@/application/use-cases/recruiter/UpdateRecruiterProfile';

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

        const profileRepo = new SupabaseRecruiterProfileRepository();
        const profile = await profileRepo.findByUserId(user.id);

        if (!profile) {
            return NextResponse.json(
                { error: 'Perfil no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: profile,
        });
    } catch (error: any) {
        console.error('Error in GET recruiter profile:', error);
        return NextResponse.json(
            { error: 'Error al obtener perfil' },
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

        const profileRepo = new SupabaseRecruiterProfileRepository();

        const createProfileUseCase = new CreateRecruiterProfile(profileRepo);
        const profile = await createProfileUseCase.execute(user.id, body);

        return NextResponse.json({
            success: true,
            data: profile,
            message: 'Perfil de reclutador creado exitosamente',
        });
    } catch (error: any) {
        console.error('Error in POST recruiter profile:', error);

        if (error.message?.includes('already has')) {
            return NextResponse.json(
                { error: 'Ya tienes un perfil de reclutador' },
                { status: 409 }
            );
        }

        if (error.message?.includes('not a recruiter')) {
            return NextResponse.json(
                { error: 'Debes tener rol de reclutador' },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Error al crear perfil' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
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

        const profileRepo = new SupabaseRecruiterProfileRepository();

        const updateProfileUseCase = new UpdateRecruiterProfile(profileRepo);
        const profile = await updateProfileUseCase.execute(user.id, body);

        return NextResponse.json({
            success: true,
            data: profile,
            message: 'Perfil actualizado exitosamente',
        });
    } catch (error: any) {
        console.error('Error in PUT recruiter profile:', error);

        if (error.message?.includes('not found')) {
            return NextResponse.json(
                { error: 'Perfil no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Error al actualizar perfil' },
            { status: 500 }
        );
    }
}
