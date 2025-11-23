import { JobPosting } from '@/domain/entities/JobPosting';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CONTRACT_TYPES, MODALITIES, SHIFTS } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface JobCardProps {
    job: JobPosting;
}

export function JobCard({ job }: JobCardProps) {
    const router = useRouter();

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg md:text-xl font-heading font-bold text-neutral-900 mb-1 line-clamp-2">
                            {job.title}
                        </h3>
                        <p className="text-base md:text-lg text-primary font-medium truncate">
                            {job.companyName}
                        </p>
                    </div>
                    <span className="text-xs text-neutral-500 whitespace-nowrap flex-shrink-0">
                        {formatRelativeTime(job.createdAt)}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 md:px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent-dark">
                        {job.jobArea}
                    </span>
                    <span className="inline-flex items-center px-2.5 md:px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                        Presencial
                    </span>
                    {/* Iteración 2: Badge de RFC */}
                    {job.companyRfc && (
                        <span className="inline-flex items-center px-2.5 md:px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                            ✓ RFC registrado
                        </span>
                    )}
                </div>

                <div className="space-y-2 text-sm md:text-base text-neutral-700">
                    {/* Ubicación - Iteración 2: Prioridad a ubicación de obra */}
                    <div className="flex items-start">
                        <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="flex-1 min-w-0">
                            <span className="truncate block">{job.worksiteLocation || job.location}</span>
                            {/* Mostrar ubicación de empresa si difiere de la obra */}
                            {job.companyLocation && job.worksiteLocation && job.companyLocation !== job.worksiteLocation && (
                                <span className="text-xs text-neutral-500 block mt-0.5">
                                    Empresa: {job.companyLocation}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {job.contractType} • {job.shift}
                    </div>
                    {job.salaryRange && (
                        <div className="flex items-center font-medium text-accent-dark">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.salaryRange}
                        </div>
                    )}
                </div>

                <p className="text-sm md:text-base text-neutral-700 line-clamp-2 md:line-clamp-3">
                    {job.descriptionShort}
                </p>

                <Button
                    variant="primary"
                    className="w-full py-3 text-base font-medium"
                    onClick={() => router.push(`/jobs/${job.id}`)}
                >
                    Ver Más Detalles
                </Button>

                <div className="pt-3 md:pt-4 border-t border-neutral-200 space-y-2">
                    <p className="text-xs font-medium text-neutral-900 uppercase tracking-wide">
                        Contacto
                    </p>
                    <div className="flex flex-col gap-1.5 text-sm text-neutral-700">
                        <a href={`tel:${job.contactPhone}`} className="flex items-center hover:text-primary transition-colors active:text-primary-dark">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="truncate">{job.contactPhone}</span>
                        </a>
                        <a href={`mailto:${job.contactEmail}`} className="flex items-center hover:text-primary transition-colors active:text-primary-dark">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate">{job.contactEmail}</span>
                        </a>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
