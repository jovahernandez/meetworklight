-- Iteración 6: Agregar campo de imagen a job_postings
-- La imagen es prominente en el sector construcción para mostrar vacantes

-- Agregar columna de imagen URL
ALTER TABLE job_postings 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Agregar columna de estado de revisión de imagen (para validación futura)
ALTER TABLE job_postings 
ADD COLUMN IF NOT EXISTS image_status TEXT DEFAULT 'pending' 
CHECK (image_status IN ('pending', 'approved', 'rejected', 'none'));

-- Comentarios para documentación
COMMENT ON COLUMN job_postings.image_url IS 'URL de la imagen de la vacante almacenada en Supabase Storage';
COMMENT ON COLUMN job_postings.image_status IS 'Estado de revisión de la imagen: pending (en revisión), approved (aprobada), rejected (rechazada), none (sin imagen)';

-- Crear bucket de storage para imágenes de vacantes (si no existe)
-- Nota: Esto se debe ejecutar desde el dashboard de Supabase o via API
-- INSERT INTO storage.buckets (id, name, public) VALUES ('job-images', 'job-images', true);
