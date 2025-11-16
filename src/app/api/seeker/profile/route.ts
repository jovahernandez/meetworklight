import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { fullName, phone, location, preferredSector, experienceLevel, skills, bio } = body;

        // Insert seeker profile
        const { data: profile, error: profileError } = await supabase
            .from('seeker_profiles')
            .insert({
                user_id: user.id,
                full_name: fullName,
                phone,
                location,
                preferred_sector: preferredSector,
                experience_level: experienceLevel,
                skills,
                bio: bio || null,
            })
            .select()
            .single();

        if (profileError) {
            console.error('Error creating seeker profile:', profileError);
            return NextResponse.json(
                { success: false, error: 'Error al crear perfil de buscador' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: profile,
            message: 'Perfil de buscador creado exitosamente',
        });
    } catch (error) {
        console.error('Error in POST /api/seeker/profile:', error);
        return NextResponse.json(
            { success: false, error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            );
        }

        const { data: profile, error: profileError } = await supabase
            .from('seeker_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (profileError) {
            return NextResponse.json(
                { success: false, error: 'Perfil no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: profile,
        });
    } catch (error) {
        console.error('Error in GET /api/seeker/profile:', error);
        return NextResponse.json(
            { success: false, error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
