# ITERACIÓN 6 - MEJORAS UX Y REGLAS DE NEGOCIO

## Fecha: Diciembre 2025

## Resumen de Cambios

Esta iteración implementa el feedback del equipo con mejoras significativas en UX y nuevas reglas de negocio.

---

## 1. BOTÓN "PANEL" PARA RECLUTADORES ✅

**Archivo:** `src/components/layout/Header.tsx`

**Cambios:**
- Agregado botón "Panel" visible solo para usuarios con rol `recruiter`
- Ubicado en la parte superior derecha, al lado izquierdo del email/menú
- Diseño sutil pero visible: fondo `primary-50`, borde, icono de grid
- También disponible en menú móvil como "Panel de Reclutador"

**Redirige a:** `/recruiter/jobs`

---

## 2. TÉRMINOS Y CONDICIONES EN REGISTRO ✅

**Archivo:** `src/app/auth/register/page.tsx`

**Cambios:**
- Agregado checkbox obligatorio antes del botón de submit
- Links a `/legal/terms` y `/legal/privacy` 
- Validación tanto para registro normal como para OAuth con Google
- Mensaje de error claro si no acepta los términos

---

## 3. PAYWALL EN DETALLE DE VACANTE ✅

**Archivos:** 
- `src/components/jobs/JobCard.tsx`
- `src/app/jobs/[id]/page.tsx`

**Cambios en JobCard:**
- Eliminada la sección de contacto (teléfono, email) del listado
- Reemplazada con mensaje: "Información de contacto disponible al ver detalles"
- La info privada ahora solo es visible en la página de detalle

**Cambios en Detalle:**
- Si el usuario NO está autenticado, se muestra un paywall atractivo
- Muestra título y empresa de la vacante como preview
- Lista de beneficios de crear cuenta
- Botones "Crear Cuenta Gratis" y "Ya tengo cuenta"
- Si el usuario SÍ está autenticado, muestra todo el contenido

---

## 4. CAMPO DE IMAGEN EN VACANTES ✅

**Archivos:**
- `supabase/migrations/20250123000004_add_job_image.sql`
- `src/domain/entities/JobPosting.ts`
- `src/application/dto/CreateJobPostingDTO.ts`
- `src/infrastructure/supabase/SupabaseJobPostingRepository.ts`
- `src/components/jobs/JobCard.tsx`
- `src/app/recruiter/jobs/new/page.tsx`

**Cambios en BD:**
- Nuevo campo `image_url TEXT` en `job_postings`
- Nuevo campo `image_status` (pending/approved/rejected/none)
- Bucket de storage `job-images` para Supabase Storage

**Cambios en UI:**
- JobCard muestra imagen prominente (h-48 en móvil, h-56 en desktop)
- Si no hay imagen, muestra placeholder con gradiente y icono
- Formulario de creación con upload de imagen drag-and-drop
- Validación de tamaño (máx 5MB) y tipo (solo imágenes)
- Preview de imagen antes de subir
- Advertencia sobre no incluir info privada en la imagen

**NOTA:** La validación de contenido de imagen (para verificar que no contenga info de contacto) queda para Fase 2.

---

## 5. API DE CÓDIGO POSTAL (SEPOMEX) ✅

**Archivos:**
- `src/app/api/postal-code/route.ts`
- `src/components/ui/PostalCodeInput.tsx`
- `src/app/recruiter/jobs/new/page.tsx`

**API `/api/postal-code?cp=XXXXX`:**
- Integra con API gratuita de COPOMEX/SEPOMEX
- Devuelve: código postal, lista de colonias, municipio, estado, ciudad
- Fallback a datos mock si APIs externas fallan

**Componente PostalCodeInput:**
- Input que detecta automáticamente cuando se ingresan 5 dígitos
- Muestra spinner mientras busca
- Despliega selector de colonia si hay múltiples opciones
- Muestra municipio y estado como solo lectura
- Callback `onAddressChange` para actualizar el formulario padre

**Integración en Formulario:**
- Sección destacada "Ubicación de la Obra (Autocompletado por CP)"
- Autocompleta el campo `worksiteLocation` con la dirección completa

---

## 6. EMAIL DE CONFIRMACIÓN AL PUBLICAR VACANTE ✅

**Archivos:**
- `src/ports/services/INotificationService.ts`
- `src/infrastructure/services/DummyNotificationService.ts`
- `src/app/api/recruiter/jobs/route.ts`

**Cambios:**
- Nueva función `notifyJobPublished()` en la interfaz
- Implementación dummy que hace console.log (para futura integración con email real)
- Se llama automáticamente después de crear una vacante exitosamente

**Para producción:** Implementar `EmailNotificationService` usando Resend, SendGrid, etc.

---

## 7. REGLA DE INACTIVIDAD DE RECLUTADOR ✅

**Archivos:**
- `supabase/migrations/20250123000005_add_recruiter_activity_tracking.sql`
- `src/app/api/cron/check-recruiter-activity/route.ts`
- `vercel.json`

**Regla de Negocio:**
- Si un reclutador NO publica al menos 1 vacante en 30 días:
  - Día 23-29: Recibe notificación de advertencia
  - Día 30+: Su rol cambia automáticamente a `seeker`

**Cambios en BD:**
- `last_job_posted_at`: Fecha de última vacante publicada
- `role_status`: active | warning | expired
- `role_expires_at`: Fecha de expiración del rol
- Trigger automático que actualiza `last_job_posted_at` al crear vacante

**Cron Job:**
- Ruta: `/api/cron/check-recruiter-activity`
- Horario: Diario a las 9:00 AM (configurado en vercel.json)
- Proceso:
  1. Busca reclutadores con 23-29 días sin publicar → envía warning
  2. Busca reclutadores con 30+ días sin publicar → cambia rol a seeker
  3. Envía notificaciones correspondientes

**Seguridad:** 
- El cron valida header `Authorization: Bearer ${CRON_SECRET}`
- En desarrollo permite acceso sin auth para testing

---

## ARCHIVOS CREADOS

```
src/app/api/postal-code/route.ts
src/app/api/cron/check-recruiter-activity/route.ts
src/components/ui/PostalCodeInput.tsx
supabase/migrations/20250123000004_add_job_image.sql
supabase/migrations/20250123000005_add_recruiter_activity_tracking.sql
```

## ARCHIVOS MODIFICADOS

```
src/components/layout/Header.tsx
src/app/auth/register/page.tsx
src/components/jobs/JobCard.tsx
src/app/jobs/[id]/page.tsx
src/app/recruiter/jobs/new/page.tsx
src/app/api/recruiter/jobs/route.ts
src/domain/entities/JobPosting.ts
src/application/dto/CreateJobPostingDTO.ts
src/infrastructure/supabase/SupabaseJobPostingRepository.ts
src/ports/services/INotificationService.ts
src/infrastructure/services/DummyNotificationService.ts
vercel.json
```

---

## CONFIGURACIÓN NECESARIA

### 1. Variables de Entorno (Vercel)
```
SUPABASE_SERVICE_ROLE_KEY=<tu_service_role_key>
CRON_SECRET=<secret_para_proteger_cron>
```

### 2. Supabase Storage
Crear bucket público `job-images`:
```sql
INSERT INTO storage.buckets (id, name, public) 
VALUES ('job-images', 'job-images', true);
```

### 3. Ejecutar Migraciones
```bash
# Desde el dashboard de Supabase o via CLI
supabase db push
```

---

## PENDIENTES PARA FUTURAS ITERACIONES

1. **Validación de contenido de imagen**: Usar AI/ML para detectar si la imagen contiene información de contacto (teléfono, email)

2. **Email real**: Implementar `EmailNotificationService` con Resend o similar para envíos reales

3. **Páginas legales**: Crear contenido real para `/legal/terms` y `/legal/privacy`

4. **Tests**: Agregar tests unitarios para los nuevos use cases y componentes

5. **Optimización de imágenes**: Comprimir/redimensionar imágenes antes de subirlas
