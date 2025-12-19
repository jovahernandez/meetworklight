-- Iteración 6: Tracking de actividad de reclutadores
-- Para implementar la regla de que deben publicar al menos 1 vacante/mes

-- Agregar campo de última actividad a recruiter_profiles
ALTER TABLE recruiter_profiles 
ADD COLUMN IF NOT EXISTS last_job_posted_at TIMESTAMP WITH TIME ZONE;

-- Agregar campo de estado de rol (para tracking de inactividad)
ALTER TABLE recruiter_profiles 
ADD COLUMN IF NOT EXISTS role_status TEXT DEFAULT 'active' 
CHECK (role_status IN ('active', 'warning', 'expired'));

-- Agregar campo de fecha de expiración del rol
ALTER TABLE recruiter_profiles 
ADD COLUMN IF NOT EXISTS role_expires_at TIMESTAMP WITH TIME ZONE;

-- Comentarios
COMMENT ON COLUMN recruiter_profiles.last_job_posted_at IS 'Fecha de la última vacante publicada por el reclutador';
COMMENT ON COLUMN recruiter_profiles.role_status IS 'Estado del rol: active (normal), warning (cerca de expirar), expired (pasó a seeker)';
COMMENT ON COLUMN recruiter_profiles.role_expires_at IS 'Fecha en que el rol expira si no publica vacante';

-- Trigger para actualizar last_job_posted_at automáticamente
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

-- Crear trigger si no existe
DROP TRIGGER IF EXISTS trigger_update_recruiter_activity ON job_postings;
CREATE TRIGGER trigger_update_recruiter_activity
AFTER INSERT ON job_postings
FOR EACH ROW
EXECUTE FUNCTION update_recruiter_last_job_posted();

-- Inicializar last_job_posted_at para reclutadores existentes
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
