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
