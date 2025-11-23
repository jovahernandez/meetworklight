// Iteración 4: Implementación dummy de INotificationService
// Solo registra logs en consola, NO envía emails reales

import { INotificationService } from '@/ports/services/INotificationService';

/**
 * Implementación dummy de INotificationService.
 * 
 * PROPÓSITO:
 * - Permitir testing de flujos de notificación sin enviar emails reales
 * - Dejar hooks en el código para futura integración con servicio real
 * - Verificar que los parámetros correctos se pasan a las funciones
 * 
 * USO ACTUAL (Iteración 4):
 * - Solo se usa para logging/debugging
 * - NO se llama automáticamente desde ningún CRON ni webhook
 * - Puede invocarse manualmente desde use cases si se desea testing
 * 
 * TODO (Iteración 5):
 * - Reemplazar esta clase con EmailNotificationService
 * - Implementar envío real de emails usando Resend, SendGrid, etc.
 * - Integrar con templates de email
 * - Agregar rate limiting y retry logic
 */
export class DummyNotificationService implements INotificationService {
    /**
     * Simula notificación de vacante por expirar.
     * Solo imprime en consola, NO envía email.
     */
    async notifyJobExpiringSoon(
        userId: string,
        jobPostingId: string,
        daysLeft: number
    ): Promise<void> {
        console.log('========================================');
        console.log('[DUMMY NOTIFICATION] Vacante por expirar');
        console.log('========================================');
        console.log(`Usuario:      ${userId}`);
        console.log(`Vacante ID:   ${jobPostingId}`);
        console.log(`Días restantes: ${daysLeft}`);
        console.log('Acción:       Enviar email "Tu vacante expira pronto"');
        console.log('TODO:         Implementar EmailNotificationService en Iteración 5');
        console.log('========================================\n');

        // Simular delay de red (opcional, para testing)
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    /**
     * Simula notificación de vacante expirada.
     * Solo imprime en consola, NO envía email.
     */
    async notifyJobExpired(
        userId: string,
        jobPostingId: string
    ): Promise<void> {
        console.log('========================================');
        console.log('[DUMMY NOTIFICATION] Vacante expirada');
        console.log('========================================');
        console.log(`Usuario:      ${userId}`);
        console.log(`Vacante ID:   ${jobPostingId}`);
        console.log('Acción:       Enviar email "Tu vacante ha expirado"');
        console.log('TODO:         Implementar EmailNotificationService en Iteración 5');
        console.log('========================================\n');

        // Simular delay de red (opcional, para testing)
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

/**
 * EJEMPLO DE USO (para testing manual):
 * 
 * import { DummyNotificationService } from '@/infrastructure/services/DummyNotificationService';
 * 
 * const notificationService = new DummyNotificationService();
 * 
 * // Simular notificación de vacante por expirar
 * await notificationService.notifyJobExpiringSoon(
 *   'user-uuid-123',
 *   'job-uuid-456',
 *   2
 * );
 * 
 * // Simular notificación de vacante expirada
 * await notificationService.notifyJobExpired(
 *   'user-uuid-123',
 *   'job-uuid-789'
 * );
 */
