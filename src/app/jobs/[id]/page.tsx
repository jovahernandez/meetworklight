'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

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
}

export default function PublicJobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.id as string;

    const [job, setJob] = useState<JobPosting | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) {
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
