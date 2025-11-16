import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: 'Sesión cerrada exitosamente',
        });
    } catch (error: any) {
        console.error('Error in logout endpoint:', error);

        return NextResponse.json(
            { error: 'Error al cerrar sesión. Por favor intenta nuevamente.' },
            { status: 500 }
        );
    }
}
