-- Ver las políticas RLS actuales de job_postings
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'job_postings';

-- Temporalmente deshabilitar RLS para probar (SOLO PARA DEBUG)
-- NO EJECUTAR EN PRODUCCIÓN A LARGO PLAZO
-- ALTER TABLE public.job_postings DISABLE ROW LEVEL SECURITY;

-- Si quieres probar sin RLS, usa esta query:
-- SELECT COUNT(*) FROM public.job_postings WHERE status = 'active';
