import { createBrowserClient } from '@supabase/ssr'

// Valores directamente hardcodeados - sin variables de entorno
const SUPABASE_URL = 'https://fvqaczvjimslzupfrjrm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2cWFjenZqaW1zbHp1cGZyanJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMzI2NTQsImV4cCI6MjA3ODgwODY1NH0.2rG53jx_dKGf61mykgUdMzS1VsxZKI1wWa2QvlwPSv4'

console.log('🔍 Supabase Client Debug:', {
    url: SUPABASE_URL,
    keyLength: SUPABASE_ANON_KEY.length,
    keyStart: SUPABASE_ANON_KEY.substring(0, 30) + '...',
    keyEnd: '...' + SUPABASE_ANON_KEY.substring(SUPABASE_ANON_KEY.length - 10)
})

export function createClient() {
    const client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    console.log('✅ Cliente de Supabase creado')
    return client
}
