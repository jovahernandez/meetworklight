-- Script para arreglar las políticas RLS de job_postings
-- Este es el problema principal: las políticas usan is_active pero el campo es status
-- Ejecutar en Supabase SQL Editor

-- 1. Eliminar la política antigua que usa is_active
DROP POLICY IF EXISTS "Anyone can view active job postings" ON public.job_postings;

-- 2. Crear nueva política que usa status
CREATE POLICY "Anyone can view active job postings" 
  ON public.job_postings FOR SELECT 
  USING (status = 'active');

-- 3. Verificar que la política se creó correctamente
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'job_postings' 
  AND policyname = 'Anyone can view active job postings';

-- 4. Probar que ahora sí se pueden ver las vacantes
SELECT COUNT(*) as total_vacantes_visibles
FROM public.job_postings 
WHERE status = 'active';
