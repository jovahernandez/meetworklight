-- Migración: Cambiar de 'status' a 'is_active' + agregar campos de vigencia
-- Iteración 3.1: Sistema de vigencia de vacantes

-- PASO 1: Agregar nueva columna is_active (BOOLEAN)
ALTER TABLE job_postings 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- PASO 2: Migrar datos de 'status' a 'is_active'
-- status 'active' -> is_active = true
-- status 'inactive', 'closed', etc. -> is_active = false
UPDATE job_postings 
SET is_active = CASE 
    WHEN status = 'active' THEN true 
    ELSE false 
END
WHERE is_active IS NULL;

-- PASO 3: Agregar campos de vigencia
ALTER TABLE job_postings
ADD COLUMN IF NOT EXISTS validity_days INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- PASO 4: Calcular expires_at para vacantes existentes
-- Vacantes activas sin expires_at: darles 30 días desde hoy
UPDATE job_postings
SET expires_at = NOW() + INTERVAL '30 days',
    validity_days = 30
WHERE is_active = true 
  AND expires_at IS NULL;

-- PASO 5: Eliminar columna 'status' antigua (opcional, comentado por seguridad)
-- ALTER TABLE job_postings DROP COLUMN IF EXISTS status;

-- PASO 6: Crear índice para mejorar performance en queries de vacantes activas
CREATE INDEX IF NOT EXISTS idx_job_postings_active_expires 
ON job_postings(is_active, expires_at) 
WHERE is_active = true;

-- PASO 7: Verificar migración
SELECT 
    COUNT(*) as total,
    COUNT(CASE WHEN is_active = true THEN 1 END) as activas,
    COUNT(CASE WHEN is_active = false THEN 1 END) as inactivas,
    COUNT(CASE WHEN expires_at IS NOT NULL THEN 1 END) as con_expiracion
FROM job_postings;
