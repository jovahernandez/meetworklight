import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
    const publicRoutes = ['/', '/jobs', '/auth/login', '/auth/register']
    if (publicRoutes.includes(path) || path.startsWith('/api/')) {
        return supabaseResponse
    }

    // If not authenticated, redirect to login
    if (!user && !path.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // If authenticated, check onboarding status
    if (user) {
        // Get user role from database
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        const userRole = userData?.role

        // If no role, redirect to choose-role (except if already there)
        if (!userRole && path !== '/auth/choose-role') {
            return NextResponse.redirect(new URL('/auth/choose-role', request.url))
        }

        // If has role, check if profile is complete
        if (userRole === 'recruiter') {
            const { data: profile } = await supabase
                .from('recruiter_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single()

            // If no profile and not on profile creation page, redirect to create profile
            if (!profile && path !== '/recruiter/profile/create' && path !== '/auth/choose-role') {
                return NextResponse.redirect(new URL('/recruiter/profile/create', request.url))
            }
        } else if (userRole === 'seeker') {
            const { data: profile } = await supabase
                .from('seeker_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single()

            // If no profile and not on profile creation page, redirect to create profile
            if (!profile && path !== '/seeker/profile/create' && path !== '/auth/choose-role') {
                return NextResponse.redirect(new URL('/seeker/profile/create', request.url))
            }
        }
    }

    return supabaseResponse
}

export const config = {
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
