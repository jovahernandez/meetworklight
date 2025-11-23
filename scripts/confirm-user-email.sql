-- Script para confirmar manualmente el email de un usuario
-- Ejecutar en: Supabase Dashboard > SQL Editor

-- 1. Ver usuarios sin confirmar
SELECT 
    id,
    email,
    email_confirmed_at,
    confirmed_at,
    created_at
FROM auth.users
WHERE email_confirmed_at IS NULL
ORDER BY created_at DESC;

-- 2. Confirmar un usuario específico (reemplaza 'tu-email@example.com')
UPDATE auth.users
SET 
    email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = 'tu-email@example.com';

-- 3. Verificar que se confirmó
SELECT 
    email,
    email_confirmed_at,
    confirmed_at
FROM auth.users
WHERE email = 'tu-email@example.com';
