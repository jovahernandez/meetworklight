import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <h1 className="text-5xl font-heading font-bold text-neutral-900">
                    Conectamos Talento Industrial con Oportunidades Reales
                </h1>
                <p className="text-xl text-neutral-700 max-w-2xl mx-auto">
                    Meetwork es la plataforma especializada en el sector industrial de México.
                    Encuentra tu próxima oportunidad en construcción, logística, manufactura, energía y más.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                    <Link href="/jobs">
                        <Button variant="primary" size="lg">
                            Ver Vacantes
                        </Button>
                    </Link>
                    <Link href="/auth/register">
                        <Button variant="outline" size="lg">
                            Crear Cuenta
                        </Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8 pt-16">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-heading font-bold text-lg mb-2">Vacantes Especializadas</h3>
                        <p className="text-neutral-600">
                            Oportunidades en los principales sectores industriales de México
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-accent-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-heading font-bold text-lg mb-2">Búsqueda Simplificada</h3>
                        <p className="text-neutral-600">
                            Filtra por ubicación, sector, modalidad y más para encontrar lo que buscas
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="font-heading font-bold text-lg mb-2">Conexión Directa</h3>
                        <p className="text-neutral-600">
                            Contacta directamente con los reclutadores sin intermediarios
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
