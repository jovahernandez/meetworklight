-- Meetwork Light - CLEAN Migration (Drop and Recreate)
-- Run this to reset the database to a clean state

-- ============================================
-- DROP EXISTING OBJECTS (in correct order)
-- ============================================

-- Drop policies first
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Anyone can view industry sectors" ON public.industry_sectors;
DROP POLICY IF EXISTS "Recruiters can view their own profile" ON public.recruiter_profiles;
DROP POLICY IF EXISTS "Recruiters can create their own profile" ON public.recruiter_profiles;
DROP POLICY IF EXISTS "Recruiters can update their own profile" ON public.recruiter_profiles;
DROP POLICY IF EXISTS "Job seekers can view their own profile" ON public.job_seeker_profiles;
DROP POLICY IF EXISTS "Job seekers can create their own profile" ON public.job_seeker_profiles;
DROP POLICY IF EXISTS "Job seekers can update their own profile" ON public.job_seeker_profiles;
DROP POLICY IF EXISTS "Anyone can view active job postings" ON public.job_postings;
DROP POLICY IF EXISTS "Recruiters can view their own job postings" ON public.job_postings;
DROP POLICY IF EXISTS "Recruiters can create job postings" ON public.job_postings;
DROP POLICY IF EXISTS "Recruiters can update their own job postings" ON public.job_postings;
DROP POLICY IF EXISTS "Recruiters can delete their own job postings" ON public.job_postings;

-- Drop triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_recruiter_profiles_updated_at ON public.recruiter_profiles;
DROP TRIGGER IF EXISTS update_job_seeker_profiles_updated_at ON public.job_seeker_profiles;
DROP TRIGGER IF EXISTS update_job_postings_updated_at ON public.job_postings;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS public.job_postings;
DROP TABLE IF EXISTS public.job_seeker_profiles;
DROP TABLE IF EXISTS public.recruiter_profiles;
DROP TABLE IF EXISTS public.industry_sectors;
DROP TABLE IF EXISTS public.users;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT CHECK (role IN ('recruiter', 'seeker')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" 
  ON public.users FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- ============================================
-- INDUSTRY SECTORS TABLE (catalog)
-- ============================================
CREATE TABLE public.industry_sectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.industry_sectors (name, slug) VALUES
  ('Construcción', 'construccion'),
  ('Logística y Transporte', 'logistica-transporte'),
  ('Manufactura', 'manufactura'),
  ('Energía', 'energia'),
  ('Minería', 'mineria'),
  ('Agricultura y Agroindustria', 'agricultura'),
  ('Petróleo y Gas', 'petroleo-gas'),
  ('Automotriz', 'automotriz'),
  ('Alimentaria', 'alimentaria'),
  ('Química y Farmacéutica', 'quimica-farmaceutica');

ALTER TABLE public.industry_sectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view industry sectors" 
  ON public.industry_sectors FOR SELECT 
  USING (true);

-- ============================================
-- RECRUITER PROFILES TABLE
-- ============================================
CREATE TABLE public.recruiter_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email_contact TEXT NOT NULL,
  location TEXT NOT NULL,
  industrial_sector TEXT NOT NULL,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recruiter_profiles_user_id ON public.recruiter_profiles(user_id);

ALTER TABLE public.recruiter_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiters can view their own profile" 
  ON public.recruiter_profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can create their own profile" 
  ON public.recruiter_profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Recruiters can update their own profile" 
  ON public.recruiter_profiles FOR UPDATE 
  USING (auth.uid() = user_id);

-- ============================================
-- JOB SEEKER PROFILES TABLE
-- ============================================
CREATE TABLE public.job_seeker_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  main_role TEXT NOT NULL,
  years_experience INTEGER NOT NULL DEFAULT 0,
  preferred_sectors TEXT[] NOT NULL DEFAULT '{}',
  location TEXT NOT NULL,
  open_to_relocation BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_job_seeker_profiles_user_id ON public.job_seeker_profiles(user_id);

ALTER TABLE public.job_seeker_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Job seekers can view their own profile" 
  ON public.job_seeker_profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Job seekers can create their own profile" 
  ON public.job_seeker_profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Job seekers can update their own profile" 
  ON public.job_seeker_profiles FOR UPDATE 
  USING (auth.uid() = user_id);

-- ============================================
-- JOB POSTINGS TABLE
-- ============================================
CREATE TABLE public.job_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  location TEXT NOT NULL,
  industrial_sector TEXT NOT NULL,
  job_area TEXT NOT NULL,
  contract_type TEXT NOT NULL CHECK (contract_type IN ('full-time', 'part-time', 'project', 'temporary')),
  modality TEXT NOT NULL CHECK (modality IN ('on-site', 'hybrid', 'remote')),
  salary_range TEXT,
  shift TEXT NOT NULL CHECK (shift IN ('morning', 'afternoon', 'night', 'rotating', 'flexible')),
  description_short TEXT NOT NULL,
  description_long TEXT,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_job_postings_recruiter_id ON public.job_postings(recruiter_id);
CREATE INDEX idx_job_postings_is_active ON public.job_postings(is_active);
CREATE INDEX idx_job_postings_industrial_sector ON public.job_postings(industrial_sector);
CREATE INDEX idx_job_postings_location ON public.job_postings(location);
CREATE INDEX idx_job_postings_created_at ON public.job_postings(created_at DESC);

ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active job postings" 
  ON public.job_postings FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Recruiters can view their own job postings" 
  ON public.job_postings FOR SELECT 
  USING (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can create job postings" 
  ON public.job_postings FOR INSERT 
  WITH CHECK (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can update their own job postings" 
  ON public.job_postings FOR UPDATE 
  USING (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can delete their own job postings" 
  ON public.job_postings FOR DELETE 
  USING (auth.uid() = recruiter_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recruiter_profiles_updated_at BEFORE UPDATE ON public.recruiter_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_seeker_profiles_updated_at BEFORE UPDATE ON public.job_seeker_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON public.job_postings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
