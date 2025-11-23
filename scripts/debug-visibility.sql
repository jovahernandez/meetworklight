-- Script para verificar el problema de visibilidad de vacantes
-- Ejecutar en Supabase SQL Editor

-- 1. Ver TODAS las vacantes en la tabla (sin RLS)
SELECT 
    id,
    title,
    company_name,
    industrial_sector,
    status,
    recruiter_id,
    created_at
FROM public.job_postings 
ORDER BY created_at DESC;

-- 2. Ver cuántas vacantes hay por sector
SELECT 
    industrial_sector,
    COUNT(*) as cantidad,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as activas
FROM public.job_postings 
GROUP BY industrial_sector;

-- 3. Ver específicamente las vacantes de Construcción
SELECT 
    id,
    title,
    company_name,
    industrial_sector,
    status,
    created_at
FROM public.job_postings 
WHERE industrial_sector = 'Construcción'
ORDER BY created_at DESC;

-- 4. Verificar las políticas RLS activas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'job_postings';
