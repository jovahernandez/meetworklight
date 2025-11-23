-- Migración: Agregar campos de seguridad a job_postings
-- Iteración 2: Datos robustos de empresa, obra y contacto

-- Agregar campos de información de empresa y obra
ALTER TABLE public.job_postings
ADD COLUMN IF NOT EXISTS company_rfc TEXT,
ADD COLUMN IF NOT EXISTS company_location TEXT,
ADD COLUMN IF NOT EXISTS worksite_location TEXT,
ADD COLUMN IF NOT EXISTS worksite_google_maps_url TEXT,
ADD COLUMN IF NOT EXISTS contractor_phone_whatsapp TEXT,
ADD COLUMN IF NOT EXISTS company_phone TEXT,
ADD COLUMN IF NOT EXISTS start_date DATE;

-- Comentarios para documentación
COMMENT ON COLUMN public.job_postings.company_rfc IS 'RFC de la empresa reclutadora (capturado en el momento de crear la vacante)';
COMMENT ON COLUMN public.job_postings.company_location IS 'Ubicación de la empresa (ciudad, estado)';
COMMENT ON COLUMN public.job_postings.worksite_location IS 'Ubicación del sitio de trabajo / obra';
COMMENT ON COLUMN public.job_postings.worksite_google_maps_url IS 'Link de Google Maps del sitio de trabajo (obligatorio excepto para remote)';
COMMENT ON COLUMN public.job_postings.contractor_phone_whatsapp IS 'Teléfono/WhatsApp del contratista o reclutador responsable';
COMMENT ON COLUMN public.job_postings.company_phone IS 'Teléfono de la empresa';
COMMENT ON COLUMN public.job_postings.start_date IS 'Fecha estimada de inicio de actividades';
