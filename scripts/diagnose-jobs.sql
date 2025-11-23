-- Query de diagnóstico completo
-- Ejecutar en Supabase SQL Editor para ver el estado real de las vacantes

SELECT 
    id,
    title,
    company_name,
    recruiter_id,
    status,
    created_at,
    CASE 
        WHEN status = 'active' THEN '✅ ACTIVA - Debería verse en /jobs'
        WHEN status IS NULL THEN '❌ NULL - Necesita actualizarse'
        ELSE '❌ INACTIVA - No se verá en /jobs'
    END as diagnostico
FROM public.job_postings 
ORDER BY created_at DESC;
