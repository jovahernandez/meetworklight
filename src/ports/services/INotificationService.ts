// Iteración 4: Avisos de vigencia de vacantes
// Puerto de servicio para notificaciones relacionadas con expiración de vacantes

/**
 * Servicio de notificaciones para avisar a reclutadores sobre el estado de sus vacantes.
 * 
 * NOTA: Esta es la interfaz de puerto (hexagonal architecture).
 * La implementación actual es dummy (solo console.log).
 * 
 * TODO (Iteración 5): Implementar NotificationService real con:
 * - Envío de emails mediante Resend, SendGrid o servicio similar
 * - Posible integración con Supabase Edge Functions para emails transaccionales
 * - Cola de mensajes para procesar notificaciones de forma asíncrona
 * - Templates de email para cada tipo de notificación
 */
export interface INotificationService {
    /**
     * Notifica al reclutador que una de sus vacantes está por expirar.
     * 
     * @param userId - ID del usuario reclutador (Supabase Auth UID)
     * @param jobPostingId - ID de la vacante que está por expirar
     * @param daysLeft - Número de días restantes antes de la expiración
     * 
     * @example
     * await notificationService.notifyJobExpiringSoon(
     *   'uuid-reclutador',
     *   'uuid-vacante',
     *   2
     * );
     * 
     * TODO (Iteración 5): Enviar email con:
     * - Asunto: "Tu vacante [Título] expira en X días"
     * - Cuerpo: Información de la vacante + link directo a edición
     * - CTA: "Extender vigencia"
     */
    notifyJobExpiringSoon(
        userId: string,
        jobPostingId: string,
        daysLeft: number
    ): Promise<void>;

    /**
     * Notifica al reclutador que una de sus vacantes ha expirado.
     * 
     * @param userId - ID del usuario reclutador (Supabase Auth UID)
     * @param jobPostingId - ID de la vacante que expiró
     * 
     * @example
     * await notificationService.notifyJobExpired(
     *   'uuid-reclutador',
     *   'uuid-vacante'
     * );
     * 
     * TODO (Iteración 5): Enviar email con:
     * - Asunto: "Tu vacante [Título] ha expirado"
     * - Cuerpo: Información de la vacante + explicación de que ya no se muestra
     * - CTA: "Renovar vacante"
     */
    notifyJobExpired(
        userId: string,
        jobPostingId: string
    ): Promise<void>;
}

/**
 * PLAN DE INTEGRACIÓN PARA ITERACIÓN 5 (emails automáticos):
 * 
 * Opción A: Supabase Database Webhooks + Edge Functions
 * ------------------------------------------------------
 * 1. Crear Edge Function que escuche cambios en job_postings
 * 2. Cuando expires_at esté a X días de hoy, disparar notifyJobExpiringSoon
 * 3. Cuando expires_at < hoy, disparar notifyJobExpired
 * 4. Implementación real en EmailNotificationService usando Resend API
 * 
 * Opción B: Vercel Cron Jobs
 * --------------------------
 * 1. Crear API route en /api/cron/check-expiring-jobs
 * 2. Configurar vercel.json con cron diario:
 *    "crons": [{ "path": "/api/cron/check-expiring-jobs", "schedule": "0 9 * * *" }]
 * 3. El cron consulta todas las vacantes con:
 *    - expires_at BETWEEN hoy AND hoy+3 días → notifyJobExpiringSoon
 *    - expires_at = hoy-1 día → notifyJobExpired (una sola vez)
 * 4. Guardar log de notificaciones enviadas para evitar duplicados
 * 
 * Opción C: Supabase pg_cron
 * --------------------------
 * 1. Habilitar pg_cron extension en Supabase
 * 2. Crear función SQL que detecte vacantes expiring_soon/expired
 * 3. Llamar Edge Function o Webhook desde SQL
 * 4. Procesar envío de emails
 * 
 * RECOMENDACIÓN: Opción B (Vercel Cron) es la más simple para empezar.
 * Permite control total desde Next.js sin configuración extra en Supabase.
 */
