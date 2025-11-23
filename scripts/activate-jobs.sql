-- Script para activar todas las vacantes inactivas
-- Ejecutar en Supabase SQL Editor

-- Ver el estado actual de TODAS las vacantes
SELECT id, title, company_name, status, created_at 
FROM public.job_postings 
ORDER BY created_at DESC;

-- Ver cuántas vacantes están inactivas
SELECT COUNT(*) as vacantes_inactivas 
FROM public.job_postings 
WHERE status != 'active';

-- Actualizar TODAS las vacantes para que estén activas
UPDATE public.job_postings 
SET status = 'active' 
WHERE status IS NULL OR status != 'active';

-- Verificar que TODAS estén activas ahora
SELECT id, title, company_name, status, created_at 
FROM public.job_postings 
ORDER BY created_at DESC;
