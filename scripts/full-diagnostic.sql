-- Script de verificación completa del problema RLS
-- Ejecutar línea por línea en Supabase SQL Editor

-- 1. Ver las políticas actuales
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'job_postings'
ORDER BY policyname;

-- 2. Ver si la columna is_active todavía existe
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'job_postings'
  AND column_name IN ('is_active', 'status');

-- 3. Ver cuántas vacantes deberían ser visibles
SELECT 
    id,
    title,
    company_name,
    industrial_sector,
    status,
    CASE 
        WHEN status = 'active' THEN 'Debería verse'
        ELSE 'NO debería verse'
    END as visibilidad
FROM public.job_postings 
ORDER BY created_at DESC;
