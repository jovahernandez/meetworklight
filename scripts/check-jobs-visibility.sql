-- Verificar estado de las vacantes en la base de datos

-- 1. Ver todas las vacantes
SELECT 
    id,
    title,
    company_name,
    is_active,
    expires_at,
    created_at,
    CASE 
        WHEN expires_at IS NULL THEN 'Sin fecha de expiración'
        WHEN expires_at < NOW() THEN 'EXPIRADA'
        ELSE 'VIGENTE'
    END as estado
FROM job_postings
ORDER BY created_at DESC;

-- 2. Contar vacantes por estado
SELECT 
    is_active,
    COUNT(*) as cantidad,
    COUNT(CASE WHEN expires_at IS NULL OR expires_at >= NOW() THEN 1 END) as vigentes,
    COUNT(CASE WHEN expires_at < NOW() THEN 1 END) as expiradas
FROM job_postings
GROUP BY is_active;

-- 3. Ver vacantes que deberían mostrarse (activas y vigentes)
SELECT 
    id,
    title,
    company_name,
    location,
    is_active,
    expires_at,
    created_at
FROM job_postings
WHERE is_active = true 
  AND (expires_at IS NULL OR expires_at >= NOW())
ORDER BY created_at DESC;

-- 4. Si no hay vacantes, crear una de prueba
-- Descomentar para crear vacante de prueba
/*
INSERT INTO job_postings (
    recruiter_id,
    title,
    company_name,
    location,
    industrial_sector,
    job_area,
    contract_type,
    modality,
    shift,
    description_short,
    contact_phone,
    contact_email,
    company_rfc,
    company_location,
    worksite_location,
    contractor_phone_whatsapp,
    company_phone,
    start_date,
    validity_days,
    expires_at,
    is_active
) VALUES (
    (SELECT id FROM users WHERE role = 'recruiter' LIMIT 1), -- Toma el primer recruiter
    'Ingeniero Civil - Obra Monterrey',
    'Constructora ABC',
    'Monterrey, Nuevo León',
    'Construcción',
    'Ingeniería',
    'full-time',
    'on-site',
    'morning',
    'Se busca ingeniero civil con experiencia en obra civil. Proyecto de construcción de edificio comercial.',
    '8112345678',
    'rh@constructoraabc.com',
    'CAB850101ABC',
    'Av. Constitución 100, Monterrey',
    'Av. Constitución 100, Monterrey',
    '8112345678',
    '8187654321',
    NOW(),
    30,
    NOW() + INTERVAL '30 days',
    true
);
*/
