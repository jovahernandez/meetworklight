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
    status: string;
    createdAt: string;
}

export default function RecruiterJobsPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                        {jobs.map((job) => (
                            <Card key={job.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-heading font-bold text-neutral-900">
                                                    {job.title}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-neutral-100 text-neutral-800'
                                                    }`}>
                                                    {job.status === 'active' ? 'Activa' : 'Inactiva'}
                                                </span>
                                            </div>
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
