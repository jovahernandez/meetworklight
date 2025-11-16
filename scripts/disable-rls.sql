-- Script para crear tabla seeker_profiles y deshabilitar RLS
-- Ejecutar en Supabase SQL Editor

-- Crear tabla seeker_profiles si no existe
CREATE TABLE IF NOT EXISTS public.seeker_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT NOT NULL,
    preferred_sector TEXT NOT NULL,
    experience_level TEXT NOT NULL,
    skills TEXT NOT NULL,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deshabilitar RLS en tabla users
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Deshabilitar RLS en tabla recruiter_profiles
ALTER TABLE public.recruiter_profiles DISABLE ROW LEVEL SECURITY;

-- Deshabilitar RLS en tabla seeker_profiles
ALTER TABLE public.seeker_profiles DISABLE ROW LEVEL SECURITY;

-- Deshabilitar RLS en tabla job_postings
ALTER TABLE public.job_postings DISABLE ROW LEVEL SECURITY;

-- Verificar estado de RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'recruiter_profiles', 'seeker_profiles', 'job_postings');
