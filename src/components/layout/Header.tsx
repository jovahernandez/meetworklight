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
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const supabase = createClient();

        // Obtener usuario actual y su rol
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            setUser(user);

            if (user) {
                // Obtener el rol del usuario
                const response = await fetch('/api/user/role');
                if (response.ok) {
                    const data = await response.json();
                    setUserRole(data.role);
                }
            }

            setLoading(false);
        });

        // Escuchar cambios en la sesión
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);

            if (session?.user) {
                const response = await fetch('/api/user/role');
                if (response.ok) {
                    const data = await response.json();
                    setUserRole(data.role);
                }
            } else {
                setUserRole(null);
            }
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
            <div className="container mx-auto px-4 py-3 md:py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="text-xl md:text-2xl font-heading font-bold text-primary">
                            Meetwork
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
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

                    {/* Desktop User Menu */}
                    <div className="hidden md:flex items-center space-x-3">
                        {loading ? (
                            <div className="text-sm text-neutral-500">Cargando...</div>
                        ) : user ? (
                            <>
                                {/* Botón Panel para Reclutadores - sutil pero visible */}
                                {userRole === 'recruiter' && (
                                    <Link
                                        href="/recruiter/jobs"
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary bg-primary-50 hover:bg-primary-100 rounded-md transition-colors border border-primary-200"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        Panel
                                    </Link>
                                )}
                                <span className="text-sm text-neutral-700">
                                    {user.email}
                                </span>
                                {userRole === 'seeker' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={async () => {
                                            // Intentar cambiar directamente a reclutador
                                            const response = await fetch('/api/user/change-to-recruiter', {
                                                method: 'POST',
                                            });
                                            const data = await response.json();

                                            if (response.ok) {
                                                setUserRole('recruiter');
                                                router.push('/recruiter/dashboard');
                                                router.refresh();
                                            } else {
                                                // Si no tiene perfil de reclutador, redirigir a crearlo
                                                if (response.status === 400) {
                                                    router.push('/auth/change-role');
                                                }
                                            }
                                        }}
                                    >
                                        Cambiar a Reclutador
                                    </Button>
                                )}
                                {userRole === 'recruiter' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={async () => {
                                            const response = await fetch('/api/user/change-to-seeker', {
                                                method: 'POST',
                                            });

                                            if (response.ok) {
                                                setUserRole('seeker');
                                                router.push('/jobs');
                                                router.refresh();
                                            } else {
                                                // Si no tiene perfil de buscador, redirigir a crear uno
                                                if (response.status === 400) {
                                                    router.push('/seeker/profile/create');
                                                }
                                            }
                                        }}
                                    >
                                        Cambiar a Buscador
                                    </Button>
                                )}
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

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-neutral-700 hover:text-primary"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Menú"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-neutral-200 pt-4">
                        <nav className="flex flex-col space-y-3 mb-4">
                            <Link
                                href="/jobs"
                                className={`text-base font-medium py-2 px-3 rounded-md transition-colors ${pathname === '/jobs' ? 'bg-primary-50 text-primary' : 'text-neutral-700 hover:bg-neutral-100'
                                    }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Vacantes
                            </Link>
                            <Link
                                href="/recruiter/dashboard"
                                className={`text-base font-medium py-2 px-3 rounded-md transition-colors ${pathname?.startsWith('/recruiter') ? 'bg-primary-50 text-primary' : 'text-neutral-700 hover:bg-neutral-100'
                                    }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Soy Reclutador
                            </Link>
                        </nav>

                        <div className="flex flex-col space-y-2">
                            {loading ? (
                                <div className="text-sm text-neutral-500 py-2">Cargando...</div>
                            ) : user ? (
                                <>
                                    {/* Botón Panel para Reclutadores en móvil */}
                                    {userRole === 'recruiter' && (
                                        <Link
                                            href="/recruiter/jobs"
                                            className="flex items-center justify-center gap-2 w-full py-2.5 text-base font-medium text-primary bg-primary-50 hover:bg-primary-100 rounded-md transition-colors border border-primary-200"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            </svg>
                                            Panel de Reclutador
                                        </Link>
                                    )}
                                    <div className="text-sm text-neutral-700 py-2 px-3 bg-neutral-50 rounded-md">
                                        {user.email}
                                    </div>
                                    {userRole === 'seeker' && (
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={async () => {
                                                const response = await fetch('/api/user/change-to-recruiter', {
                                                    method: 'POST',
                                                });

                                                if (response.ok) {
                                                    setUserRole('recruiter');
                                                    router.push('/recruiter/dashboard');
                                                    router.refresh();
                                                } else if (response.status === 400) {
                                                    router.push('/auth/change-role');
                                                }
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            Cambiar a Reclutador
                                        </Button>
                                    )}
                                    {userRole === 'recruiter' && (
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={async () => {
                                                const response = await fetch('/api/user/change-to-seeker', {
                                                    method: 'POST',
                                                });

                                                if (response.ok) {
                                                    setUserRole('seeker');
                                                    router.push('/jobs');
                                                    router.refresh();
                                                } else if (response.status === 400) {
                                                    router.push('/seeker/profile/create');
                                                }
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            Cambiar a Buscador
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        className="w-full"
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        Cerrar Sesión
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full">
                                            Iniciar Sesión
                                        </Button>
                                    </Link>
                                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="primary" className="w-full">
                                            Registrarme
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
