import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

        // Login with Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError || !authData.user) {
            console.error('Error in login endpoint:', authError);
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        // Get user data
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        return NextResponse.json({
            success: true,
            data: {
                user: {
                    id: authData.user.id,
                    email: authData.user.email,
                    role: user?.role || null,
                },
                accessToken: authData.session?.access_token,
            },
            message: 'Inicio de sesión exitoso',
        });
    } catch (error: any) {
        console.error('Error in login endpoint:', error);

        if (error.message?.includes('Invalid credentials') || error.message?.includes('credenciales')) {
            return NextResponse.json(
                { error: 'Correo electrónico o contraseña incorrectos' },
                { status: 401 }
            );
        }

        if (error.message?.includes('not found') || error.message?.includes('no encontrado')) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Error al iniciar sesión. Por favor intenta nuevamente.' },
            { status: 500 }
        );
    }
}
