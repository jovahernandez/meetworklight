'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        // Obtener usuario actual
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            setLoading(false);
        });

        // Escuchar cambios en la sesión
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        router.push('/');
        router.refresh();
    };

    return (
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="text-2xl font-heading font-bold text-primary">
                            Meetwork
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/jobs"
                            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/jobs' ? 'text-primary' : 'text-neutral-700'
                                }`}
                        >
                            Vacantes
                        </Link>
                        <Link
                            href="/recruiter/dashboard"
                            className={`text-sm font-medium transition-colors hover:text-primary ${pathname?.startsWith('/recruiter') ? 'text-primary' : 'text-neutral-700'
                                }`}
                        >
                            Soy Reclutador
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-3">
                        {loading ? (
                            <div className="text-sm text-neutral-500">Cargando...</div>
                        ) : user ? (
                            <>
                                <span className="text-sm text-neutral-700">
                                    {user.email}
                                </span>
                                <Button variant="ghost" size="sm" onClick={handleLogout}>
                                    Cerrar Sesión
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login">
                                    <Button variant="ghost" size="sm">
                                        Iniciar Sesión
                                    </Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button variant="primary" size="sm">
                                        Registrarme
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
