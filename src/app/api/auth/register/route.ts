import { NextRequest, NextResponse } from 'next/server';
import { SupabaseAuthService } from '@/infrastructure/supabase/SupabaseAuthService';
import { SupabaseUserRepository } from '@/infrastructure/supabase/SupabaseUserRepository';
import { RegisterUser } from '@/application/use-cases/auth/RegisterUser';

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
        const registerUseCase = new RegisterUser(authService, userRepository);
        const user = await registerUseCase.execute({ email, password }); return NextResponse.json({
            success: true,
            data: {
                userId: user.id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
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
