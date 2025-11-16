import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email y contraseña son requeridos' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Register with Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            console.error('Error in register endpoint:', authError);

            if (authError.message?.includes('already registered')) {
                return NextResponse.json(
                    { error: 'Este correo electrónico ya está registrado' },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                { error: authError.message },
                { status: 400 }
            );
        }

        if (!authData.user) {
            return NextResponse.json(
                { error: 'No se pudo crear el usuario' },
                { status: 500 }
            );
        }

        // Create user record in public.users table
        const { error: userError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email: authData.user.email,
                role: null,
                created_at: new Date().toISOString(),
            });

        if (userError) {
            console.error('Error creating user record:', userError);
            // Continue anyway, user is already created in auth
        }

        return NextResponse.json({
            success: true,
            data: {
                userId: authData.user.id,
                email: authData.user.email,
                role: null,
                createdAt: authData.user.created_at,
            },
            message: 'Usuario registrado exitosamente. Por favor selecciona tu tipo de perfil.',
        });
    } catch (error: any) {
        console.error('Error in register endpoint:', error);

        if (error.message?.includes('already registered') || error.message?.includes('ya está registrado')) {
            return NextResponse.json(
                { error: 'Este correo electrónico ya está registrado' },
                { status: 409 }
            );
        }

        if (error.message?.includes('Invalid email') || error.message?.includes('correo electrónico no es válido')) {
            return NextResponse.json(
                { error: 'El formato del correo electrónico no es válido' },
                { status: 400 }
            );
        }

        if (error.message?.includes('Password') || error.message?.includes('contraseña')) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Error al registrar usuario. Por favor intenta nuevamente.' },
            { status: 500 }
        );
    }
}
