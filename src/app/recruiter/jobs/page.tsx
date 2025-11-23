'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface Job {
    id: string;
    title: string;
    companyName: string;
    location: string;
    industrialSector: string;
    jobArea: string;
    contractType: string;
    modality: string;
    salaryRange: string;
    shift: string;
    descriptionShort: string;
    isActive: boolean;
    createdAt: string;
    // Iteración 3.1: Vigencia (expiresAt puede ser null para vacantes viejas)
    validityDays: number;
    expiresAt: string | null;
}

export default function RecruiterJobsPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Iteración 3: Calcular estado de vigencia
    // Iteración 4: Mensajes más claros y accionables
    const getJobStatus = (job: Job) => {
        if (!job.expiresAt) return { status: 'active', daysLeft: null, message: null };

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiresDate = new Date(job.expiresAt);
        expiresDate.setHours(0, 0, 0, 0);

        const diffTime = expiresDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (daysLeft < 0) {
            return {
                status: 'expired',
                daysLeft,
                message: 'Esta vacante ya no se muestra a los candidatos. Edita y renueva la vigencia si aún está disponible.'
            };
        } else if (daysLeft <= 3) {
            return {
                status: 'expiring_soon',
                daysLeft,
                message: `Tu vacante expira en ${daysLeft} ${daysLeft === 1 ? 'día' : 'días'}. Si sigue abierta, actualiza la vigencia para que no desaparezca de los resultados.`
            };
        } else {
            return {
                status: 'active',
                daysLeft,
                message: null
            };
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await fetch('/api/recruiter/jobs');
            const data = await response.json();

            if (response.ok) {
                setJobs(data.data || []);
            } else {
                setError(data.error || 'Error al cargar vacantes');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    // Iteración 4: Calcular resumen de avisos de vigencia
    const getValidityAlerts = () => {
        const expired = jobs.filter(job => {
            const status = getJobStatus(job);
            return status.status === 'expired';
        });

        const expiringSoon = jobs.filter(job => {
            const status = getJobStatus(job);
            return status.status === 'expiring_soon';
        });

        return { expired, expiringSoon };
    };

    const validityAlerts = jobs.length > 0 ? getValidityAlerts() : { expired: [], expiringSoon: [] };

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-neutral-900">
                            Mis Vacantes
                        </h1>
                        <p className="text-neutral-600 mt-2">
                            Gestiona las vacantes que has publicado
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/recruiter/jobs/new')}
                    >
                        + Nueva Vacante
                    </Button>
                </div>

                {/* Iteración 4: Sección de Avisos de Vigencia */}
                {!loading && !error && jobs.length > 0 && (
                    <>
                        {validityAlerts.expired.length > 0 && (
                            <Card className="mb-6 border-red-300 bg-red-50">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">🔴</span>
                                        <h2 className="text-lg font-bold text-red-900">
                                            Vacantes Expiradas
                                        </h2>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-red-800 mb-4">
                                        Tienes {validityAlerts.expired.length} vacante{validityAlerts.expired.length !== 1 ? 's' : ''} expirada{validityAlerts.expired.length !== 1 ? 's' : ''} que ya no se muestra{validityAlerts.expired.length !== 1 ? 'n' : ''} a los candidatos.
                                    </p>
                                    <div className="space-y-3">
                                        {validityAlerts.expired.slice(0, 3).map(job => {
                                            const status = getJobStatus(job);
                                            const daysAgo = Math.abs(status.daysLeft || 0);
                                            return (
                                                <div key={job.id} className="flex items-center justify-between bg-white p-3 rounded border border-red-200">
                                                    <div>
                                                        <p className="font-medium text-neutral-900">{job.title}</p>
                                                        <p className="text-sm text-red-700">
                                                            Expirada hace {daysAgo} día{daysAgo !== 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => router.push(`/recruiter/jobs/${job.id}/edit`)}
                                                    >
                                                        Renovar
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                        {validityAlerts.expired.length > 3 && (
                                            <p className="text-sm text-red-700 text-center">
                                                + {validityAlerts.expired.length - 3} vacante{validityAlerts.expired.length - 3 !== 1 ? 's' : ''} expirada{validityAlerts.expired.length - 3 !== 1 ? 's' : ''} más
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {validityAlerts.expired.length === 0 && validityAlerts.expiringSoon.length > 0 && (
                            <Card className="mb-6 border-orange-300 bg-orange-50">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">⚠️</span>
                                        <h2 className="text-lg font-bold text-orange-900">
                                            Vacantes Por Expirar
                                        </h2>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-orange-800 mb-4">
                                        Tienes {validityAlerts.expiringSoon.length} vacante{validityAlerts.expiringSoon.length !== 1 ? 's' : ''} que expira{validityAlerts.expiringSoon.length !== 1 ? 'n' : ''} en los próximos 3 días.
                                    </p>
                                    <div className="space-y-3">
                                        {validityAlerts.expiringSoon.slice(0, 3).map(job => {
                                            const status = getJobStatus(job);
                                            return (
                                                <div key={job.id} className="flex items-center justify-between bg-white p-3 rounded border border-orange-200">
                                                    <div>
                                                        <p className="font-medium text-neutral-900">{job.title}</p>
                                                        <p className="text-sm text-orange-700">
                                                            Expira en {status.daysLeft} día{status.daysLeft !== 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => router.push(`/recruiter/jobs/${job.id}/edit`)}
                                                    >
                                                        Extender Vigencia
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                        {validityAlerts.expiringSoon.length > 3 && (
                                            <p className="text-sm text-orange-700 text-center">
                                                + {validityAlerts.expiringSoon.length - 3} vacante{validityAlerts.expiringSoon.length - 3 !== 1 ? 's' : ''} por expirar más
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {validityAlerts.expired.length === 0 && validityAlerts.expiringSoon.length === 0 && (
                            <Card className="mb-6 border-green-200 bg-green-50">
                                <CardContent className="py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">✅</span>
                                        <p className="text-green-800 font-medium">
                                            Todas tus vacantes vigentes están dentro de su periodo de publicación.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-neutral-600">Cargando vacantes...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="text-red-600 bg-red-50 border border-red-200 rounded p-4 inline-block">
                            {error}
                        </div>
                    </div>
                ) : jobs.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                                No tienes vacantes publicadas
                            </h3>
                            <p className="text-neutral-600 mb-6">
                                Comienza publicando tu primera vacante
                            </p>
                            <Button
                                variant="primary"
                                onClick={() => router.push('/recruiter/jobs/new')}
                            >
                                Crear Primera Vacante
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job) => {
                            const jobStatus = getJobStatus(job);

                            return (
                                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center flex-wrap gap-2 mb-2">
                                                    <h3 className="text-xl font-heading font-bold text-neutral-900">
                                                        {job.title}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-neutral-100 text-neutral-800'
                                                        }`}>
                                                        {job.isActive ? 'Activa' : 'Inactiva'}
                                                    </span>

                                                    {/* Iteración 3: Badges de vigencia */}
                                                    {jobStatus.status === 'expired' && (
                                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300">
                                                            🔴 Expirada
                                                        </span>
                                                    )}
                                                    {jobStatus.status === 'expiring_soon' && (
                                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-300">
                                                            ⚠️ Por expirar
                                                        </span>
                                                    )}
                                                    {jobStatus.status === 'active' && jobStatus.daysLeft !== null && (
                                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                            📅 {jobStatus.daysLeft} días restantes
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Mensaje de advertencia */}
                                                {jobStatus.message && (
                                                    <div className={`text-xs p-2 rounded mb-3 ${jobStatus.status === 'expired'
                                                        ? 'bg-red-50 text-red-700 border border-red-200'
                                                        : 'bg-orange-50 text-orange-700 border border-orange-200'
                                                        }`}>
                                                        {jobStatus.message}
                                                    </div>
                                                )}

                                                <p className="text-neutral-700 font-medium mb-2">
                                                    {job.companyName}
                                                </p>
                                                <p className="text-neutral-600 mb-4">
                                                    {job.descriptionShort}
                                                </p>
                                                <div className="flex flex-wrap gap-3 text-sm text-neutral-600">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {job.location}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{job.industrialSector}</span>
                                                    <span>•</span>
                                                    <span>{job.contractType}</span>
                                                    <span>•</span>
                                                    <span>{job.salaryRange}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                {/* Iteración 4: Botones CTA según estado de vigencia */}
                                                {jobStatus.status === 'expired' && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => router.push(`/recruiter/jobs/${job.id}/edit`)}
                                                    >
                                                        Renovar Vacante
                                                    </Button>
                                                )}
                                                {jobStatus.status === 'expiring_soon' && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => router.push(`/recruiter/jobs/${job.id}/edit`)}
                                                    >
                                                        Extender Vigencia
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.push(`/recruiter/jobs/${job.id}`)}
                                                >
                                                    Ver Detalles
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
