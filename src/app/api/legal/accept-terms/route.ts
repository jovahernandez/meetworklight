import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AcceptTerms } from '@/application/use-cases/legal/AcceptTerms';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { version } = await request.json();

        if (!version) {
            return NextResponse.json(
                { error: 'Versión de términos requerida' },
                { status: 400 }
            );
        }

        const acceptTerms = new AcceptTerms();
        await acceptTerms.execute({
            userId: user.id,
            version,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error al aceptar términos:', error);
        return NextResponse.json(
            { error: error.message || 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
