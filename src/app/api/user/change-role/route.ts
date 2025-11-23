import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'No autenticado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { newRole, recruiterData } = body;

        if (!newRole || (newRole !== 'seeker' && newRole !== 'recruiter')) {
            return NextResponse.json(
                { success: false, error: 'Rol inválido' },
                { status: 400 }
            );
        }

        // Obtener rol actual
        const { data: currentUserData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        if (currentUserData?.role === newRole) {
            return NextResponse.json(
                { success: false, error: 'Ya tienes este rol' },
                { status: 400 }
            );
        }

        // Si cambia a reclutador, validar y crear perfil de reclutador
        if (newRole === 'recruiter') {
            if (!recruiterData) {
                return NextResponse.json(
                    { success: false, error: 'Se requiere información de la empresa' },
                    { status: 400 }
                );
            }

            const { companyName, rfc, contactName, phone, emailContact, location, industrialSector, website } = recruiterData;

            // Validar campos requeridos
            if (!companyName || !rfc || !contactName || !phone || !emailContact || !location) {
                return NextResponse.json(
                    { success: false, error: 'Faltan campos obligatorios de validación' },
                    { status: 400 }
                );
            }

            // Validar formato de RFC
            const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
            if (!rfcRegex.test(rfc.toUpperCase())) {
                return NextResponse.json(
                    { success: false, error: 'El RFC no tiene un formato válido' },
                    { status: 400 }
                );
            }

            // Verificar si ya existe un perfil de reclutador
            const { data: existingProfile } = await supabase
                .from('recruiter_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!existingProfile) {
                // Crear perfil de reclutador
                const { error: profileError } = await supabase
                    .from('recruiter_profiles')
                    .insert({
                        user_id: user.id,
                        company_name: companyName,
                        contact_name: contactName,
                        phone,
                        email_contact: emailContact,
                        location,
                        industrial_sector: industrialSector || 'Construcción',
                        website: website || null,
                    });

                if (profileError) {
                    console.error('Error creating recruiter profile:', profileError);
                    return NextResponse.json(
                        { success: false, error: 'Error al crear perfil de reclutador' },
                        { status: 500 }
                    );
                }
            }
        }

        // Actualizar rol del usuario
        const { error: updateError } = await supabase
            .from('users')
            .update({ role: newRole })
            .eq('id', user.id);

        if (updateError) {
            console.error('Error updating user role:', updateError);
            return NextResponse.json(
                { success: false, error: 'Error al actualizar rol' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Rol actualizado exitosamente',
            newRole,
        });
    } catch (error) {
        console.error('Error changing role:', error);
        return NextResponse.json(
            { success: false, error: 'Error al cambiar de rol' },
            { status: 500 }
        );
    }
}
