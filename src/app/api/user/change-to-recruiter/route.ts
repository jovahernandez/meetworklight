import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // Verificar autenticación
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            );
        }

        // Verificar que existe un perfil de reclutador
        const { data: recruiterProfile } = await supabase
            .from('recruiter_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (!recruiterProfile) {
            return NextResponse.json(
                { error: 'No tienes un perfil de reclutador creado. Completa tu información de empresa primero.' },
                { status: 400 }
            );
        }

        // Actualizar el rol a 'recruiter'
        const { error: updateError } = await supabase
            .from('users')
            .update({ role: 'recruiter' })
            .eq('id', user.id);

        if (updateError) {
            console.error('Error updating user role:', updateError);
            return NextResponse.json(
                { error: 'Error al cambiar el rol' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Rol cambiado exitosamente a reclutador'
        });
    } catch (error) {
        console.error('Error in change-to-recruiter:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
