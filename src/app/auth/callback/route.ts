// Iteración 5: Callback para OAuth (Google)
// Este endpoint procesa el redirect después de autenticación con Google

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Forzar dynamic rendering (evita problemas de Vercel auth)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SUPABASE_URL = 'https://fvqaczvjimslzupfrjrm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2cWFjenZqaW1zbHp1cGZyanJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMzI2NTQsImV4cCI6MjA3ODgwODY1NH0.2rG53jx_dKGf61mykgUdMzS1VsxZKI1wWa2QvlwPSv4'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    // Si no hay code, redirigir a login
    if (!code) {
        console.error('[OAuth Callback] No code provided in query string')
        return NextResponse.redirect(new URL('/auth/login?error=no_code', request.url))
    }

    try {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // Server component: ignore
                        }
                    },
                },
            }
        )

        // Intercambiar code por sesión
        const { data: { user }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
            console.error('[OAuth Callback] Error al intercambiar código:', exchangeError)
            return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url))
        }

        if (!user) {
            console.error('[OAuth Callback] No user returned after exchange')
            return NextResponse.redirect(new URL('/auth/login?error=no_user', request.url))
        }

        // Usuario autenticado exitosamente
        console.log(`[OAuth Callback] Usuario autenticado: ${user.email}`)

        // Verificar si el usuario ya existe en tabla public.users
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('id, role, terms_accepted')
            .eq('id', user.id)
            .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
            // Error diferente a "not found"
            console.error('[OAuth Callback] Error al buscar usuario:', fetchError)
            // Continuar de todos modos, intentaremos crear el usuario
        }

        if (!existingUser) {
            // Usuario nuevo: crear registro en tabla users
            console.log(`[OAuth Callback] Creando nuevo usuario en public.users: ${user.email}`)

            const { error: insertError } = await supabase
                .from('users')
                .insert({
                    id: user.id,
                    email: user.email!,
                    role: null, // Se asignará en /auth/choose-role
                })

            if (insertError) {
                // Solo loguear si no es error de duplicado (race condition)
                if (!insertError.message.includes('duplicate') && !insertError.code?.includes('23505')) {
                    console.error('[OAuth Callback] Error al crear usuario:', insertError)
                }
            }
        }

        // Obtener estado actualizado del usuario
        const { data: userData, error: userDataError } = await supabase
            .from('users')
            .select('role, terms_accepted')
            .eq('id', user.id)
            .single()

        if (userDataError) {
            console.error('[OAuth Callback] Error al obtener datos de usuario:', userDataError)
            // Si no podemos obtener los datos, asumimos que necesita onboarding completo
            return NextResponse.redirect(new URL('/auth/choose-role', request.url))
        }

        // Flujo de redirección según estado del usuario
        if (!userData?.role) {
            // No tiene rol → elegir rol
            console.log('[OAuth Callback] Usuario sin rol, redirigiendo a choose-role')
            return NextResponse.redirect(new URL('/auth/choose-role', request.url))
        } else if (!userData.terms_accepted) {
            // Tiene rol pero no ha aceptado términos
            // CORRECCIÓN: usar /legal/terms-acceptance, NO /auth/terms
            console.log('[OAuth Callback] Usuario sin términos aceptados, redirigiendo a terms-acceptance')
            return NextResponse.redirect(new URL('/legal/terms-acceptance', request.url))
        } else {
            // Tiene rol + términos
            // El middleware verificará si tiene perfil y redirigirá si es necesario
            console.log('[OAuth Callback] Usuario con onboarding completo, redirigiendo a jobs')
            return NextResponse.redirect(new URL('/jobs', request.url))
        }
    } catch (error) {
        console.error('[OAuth Callback] Error inesperado:', error)
        return NextResponse.redirect(new URL('/auth/login?error=server_error', request.url))
    }
}
