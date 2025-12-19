# FASE 2 - PENDIENTES Y MEJORAS FUTURAS

## Fecha de creación: Diciembre 2025
## Sprint: Post-Iteración 6

---

## 🔴 PENDIENTES CRÍTICOS (Alta Prioridad)

### 1. Autenticación con Google OAuth
**Estado:** Código existe pero NO está configurado en Supabase
**Archivos involucrados:**
- `src/app/auth/register/page.tsx` - Botón de Google ya existe
- `src/app/auth/login/page.tsx` - Botón de Google ya existe
- `src/app/auth/callback/route.ts` - Handler de callback existe

**Pasos para completar:**
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear proyecto o usar existente
3. Habilitar Google+ API
4. Crear credenciales OAuth 2.0
5. Configurar URLs autorizadas:
   - Origen: `https://tu-dominio.vercel.app`
   - Redirect: `https://fvqaczvjimslzupfrjrm.supabase.co/auth/v1/callback`
6. Copiar Client ID y Client Secret
7. En Supabase Dashboard → Authentication → Providers → Google
8. Pegar credenciales y habilitar

**Referencia:** Ver archivo `CONFIGURAR_GOOGLE_OAUTH.md`

---

### 2. Variables de Entorno en Vercel
**Estado:** Falta configurar en Vercel Dashboard

**Variables requeridas:**
```
SUPABASE_SERVICE_ROLE_KEY = <obtener de Supabase Dashboard → Settings → API>
CRON_SECRET = <generar string aleatorio seguro, ej: openssl rand -hex 32>
```

**Pasos:**
1. Ir a Vercel Dashboard → tu proyecto → Settings → Environment Variables
2. Agregar ambas variables para Production, Preview y Development
3. Re-deploy para que tomen efecto

---

### 3. Migraciones SQL Pendientes
**Estado:** Archivos creados, NO ejecutados en Supabase

**Ejecutar en Supabase SQL Editor:**

```sql
-- =============================================
-- MIGRACIÓN 1: Campo de imagen para vacantes
-- Archivo: 20250123000004_add_job_image.sql
-- =============================================

ALTER TABLE job_postings 
ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE job_postings 
ADD COLUMN IF NOT EXISTS image_status TEXT DEFAULT 'none' 
CHECK (image_status IN ('pending', 'approved', 'rejected', 'none'));

COMMENT ON COLUMN job_postings.image_url IS 'URL de la imagen de la vacante';
COMMENT ON COLUMN job_postings.image_status IS 'Estado de revisión de la imagen';

-- =============================================
-- MIGRACIÓN 2: Tracking de actividad de reclutadores
-- Archivo: 20250123000005_add_recruiter_activity_tracking.sql
-- =============================================

ALTER TABLE recruiter_profiles 
ADD COLUMN IF NOT EXISTS last_job_posted_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE recruiter_profiles 
ADD COLUMN IF NOT EXISTS role_status TEXT DEFAULT 'active' 
CHECK (role_status IN ('active', 'warning', 'expired'));

ALTER TABLE recruiter_profiles 
ADD COLUMN IF NOT EXISTS role_expires_at TIMESTAMP WITH TIME ZONE;

-- Trigger para actualizar automáticamente last_job_posted_at
CREATE OR REPLACE FUNCTION update_recruiter_last_job_posted()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE recruiter_profiles 
    SET 
        last_job_posted_at = NOW(),
        role_status = 'active',
        role_expires_at = NOW() + INTERVAL '30 days'
    WHERE user_id = NEW.recruiter_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_recruiter_activity ON job_postings;
CREATE TRIGGER trigger_update_recruiter_activity
AFTER INSERT ON job_postings
FOR EACH ROW
EXECUTE FUNCTION update_recruiter_last_job_posted();

-- Inicializar para reclutadores existentes
UPDATE recruiter_profiles rp
SET 
    last_job_posted_at = COALESCE(
        (SELECT MAX(created_at) FROM job_postings WHERE recruiter_id = rp.user_id),
        rp.created_at
    ),
    role_expires_at = COALESCE(
        (SELECT MAX(created_at) FROM job_postings WHERE recruiter_id = rp.user_id),
        rp.created_at
    ) + INTERVAL '30 days'
WHERE last_job_posted_at IS NULL;
```

---

### 4. Bucket de Storage para Imágenes
**Estado:** NO creado

**Pasos en Supabase Dashboard:**
1. Ir a Storage → New Bucket
2. Nombre: `job-images`
3. ✅ Marcar como **Public**
4. Guardar
5. Configurar política RLS para permitir uploads autenticados:

```sql
-- Política para permitir uploads
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'job-images');

-- Política para lectura pública
CREATE POLICY "Allow public read" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'job-images');
```

---

## 🟡 PENDIENTES MEDIANOS (Media Prioridad)

### 5. Servicio de Email Real
**Estado:** Implementación dummy (solo console.log)
**Archivos:**
- `src/infrastructure/services/DummyNotificationService.ts`
- `src/ports/services/INotificationService.ts`

**Para implementar:**
1. Crear cuenta en [Resend](https://resend.com) (gratis 100 emails/día) o SendGrid
2. Obtener API Key
3. Agregar variable de entorno `RESEND_API_KEY`
4. Crear `EmailNotificationService.ts` que implemente `INotificationService`
5. Crear templates de email para:
   - Vacante publicada exitosamente
   - Rol de reclutador por expirar (7 días)
   - Rol de reclutador expirado

**Emails a enviar:**
- `notifyJobPublished()` - "Tu vacante ha sido publicada"
- `notifyRecruiterRoleExpiring()` - "Tu rol de reclutador expira en X días"
- `notifyRecruiterRoleExpired()` - "Tu rol de reclutador ha expirado"
- `notifyJobExpiringSoon()` - "Tu vacante expira en X días"
- `notifyJobExpired()` - "Tu vacante ha expirado"

---

### 6. Validación de Contenido de Imágenes
**Estado:** NO implementado (solo se marca como 'pending')
**Problema:** Las imágenes pueden contener teléfonos/emails visibles

**Opciones de implementación:**

**Opción A - Manual (Recomendado para MVP):**
1. Crear panel de admin en `/admin/images`
2. Listar imágenes con status 'pending'
3. Botones para aprobar/rechazar
4. Solo mostrar imágenes 'approved' en el listado público

**Opción B - Automático con AI (Fase 3):**
1. Integrar AWS Rekognition o Google Vision
2. Detectar texto en imagen (OCR)
3. Buscar patrones de teléfono/email
4. Auto-rechazar si encuentra datos de contacto

---

### 7. Páginas Legales
**Estado:** Rutas existen pero sin contenido
**Archivos a crear:**
- `src/app/legal/terms/page.tsx` - Términos y Condiciones
- `src/app/legal/privacy/page.tsx` - Política de Privacidad

**Contenido necesario:**
- Términos de uso de la plataforma
- Política de privacidad y manejo de datos
- Política de cookies (si aplica)
- Aviso de uso de datos para KYC

---

## 🟢 MEJORAS OPCIONALES (Baja Prioridad)

### 8. Autenticación con Otras Redes Sociales
**Estado:** Solo Google implementado
**Posibles integraciones:**
- Facebook/Meta
- LinkedIn (ideal para plataforma de empleo)
- Apple Sign In

**Nota:** Cada proveedor requiere crear app en su developer console.

---

### 9. Optimización de Imágenes
**Estado:** Se suben sin procesar
**Mejoras:**
- Comprimir imágenes antes de subir (client-side)
- Redimensionar a tamaño máximo (ej: 1200px)
- Convertir a WebP para mejor rendimiento
- Generar thumbnails automáticos

**Librerías sugeridas:**
- `browser-image-compression` para compresión client-side
- Supabase Image Transformation (si está habilitado)

---

### 10. Tests Unitarios
**Estado:** Estructura existe pero tests mínimos
**Archivos:**
- `tests/unit/use-cases/`
- `vitest.config.ts` ya configurado

**Tests prioritarios:**
- CreateJobPosting use case
- Validación de términos en registro
- Lógica de expiración de rol de reclutador

---

### 11. Panel de Administración
**Estado:** NO existe
**Funcionalidades sugeridas:**
- Dashboard con métricas (usuarios, vacantes, etc.)
- Gestión de usuarios (cambiar roles, suspender)
- Moderación de imágenes de vacantes
- Ver logs de actividad

---

## 📊 RESUMEN EJECUTIVO

| # | Pendiente | Prioridad | Esfuerzo | Impacto |
|---|-----------|-----------|----------|---------|
| 1 | Google OAuth config | 🔴 Alta | 30 min | Alto |
| 2 | Variables Vercel | 🔴 Alta | 5 min | Crítico |
| 3 | Migraciones SQL | 🔴 Alta | 10 min | Crítico |
| 4 | Bucket Storage | 🔴 Alta | 10 min | Alto |
| 5 | Email real | 🟡 Media | 2-4 hrs | Medio |
| 6 | Validación imágenes | 🟡 Media | 4-8 hrs | Medio |
| 7 | Páginas legales | 🟡 Media | 2-4 hrs | Medio |
| 8 | Otras redes sociales | 🟢 Baja | 2 hrs c/u | Bajo |
| 9 | Optimización imágenes | 🟢 Baja | 2-3 hrs | Bajo |
| 10 | Tests unitarios | 🟢 Baja | 4-8 hrs | Medio |
| 11 | Panel admin | 🟢 Baja | 8-16 hrs | Medio |

---

## ✅ CHECKLIST ANTES DE LANZAR A USUARIOS REALES

- [ ] Configurar Google OAuth en Supabase
- [ ] Agregar variables de entorno en Vercel
- [ ] Ejecutar migraciones SQL
- [ ] Crear bucket `job-images` en Storage
- [ ] Crear contenido para páginas legales
- [ ] Probar flujo completo de registro → crear vacante → ver vacante
- [ ] Verificar que el cron de inactividad funciona (probar manualmente)

---

## 🚀 ESTADO ACTUAL DEL DEPLOY

**Commit desplegado:** `f50e2ec`
**Fecha:** Diciembre 19, 2025
**Branch:** main
**URL Vercel:** [Ver en dashboard de Vercel]

El deploy se ejecuta automáticamente con cada push a main.
