import { JobPosting } from '@/domain/entities/JobPosting';
import { Card, CardContent } from '@/components/ui/Card';
import { CONTRACT_TYPES, MODALITIES, SHIFTS } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/utils';

interface JobCardProps {
    job: JobPosting;
}

export function JobCard({ job }: JobCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-xl font-heading font-bold text-neutral-900 mb-1">
                            {job.title}
                        </h3>
                        <p className="text-lg text-primary font-medium">
                            {job.companyName}
                        </p>
                    </div>
                    <span className="text-xs text-neutral-500 whitespace-nowrap ml-4">
                        {formatRelativeTime(job.createdAt)}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {job.industrialSector}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent-dark">
                        {job.jobArea}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                        {MODALITIES[job.modality]}
                    </span>
                </div>

                <div className="space-y-2 text-sm text-neutral-700">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {CONTRACT_TYPES[job.contractType]} • {SHIFTS[job.shift]}
                    </div>
                    {job.salaryRange && (
                        <div className="flex items-center font-medium text-accent-dark">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.salaryRange}
                        </div>
                    )}
                </div>

                <p className="text-sm text-neutral-700 line-clamp-3">
                    {job.descriptionShort}
                </p>

                <div className="pt-4 border-t border-neutral-200 space-y-2">
                    <p className="text-xs font-medium text-neutral-900 uppercase tracking-wide">
                        Contacto
                    </p>
                    <div className="flex flex-col gap-1 text-sm text-neutral-700">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {job.contactPhone}
                        </div>
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {job.contactEmail}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
