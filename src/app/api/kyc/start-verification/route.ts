import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { StartRecruiterVerification } from '@/application/use-cases/kyc/StartRecruiterVerification';
import { StartSeekerVerification } from '@/application/use-cases/kyc/StartSeekerVerification';
import { MetamapKycService } from '@/infrastructure/metamap/MetamapKycService';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Obtener rol del usuario
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!userData?.role) {
            return NextResponse.json({ error: 'Rol de usuario no encontrado' }, { status: 400 });
        }

        const kycService = new MetamapKycService();
        let result;

        if (userData.role === 'recruiter') {
            const useCase = new StartRecruiterVerification(kycService);
            result = await useCase.execute(user.id);
        } else {
            const useCase = new StartSeekerVerification(kycService);
            result = await useCase.execute(user.id);
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error al iniciar verificación:', error);
        return NextResponse.json(
            { error: error.message || 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
