'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ChooseRolePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSelectRole = async (role: 'seeker' | 'recruiter') => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/set-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role }),
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect to profile creation based on role
                if (role === 'seeker') {
                    router.push('/seeker/profile/create');
                } else {
                    router.push('/recruiter/profile/create');
                }
                router.refresh();
            } else {
                setError(data.error || 'Error al asignar rol. Por favor intenta de nuevo.');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error setting role:', error);
            setError('Error de conexión. Por favor intenta de nuevo.');
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-heading font-bold text-neutral-900 mb-4">
                    ¿Qué tipo de perfil quieres crear?
                </h1>
                <p className="text-lg text-neutral-600 mb-12">
                    Selecciona la opción que mejor se adapte a tus necesidades
                </p>

                {error && (
                    <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                        {error}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="hover:shadow-xl transition-shadow cursor-pointer">
                        <CardContent className="p-8">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-heading font-bold mb-3">
                                Busco Trabajo
                            </h3>
                            <p className="text-neutral-600 mb-6">
                                Explora vacantes y encuentra oportunidades en el sector de la construcción
                            </p>
                            <Button
                                variant="primary"
                                className="w-full"
                                onClick={() => handleSelectRole('seeker')}
                                disabled={loading}
                            >
                                {loading ? 'Configurando...' : 'Continuar como Buscador'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-shadow cursor-pointer">
                        <CardContent className="p-8">
                            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-heading font-bold mb-3">
                                Soy Reclutador
                            </h3>
                            <p className="text-neutral-600 mb-6">
                                Publica vacantes y encuentra el mejor talento para tu empresa
                            </p>
                            <Button
                                variant="secondary"
                                className="w-full"
                                onClick={() => handleSelectRole('recruiter')}
                                disabled={loading}
                            >
                                {loading ? 'Configurando...' : 'Continuar como Reclutador'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
