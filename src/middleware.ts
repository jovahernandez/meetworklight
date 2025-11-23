import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Valores hardcodeados para Vercel
const SUPABASE_URL = 'https://fvqaczvjimslzupfrjrm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2cWFjenZqaW1zbHp1cGZyanJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMzI2NTQsImV4cCI6MjA3ODgwODY1NH0.2rG53jx_dKGf61mykgUdMzS1VsxZKI1wWa2QvlwPSv4'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    try {
        const supabase = createServerClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                        supabaseResponse = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )

        const {
            data: { user },
        } = await supabase.auth.getUser()

        const path = request.nextUrl.pathname

        // Public routes - always accessible
        const publicRoutes = ['/', '/jobs', '/auth/login', '/auth/register', '/auth/check-email'] // Iteración 5: agregada check-email

        // Routes exempt from terms check
        const termsExemptRoutes = [
            '/legal/terms-acceptance',
            '/auth/logout',
            '/api/legal/accept-terms',
            '/auth/choose-role',
            '/recruiter/profile/create',
            '/seeker/profile/create',
            '/auth/check-email', // Iteración 5
            '/auth/callback', // Iteración 5: OAuth callback
        ]

        // API routes that don't need middleware (except specific ones)
        if (path.startsWith('/api/') && !path.startsWith('/api/kyc/') && !path.startsWith('/api/legal/')) {
            return supabaseResponse
        }

        if (publicRoutes.includes(path)) {
            return supabaseResponse
        }

        // If not authenticated, redirect to login
        if (!user && !path.startsWith('/auth')) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }

        // If authenticated, check onboarding status
        if (user) {
            // Iteración 5: Verificar email confirmado (gating básico)
            // OAuth (Google) confirma email automáticamente, pero email+password requiere confirmación
            const emailConfirmed = user.email_confirmed_at || user.confirmed_at

            // Rutas permitidas sin confirmación de email
            const emailConfirmationExemptRoutes = [
                '/auth/check-email',
                '/auth/logout',
                '/auth/callback',
            ]

            const isEmailExempt = emailConfirmationExemptRoutes.some(route => path.startsWith(route))

            // Si el email NO está confirmado y no está en ruta exenta, redirigir a check-email
            if (!emailConfirmed && !isEmailExempt) {
                return NextResponse.redirect(new URL('/auth/check-email', request.url))
            }

            // OPTIMIZACIÓN: Una sola query para obtener role y terms_accepted
            const { data: userData } = await supabase
                .from('users')
                .select('role, terms_accepted')
                .eq('id', user.id)
                .single()

            const userRole = userData?.role
            const termsAccepted = userData?.terms_accepted

            // If no role, redirect to choose-role (except if already there)
            if (!userRole && path !== '/auth/choose-role') {
                return NextResponse.redirect(new URL('/auth/choose-role', request.url))
            }

            // Verificar aceptación de términos SOLO si ya tiene rol (excepto en rutas exentas)
            const needsTermsCheck = !termsExemptRoutes.some(route => path.startsWith(route))

            if (userRole && needsTermsCheck && !termsAccepted) {
                return NextResponse.redirect(new URL('/legal/terms-acceptance', request.url))
            }

            // IMPORTANTE: Solo verificar perfiles si ya aceptó términos
            // Esto evita loops de redirección
            if (!termsAccepted) {
                return supabaseResponse
            }

            // If has role and accepted terms, check if profile is complete
            if (userRole === 'recruiter') {
                const { data: profile } = await supabase
                    .from('recruiter_profiles')
                    .select('id')
                    .eq('user_id', user.id)
                    .single()

                // If no profile and not on profile creation page, redirect to create profile
                if (!profile && path !== '/recruiter/profile/create' && path !== '/auth/choose-role' && path !== '/auth/change-role') {
                    return NextResponse.redirect(new URL('/recruiter/profile/create', request.url))
                }

                // Si es reclutador pero intenta acceder a rutas de buscador
                // EXCEPTO la página de creación de perfil (para poder crear perfil de buscador)
                if (path.startsWith('/seeker/') && path !== '/seeker/profile/create') {
                    return NextResponse.redirect(new URL('/recruiter/dashboard', request.url))
                }
            } else if (userRole === 'seeker') {
                const { data: profile } = await supabase
                    .from('seeker_profiles')
                    .select('id')
                    .eq('user_id', user.id)
                    .single()

                // If no profile and not on profile creation page, redirect to create profile
                if (!profile && path !== '/seeker/profile/create' && path !== '/auth/choose-role' && path !== '/auth/change-role') {
                    return NextResponse.redirect(new URL('/seeker/profile/create', request.url))
                }

                // Si es buscador pero intenta acceder a rutas de reclutador
                // EXCEPTO la página de creación de perfil (para poder crear perfil de reclutador)
                if (path.startsWith('/recruiter/') && path !== '/recruiter/profile/create') {
                    return NextResponse.redirect(new URL('/jobs', request.url))
                }
            }
        }

        return supabaseResponse
    } catch (error) {
        console.error('Middleware error:', error)
        // Return response even on error to prevent blocking the app
        return NextResponse.next({
            request,
        })
    }
} export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
