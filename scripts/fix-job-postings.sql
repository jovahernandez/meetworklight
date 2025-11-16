-- Script para arreglar restricciones de job_postings
-- Ejecutar en Supabase SQL Editor

-- Eliminar políticas RLS que dependen de is_active
DROP POLICY IF EXISTS "Anyone can view active job postings" ON public.job_postings;

-- Eliminar restricciones antiguas
ALTER TABLE public.job_postings 
  DROP CONSTRAINT IF EXISTS job_postings_contract_type_check;

ALTER TABLE public.job_postings 
  DROP CONSTRAINT IF EXISTS job_postings_modality_check;

ALTER TABLE public.job_postings 
  DROP CONSTRAINT IF EXISTS job_postings_shift_check;

-- Agregar nuevas restricciones con valores en español
ALTER TABLE public.job_postings 
  ADD CONSTRAINT job_postings_contract_type_check 
  CHECK (contract_type IN ('Tiempo Completo', 'Medio Tiempo', 'Por Proyecto', 'Temporal', 'Prácticas'));

ALTER TABLE public.job_postings 
  ADD CONSTRAINT job_postings_modality_check 
  CHECK (modality IN ('Presencial', 'Remoto', 'Híbrido'));

ALTER TABLE public.job_postings 
  ADD CONSTRAINT job_postings_shift_check 
  CHECK (shift IN ('Diurno', 'Nocturno', 'Mixto', 'Rotativo'));

-- Cambiar is_active por status para ser más flexible
ALTER TABLE public.job_postings 
  DROP COLUMN IF EXISTS is_active;

ALTER TABLE public.job_postings 
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' 
  CHECK (status IN ('active', 'inactive', 'closed'));

-- Recrear política RLS con status
CREATE POLICY "Anyone can view active job postings" 
  ON public.job_postings FOR SELECT 
  USING (status = 'active');

-- Actualizar índice
DROP INDEX IF EXISTS idx_job_postings_is_active;
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON public.job_postings(status);

-- Verificar estructura final
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'job_postings'
ORDER BY ordinal_position;
