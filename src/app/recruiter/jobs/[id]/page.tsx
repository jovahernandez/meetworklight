'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface JobDetail {
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
    descriptionLong: string;
    contactPhone: string;
    contactEmail: string;
    isActive: boolean;
    createdAt: string;
}

export default function JobDetailPage() {
    const router = useRouter();
    const params = useParams();
    const jobId = params.id as string;

    const [job, setJob] = useState<JobDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (jobId) {
            fetchJobDetail();
        }
    }, [jobId]);

    const fetchJobDetail = async () => {
        try {
            const response = await fetch(`/api/recruiter/jobs/${jobId}`);
            const data = await response.json();

            if (response.ok) {
                setJob(data.data);
            } else {
                setError(data.error || 'Error al cargar la vacante');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!job) return;

        try {
            const response = await fetch(`/api/recruiter/jobs/${jobId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isActive: !job.isActive
                }),
            });

            if (response.ok) {
                setJob({ ...job, isActive: !job.isActive });
            }
        } catch (err) {
            console.error('Error al cambiar estado:', err);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-neutral-600">Cargando...</p>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-red-600 mb-4">{error || 'Vacante no encontrada'}</p>
                            <Button onClick={() => router.push('/recruiter/jobs')}>
                                Volver a Mis Vacantes
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/recruiter/jobs')}
                        className="mb-4"
                    >
                        ← Volver a Mis Vacantes
                    </Button>

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">
                                {job.title}
                            </h1>
                            <p className="text-xl text-neutral-700 font-medium">
                                {job.companyName}
                            </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${job.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-neutral-100 text-neutral-800'
                            }`}>
                            {job.isActive ? 'Activa' : 'Inactiva'}
                        </span>
                    </div>
                </div>

                {/* Detalles */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-heading font-bold text-neutral-900 mb-4">
                            Información General
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-neutral-600 mb-1">Ubicación</p>
                                <p className="font-medium text-neutral-900">{job.location}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-600 mb-1">Sector Industrial</p>
                                <p className="font-medium text-neutral-900">{job.industrialSector}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-600 mb-1">Área de Trabajo</p>
                                <p className="font-medium text-neutral-900">{job.jobArea}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-600 mb-1">Tipo de Contrato</p>
                                <p className="font-medium text-neutral-900">{job.contractType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-600 mb-1">Modalidad</p>
                                <p className="font-medium text-neutral-900">{job.modality}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-600 mb-1">Turno</p>
                                <p className="font-medium text-neutral-900">{job.shift}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-600 mb-1">Rango Salarial</p>
                                <p className="font-medium text-neutral-900">{job.salaryRange || 'No especificado'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Descripción */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-heading font-bold text-neutral-900 mb-4">
                            Descripción del Puesto
                        </h2>
                        <p className="text-neutral-700 mb-4">{job.descriptionShort}</p>

                        {job.descriptionLong && (
                            <div className="text-neutral-600 whitespace-pre-line">
                                {job.descriptionLong}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Contacto */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-heading font-bold text-neutral-900 mb-4">
                            Información de Contacto
                        </h2>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-neutral-900">{job.contactPhone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-neutral-900">{job.contactEmail}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Acciones */}
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={handleToggleStatus}
                    >
                        {job.isActive ? 'Desactivar Vacante' : 'Activar Vacante'}
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => router.push(`/recruiter/jobs/${job.id}/edit`)}
                    >
                        Editar Vacante
                    </Button>
                </div>
            </div>
        </div>
    );
}
