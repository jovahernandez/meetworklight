// Iteración 5: Pantalla de confirmación de email después de registro

'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function CheckEmailPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-xl md:text-2xl font-heading font-bold text-neutral-900 text-center">
                            Revisa tu Correo
                        </h1>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center space-y-3">
                            <p className="text-base text-neutral-700">
                                Te enviamos un mensaje para confirmar tu cuenta de <span className="font-semibold">Meetwork</span>.
                            </p>
                            <p className="text-base text-neutral-700">
                                Abre el correo y haz clic en el enlace para activar tu cuenta.
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                            <div className="flex items-start gap-2">
                                <svg
                                    className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium mb-1">¿No encuentras el correo?</p>
                                    <ul className="list-disc list-inside space-y-1 ml-1">
                                        <li>Revisa tu bandeja de spam o promociones</li>
                                        <li>Verifica que escribiste correctamente tu correo</li>
                                        <li>Espera unos minutos, puede tardar en llegar</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 text-center">
                            <Link href="/auth/login">
                                <Button variant="outline" className="w-full">
                                    Volver al Inicio de Sesión
                                </Button>
                            </Link>
                        </div>

                        <div className="text-center pt-2">
                            <p className="text-xs text-neutral-500">
                                Una vez que confirmes tu correo, podrás iniciar sesión y completar tu perfil.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
