'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SUPABASE_URL = 'https://fvqaczvjimslzupfrjrm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2cWFjenZqaW1zbHp1cGZyanJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMzI2NTQsImV4cCI6MjA3ODgwODY1NH0.2rG53jx_dKGf61mykgUdMzS1VsxZKI1wWa2QvlwPSv4'

export async function signUp(formData: FormData) {
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
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    // Iteración 5: Redirigir a check-email en lugar de choose-role
    redirect('/auth/check-email')
}
