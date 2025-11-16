import { NextRequest, NextResponse } from 'next/server';
import { SupabaseAuthService } from '@/infrastructure/supabase/SupabaseAuthService';
import { SupabaseUserRepository } from '@/infrastructure/supabase/SupabaseUserRepository';
import { LoginUser } from '@/application/use-cases/auth/LoginUser';

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

        // Initialize dependencies
        const authService = new SupabaseAuthService();
        const userRepository = new SupabaseUserRepository();

        // Execute use case
        const loginUseCase = new LoginUser(authService);
        const result = await loginUseCase.execute({ email, password });

        // Get user data
        const user = await userRepository.findById(result.user.id);

        return NextResponse.json({
            success: true,
            data: {
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    role: user?.role || null,
                },
                accessToken: result.accessToken,
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
