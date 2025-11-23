-- DIAGNÓSTICO COMPLETO - Ejecutar TODO en Supabase SQL Editor
-- Copia y pega todo de una vez

-- Parte 1: Ver la política actual
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'job_postings' 
  AND policyname = 'Anyone can view active job postings';

-- Parte 2: Intentar eliminar TODAS las políticas de SELECT
DROP POLICY IF EXISTS "Anyone can view active job postings" ON public.job_postings;

-- Parte 3: Crear la política correcta
CREATE POLICY "Anyone can view active job postings" 
  ON public.job_postings FOR SELECT 
  USING (status = 'active');

-- Parte 4: Verificar que quedó bien
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'job_postings';

-- Parte 5: Probar directamente si funciona
-- Esta query simula lo que hace el API (sin autenticación)
SET LOCAL ROLE anon;
SELECT COUNT(*) as vacantes_visibles_como_anonimo
FROM public.job_postings;
RESET ROLE;

-- Parte 6: Como usuario autenticado (todos deberían verse)
SELECT COUNT(*) as total_en_db
FROM public.job_postings 
WHERE status = 'active';
