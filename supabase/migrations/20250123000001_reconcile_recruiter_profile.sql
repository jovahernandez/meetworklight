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
