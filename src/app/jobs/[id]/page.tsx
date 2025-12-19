'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface JobPosting {
    id: string;
    title: string;
    company: string;
    location: string;
    industrial_sector: string;
    job_area: string;
    contract_type: string;
    modality: string;
    salary_range: string;
    shift: string;
    description_short: string;
    description_long: string;
    requirements: string;
    benefits: string;
    contact_email: string;
    contact_phone: string;
    status: string;
    created_at: string;
    image_url?: string; // Iteración 6: Imagen de vacante
}

export default function PublicJobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.id as string;

    const [job, setJob] = useState<JobPosting | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Iteración 6: Verificar si el usuario está autenticado
    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setCheckingAuth(false);
        };
        checkAuth();
    }, []);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await fetch(`/api/jobs/${jobId}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        setError('Esta vacante no existe o ya no está disponible');
                    } else {
                        setError('Error al cargar la vacante');
                    }
                    return;
                }

                const data = await response.json();

                // Only show active jobs to public
                if (data.status !== 'active') {
                    setError('Esta vacante ya no está disponible');
                    return;
                }

                setJob(data);
            } catch (err) {
                console.error('Error fetching job:', err);
                setError('Error al cargar la vacante');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId]);

    // Iteración 6: Mientras verifica auth o carga datos
    if (loading || checkingAuth) {
        return (
            <div className="min-h-screen bg-neutral-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <Card>
                        <CardContent className="py-8 text-center">
                            <p className="text-neutral-600">Cargando vacante...</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Iteración 6: PAYWALL - Si no hay usuario autenticado, mostrar pantalla de registro
    if (!user) {
        return (
            <div className="min-h-screen bg-neutral-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/jobs')}
                        className="mb-6 text-sm md:text-base"
                    >
                        ← Volver a Vacantes
                    </Button>

                    <Card className="overflow-hidden">
                        {/* Preview básica de la vacante */}
                        <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-6 border-b">
                            <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900 mb-2">
                                {job?.title || 'Vacante'}
                            </h1>
                            <p className="text-lg text-neutral-700">
                                {job?.company || 'Empresa'}
                            </p>
                        </div>

                        <CardContent className="py-8 px-6">
                            <div className="text-center space-y-6">
                                {/* Icono de candado */}
                                <div className="mx-auto w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>

                                <div>
                                    <h2 className="text-xl md:text-2xl font-heading font-bold text-neutral-900 mb-2">
                                        Crea tu cuenta para ver los detalles
                                    </h2>
                                    <p className="text-neutral-600 max-w-md mx-auto">
                                        Para ver la información completa de contacto, descripción detallada y aplicar a esta vacante, necesitas una cuenta en Meetwork.
                                    </p>
                                </div>

                                {/* Beneficios de crear cuenta */}
                                <div className="bg-neutral-50 rounded-lg p-4 text-left max-w-md mx-auto">
                                    <p className="font-medium text-neutral-900 mb-3">Al crear tu cuenta podrás:</p>
                                    <ul className="space-y-2 text-sm text-neutral-700">
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Ver teléfono y correo de contacto
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Acceder a descripción completa del puesto
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Contactar directamente al reclutador
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Guardar vacantes de tu interés
                                        </li>
                                    </ul>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button
                                        variant="primary"
                                        className="px-8 py-3 text-base font-medium"
                                        onClick={() => router.push('/auth/register')}
                                    >
                                        Crear Cuenta Gratis
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="px-8 py-3 text-base font-medium"
                                        onClick={() => router.push('/auth/login')}
                                    >
                                        Ya tengo cuenta
                                    </Button>
                                </div>

                                <p className="text-xs text-neutral-500">
                                    Es gratis y solo toma 30 segundos
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-neutral-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <Card>
                        <CardContent className="py-8 text-center space-y-4">
                            <p className="text-red-600">{error || 'Vacante no encontrada'}</p>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/jobs')}
                            >
                                Volver a Vacantes
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-6 md:py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/jobs')}
                        className="mb-4 text-sm md:text-base"
                    >
                        ← Volver a Vacantes
                    </Button>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1">
                            <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900 mb-2">
                                {job.title}
                            </h1>
                            <p className="text-lg md:text-xl text-neutral-700 font-medium">
                                {job.company}
                            </p>
                        </div>
                        <Badge variant="success" className="text-sm px-4 py-2 self-start">
                            Activa
                        </Badge>
                    </div>
                </div>

                {/* Información General */}
                <Card className="mb-6">
                    <CardContent className="p-4 md:p-6">
                        <h2 className="text-lg md:text-xl font-heading font-bold text-neutral-900 mb-4">
                            Información General
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div>
                                <p className="text-sm text-neutral-600 mb-1">Ubicación</p>
                                <p className="font-medium text-neutral-900">{job.location || 'No especificada'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-600 mb-1">Sector Industrial</p>
                                <p className="font-medium text-neutral-900">{job.industrial_sector || 'Construcción'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-600 mb-1">Área de Trabajo</p>
                                <p className="font-medium text-neutral-900">{job.job_area || 'No especificada'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-600 mb-1">Tipo de Contrato</p>
                                <p className="font-medium text-neutral-900">{job.contract_type || 'No especificado'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-600 mb-1">Modalidad</p>
                                <p className="font-medium text-neutral-900">{job.modality || 'Presencial'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-600 mb-1">Turno</p>
                                <p className="font-medium text-neutral-900">{job.shift || 'No especificado'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-neutral-600 mb-1">Rango Salarial</p>
                                <p className="font-medium text-neutral-900">{job.salary_range || 'A convenir'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Descripción del Puesto */}
                <Card className="mb-6">
                    <CardContent className="p-4 md:p-6">
                        <h2 className="text-lg md:text-xl font-heading font-bold text-neutral-900 mb-4">
                            Descripción del Puesto
                        </h2>
                        <p className="text-sm md:text-base text-neutral-700 whitespace-pre-line leading-relaxed">
                            {job.description_short || 'Sin descripción'}
                        </p>

                        {job.description_long && job.description_long.trim() && (
                            <div className="mt-4 pt-4 border-t border-neutral-200">
                                <div className="text-sm md:text-base text-neutral-700 whitespace-pre-line leading-relaxed">
                                    {job.description_long}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Requisitos */}
                {job.requirements && job.requirements.trim() && (
                    <Card className="mb-6">
                        <CardContent className="p-4 md:p-6">
                            <h2 className="text-lg md:text-xl font-heading font-bold text-neutral-900 mb-4">
                                Requisitos
                            </h2>
                            <p className="text-sm md:text-base text-neutral-700 whitespace-pre-line leading-relaxed">
                                {job.requirements}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Beneficios */}
                {job.benefits && job.benefits.trim() && (
                    <Card className="mb-6">
                        <CardContent className="p-4 md:p-6">
                            <h2 className="text-lg md:text-xl font-heading font-bold text-neutral-900 mb-4">
                                Beneficios
                            </h2>
                            <p className="text-sm md:text-base text-neutral-700 whitespace-pre-line leading-relaxed">
                                {job.benefits}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Información de Contacto */}
                <Card>
                    <CardContent className="p-4 md:p-6">
                        <h2 className="text-lg md:text-xl font-heading font-bold text-neutral-900 mb-4">
                            Información de Contacto
                        </h2>
                        <div className="space-y-3">
                            {job.contact_phone && (
                                <div className="flex items-center gap-2">
                                    <span className="text-primary text-xl">📞</span>
                                    <a
                                        href={`tel:${job.contact_phone}`}
                                        className="text-sm md:text-base text-primary hover:text-primary-dark font-medium break-all"
                                    >
                                        {job.contact_phone}
                                    </a>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <span className="text-primary text-xl">📧</span>
                                <a
                                    href={`mailto:${job.contact_email}`}
                                    className="text-sm md:text-base text-primary hover:text-primary-dark font-medium break-all"
                                >
                                    {job.contact_email}
                                </a>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-neutral-200">
                            <p className="text-sm text-neutral-600 mb-3">
                                ¿Interesado en esta vacante? Ponte en contacto directamente con el reclutador.
                            </p>
                            <Button
                                variant="primary"
                                className="w-full py-3 text-base font-medium"
                                onClick={() => window.location.href = `mailto:${job.contact_email}?subject=Interesado en: ${job.title}`}
                            >
                                Enviar Correo
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
