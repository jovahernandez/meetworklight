# Deployment - Iteración 1: KYC y Términos

## PASO 1: Ejecutar Migraciones en Supabase

1. Ir al SQL Editor de Supabase: https://supabase.com/dashboard/project/fvqaczvjimslzupfrjrm/sql/new

2. Ejecutar la PRIMERA migración:
```sql
-- Migración: Agregar campos de KYC y Términos
-- Iteración 1: Documentación civil y responsiva

-- Agregar campos de términos a la tabla users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS terms_version TEXT;

-- Agregar campos de KYC a recruiter_profiles
ALTER TABLE public.recruiter_profiles
ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS metamap_session_id TEXT,
ADD COLUMN IF NOT EXISTS kyc_verified_at TIMESTAMPTZ;

-- Agregar campos de KYC a job_seeker_profiles
ALTER TABLE public.job_seeker_profiles
ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS metamap_session_id TEXT,
ADD COLUMN IF NOT EXISTS kyc_verified_at TIMESTAMPTZ;

-- Crear índices para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_users_terms_accepted ON public.users(terms_accepted);
CREATE INDEX IF NOT EXISTS idx_recruiter_kyc_status ON public.recruiter_profiles(kyc_status);
CREATE INDEX IF NOT EXISTS idx_seeker_kyc_status ON public.job_seeker_profiles(kyc_status);

-- Comentarios para documentación
COMMENT ON COLUMN public.users.terms_accepted IS 'Indica si el usuario aceptó los términos y condiciones';
COMMENT ON COLUMN public.users.terms_version IS 'Versión de los términos aceptados (ej: v1, v2)';
COMMENT ON COLUMN public.recruiter_profiles.kyc_status IS 'Estado de verificación de identidad: pending, verified, rejected';
COMMENT ON COLUMN public.recruiter_profiles.metamap_session_id IS 'ID de sesión de MetaMap para rastrear verificación';
COMMENT ON COLUMN public.job_seeker_profiles.kyc_status IS 'Estado de verificación de identidad: pending, verified, rejected';
COMMENT ON COLUMN public.job_seeker_profiles.metamap_session_id IS 'ID de sesión de MetaMap para rastrear verificación';
```

3. Ejecutar la SEGUNDA migración:
```sql
-- Migración: Reconciliar campos de RecruiterProfile
-- Asegurar que todos los campos del dominio existen en la tabla

-- Campos fiscales/legales que podrían no existir
ALTER TABLE public.recruiter_profiles
ADD COLUMN IF NOT EXISTS company_rfc TEXT,
ADD COLUMN IF NOT EXISTS legal_representative TEXT,
ADD COLUMN IF NOT EXISTS acta_constitutiva TEXT;

-- Asegurar que campos básicos existen (deberían ya estar, pero por seguridad)
ALTER TABLE public.recruiter_profiles
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS contact_name TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website TEXT;

-- Comentarios para documentación
COMMENT ON COLUMN public.recruiter_profiles.company_rfc IS 'RFC de la empresa reclutadora';
COMMENT ON COLUMN public.recruiter_profiles.legal_representative IS 'Nombre del representante legal';
COMMENT ON COLUMN public.recruiter_profiles.acta_constitutiva IS 'Número de acta constitutiva o documento D2';
```

4. Verificar que se ejecutaron correctamente:
```sql
-- Verificar columnas de users
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('terms_accepted', 'terms_accepted_at', 'terms_version');

-- Verificar columnas de recruiter_profiles
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'recruiter_profiles' 
AND column_name IN ('kyc_status', 'metamap_session_id', 'kyc_verified_at', 'company_rfc');

-- Verificar columnas de job_seeker_profiles
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'job_seeker_profiles' 
AND column_name IN ('kyc_status', 'metamap_session_id', 'kyc_verified_at');
```

## PASO 2: Configurar Variables de Entorno en Vercel

1. Ir a: https://vercel.com/jovanigits-projects/meetwork-ligh/settings/environment-variables

2. Agregar las siguientes variables (para stub mode):
   - `METAMAP_API_KEY` = `stub_mode`
   - `METAMAP_FLOW_ID_RECRUITER` = `flow_recruiter_stub`
   - `METAMAP_FLOW_ID_SEEKER` = `flow_seeker_stub`

## PASO 3: Deploy a Vercel

Ejecutar en terminal:
```bash
cd "c:\Users\jovan\Desktop\meetwork ligh"
vercel --prod
```

## PASO 4: Pruebas en Producción

### A) Flujo de Términos
1. Crear usuario nuevo en producción
2. Verificar redirect automático a `/legal/terms-acceptance`
3. Leer términos y marcar checkbox
4. Click en "Aceptar y Continuar"
5. Verificar en Supabase:
```sql
SELECT id, email, terms_accepted, terms_accepted_at, terms_version
FROM users
WHERE email = 'tu_email_de_prueba@test.com';
```
Debe mostrar `terms_accepted = true`, timestamp y `terms_version = 'v1'`

### B) Flujo KYC Recruiter
1. Crear perfil de reclutador
2. Verificar que aparece card "Verificación de Identidad" con badge "Pendiente"
3. Click en "Iniciar Verificación de Identidad"
4. Verificar que se abre nueva ventana (stub URL)
5. Verificar en Supabase:
```sql
SELECT user_id, kyc_status, metamap_session_id, kyc_verified_at
FROM recruiter_profiles
WHERE user_id = 'tu_user_id';
```
Debe mostrar `kyc_status = 'pending'` y `metamap_session_id` con valor

### C) Flujo KYC Seeker
1. Crear perfil de buscador
2. Repetir pasos del flujo recruiter
3. Verificar en tabla `job_seeker_profiles`

## Notas Importantes

- Las migraciones usan `IF NOT EXISTS` para ser seguras
- KYC en modo stub NO bloquea funcionalidad
- Términos SÍ son obligatorios para acceder a rutas privadas
- Variables de entorno con valores "stub" permiten desarrollo sin MetaMap real
