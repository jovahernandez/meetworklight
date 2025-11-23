-- Script para limpiar usuarios de prueba
-- Ejecutar en: Supabase Dashboard > SQL Editor

-- PASO 1: Ver usuarios que se van a eliminar (PREVIEW)
-- Descomentar para ver primero antes de eliminar
/*
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users
WHERE email LIKE '%@gmail.com'
ORDER BY created_at DESC;
*/

-- PASO 2: Eliminar usuarios de Gmail (ACCIÓN DESTRUCTIVA)
-- ⚠️ ADVERTENCIA: Esto eliminará permanentemente los usuarios
-- Descomentar solo cuando estés seguro

-- Primero eliminar de public.users (tabla de aplicación)
DELETE FROM public.users
WHERE email LIKE '%@gmail.com';

-- Luego eliminar de auth.users (autenticación de Supabase)
DELETE FROM auth.users
WHERE email LIKE '%@gmail.com';

-- PASO 3: Verificar eliminación
SELECT 
    COUNT(*) as usuarios_restantes,
    COUNT(CASE WHEN email LIKE '%@gmail.com' THEN 1 END) as gmail_restantes
FROM auth.users;

-- ALTERNATIVA: Eliminar todos los usuarios de prueba (opcional)
-- Descomentar si quieres empezar desde cero
/*
DELETE FROM public.users;
DELETE FROM auth.users;
*/

-- PASO 4: Verificar que todo está limpio
SELECT 
    id,
    email,
    created_at
FROM auth.users
ORDER BY created_at DESC;
