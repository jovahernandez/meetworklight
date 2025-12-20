// Iteración 6: Cron job para verificar actividad de reclutadores
// Este endpoint debe ejecutarse diariamente via Vercel Cron o similar
// Verifica reclutadores que no han publicado en 30 días y cambia su rol

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { DummyNotificationService } from '@/infrastructure/services/DummyNotificationService';

export const dynamic = 'force-dynamic';

// Función para crear cliente admin (lazy initialization para evitar errores en build)
function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// Verificar que la request viene de Vercel Cron (seguridad)
function verifyCronAuth(request: NextRequest): boolean {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // En desarrollo, permitir sin autenticación
    if (process.env.NODE_ENV === 'development') {
        return true;
    }

    // En producción, verificar el secret
    if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
        return true;
    }

    return false;
}

export async function GET(request: NextRequest) {
    // Verificar autenticación del cron
    if (!verifyCronAuth(request)) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    // Inicializar cliente admin dentro de la función (lazy initialization)
    const supabaseAdmin = getSupabaseAdmin();

    const notificationService = new DummyNotificationService();
    const results = {
        checked: 0,
        warned: 0,
        expired: 0,
        errors: [] as string[],
    };

    try {
        const today = new Date();
        const warningDays = 7; // Avisar 7 días antes de expirar
        const expirationDays = 30; // Rol expira después de 30 días sin publicar

        // 1. Buscar reclutadores que necesitan advertencia (23-29 días sin publicar)
        const warningDate = new Date(today);
        warningDate.setDate(warningDate.getDate() - (expirationDays - warningDays));

        const { data: warningRecruiters, error: warningError } = await supabaseAdmin
            .from('recruiter_profiles')
            .select('user_id, company_name')
            .eq('role_status', 'active')
            .lt('last_job_posted_at', warningDate.toISOString())
            .not('last_job_posted_at', 'is', null);

        if (warningError) {
            results.errors.push(`Error fetching warning recruiters: ${warningError.message}`);
        } else if (warningRecruiters) {
            for (const recruiter of warningRecruiters) {
                try {
                    // Obtener email del usuario
                    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(recruiter.user_id);

                    if (userData?.user?.email) {
                        // Calcular días restantes
                        const { data: profile } = await supabaseAdmin
                            .from('recruiter_profiles')
                            .select('last_job_posted_at')
                            .eq('user_id', recruiter.user_id)
                            .single();

                        if (profile?.last_job_posted_at) {
                            const lastPosted = new Date(profile.last_job_posted_at);
                            const expiresAt = new Date(lastPosted);
                            expiresAt.setDate(expiresAt.getDate() + expirationDays);
                            const daysLeft = Math.ceil((expiresAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                            // Actualizar estado a warning
                            await supabaseAdmin
                                .from('recruiter_profiles')
                                .update({
                                    role_status: 'warning',
                                    role_expires_at: expiresAt.toISOString()
                                })
                                .eq('user_id', recruiter.user_id);

                            // Enviar notificación
                            await notificationService.notifyRecruiterRoleExpiring(
                                recruiter.user_id,
                                userData.user.email,
                                daysLeft
                            );

                            results.warned++;
                        }
                    }
                } catch (err: any) {
                    results.errors.push(`Error processing warning for ${recruiter.user_id}: ${err.message}`);
                }
            }
        }

        // 2. Buscar reclutadores que han expirado (30+ días sin publicar)
        const expirationDate = new Date(today);
        expirationDate.setDate(expirationDate.getDate() - expirationDays);

        const { data: expiredRecruiters, error: expiredError } = await supabaseAdmin
            .from('recruiter_profiles')
            .select('user_id, company_name')
            .in('role_status', ['active', 'warning'])
            .lt('last_job_posted_at', expirationDate.toISOString())
            .not('last_job_posted_at', 'is', null);

        if (expiredError) {
            results.errors.push(`Error fetching expired recruiters: ${expiredError.message}`);
        } else if (expiredRecruiters) {
            for (const recruiter of expiredRecruiters) {
                try {
                    // Obtener email del usuario
                    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(recruiter.user_id);

                    // Cambiar rol a seeker
                    await supabaseAdmin
                        .from('users')
                        .update({ role: 'seeker' })
                        .eq('id', recruiter.user_id);

                    // Actualizar estado del perfil de reclutador
                    await supabaseAdmin
                        .from('recruiter_profiles')
                        .update({ role_status: 'expired' })
                        .eq('user_id', recruiter.user_id);

                    // Enviar notificación
                    if (userData?.user?.email) {
                        await notificationService.notifyRecruiterRoleExpired(
                            recruiter.user_id,
                            userData.user.email
                        );
                    }

                    results.expired++;
                } catch (err: any) {
                    results.errors.push(`Error expiring recruiter ${recruiter.user_id}: ${err.message}`);
                }
            }
        }

        results.checked = (warningRecruiters?.length || 0) + (expiredRecruiters?.length || 0);

        return NextResponse.json({
            success: true,
            message: `Checked ${results.checked} recruiters. Warned: ${results.warned}, Expired: ${results.expired}`,
            results,
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error('Error in recruiter activity check:', error);
        return NextResponse.json(
            {
                error: 'Error checking recruiter activity',
                details: error.message,
                results,
            },
            { status: 500 }
        );
    }
}
