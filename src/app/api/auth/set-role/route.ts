import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { role } = body;

        if (!role || !['recruiter', 'seeker'].includes(role)) {
            return NextResponse.json(
                { error: 'Rol inválido. Debe ser "recruiter" o "seeker"' },
                { status: 400 }
            );
        }

        // Get current user from Supabase session
        const supabase = await createClient();
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        if (authError || !authUser) {
            return NextResponse.json(
                { error: 'No hay sesión activa. Por favor inicia sesión.' },
                { status: 401 }
            );
        }

        // Update user role in database
        const { error: updateError } = await supabase
            .from('users')
            .update({ role })
            .eq('id', authUser.id);

        if (updateError) {
            console.error('Error updating user role:', updateError);
            return NextResponse.json(
                { error: 'Error al actualizar el rol' },
                { status: 500 }
            );
        }

        // Get updated user data
        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

        if (fetchError) {
            console.error('Error fetching user:', fetchError);
        }

        return NextResponse.json({
            success: true,
            data: {
                userId: authUser.id,
                email: authUser.email,
                role: role,
            },
            message: `Rol asignado exitosamente. Ahora puedes crear tu perfil de ${role === 'recruiter' ? 'reclutador' : 'buscador de empleo'}.`,
        });
    } catch (error: any) {
        console.error('Error in set-role endpoint:', error);

        return NextResponse.json(
            { error: 'Error al asignar rol. Por favor intenta nuevamente.' },
            { status: 500 }
        );
    }
}
