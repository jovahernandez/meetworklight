'use client';

import { useState } from 'react';
import { KycStatus } from '@/ports/services/IKycVerificationService';
import { KycStatusBadge } from './KycStatusBadge';
import { KycVerificationButton } from './KycVerificationButton';
import { Card } from '@/components/ui/Card';

interface KycVerificationSectionProps {
    initialStatus: KycStatus;
    onStartVerification: () => Promise<{ verificationUrl: string }>;
}

export function KycVerificationSection({
    initialStatus,
    onStartVerification
}: KycVerificationSectionProps) {
    const [status, setStatus] = useState<KycStatus>(initialStatus);
    const [error, setError] = useState<string | null>(null);

    const handleStartVerification = async () => {
        try {
            setError(null);
            const result = await onStartVerification();

            // Abrir URL de verificación en nueva ventana
            if (result.verificationUrl) {
                window.open(result.verificationUrl, '_blank');
            }

            setStatus('pending');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar verificación');
        }
    };

    return (
        <Card className="p-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                        🔐 Verificación de Identidad
                    </h3>
                    <KycStatusBadge status={status} />
                </div>

                <p className="text-sm text-gray-600">
                    Para garantizar la seguridad de todos los usuarios, verificamos la identidad
                    mediante documentos oficiales (INE, pasaporte, etc.) a través de nuestro
                    proveedor de confianza MetaMap.
                </p>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {status === 'pending' && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            ℹ️ Verificación en proceso. Recibirás una notificación cuando se complete.
                        </p>
                    </div>
                )}

                {status === 'verified' && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                            ✅ Tu identidad ha sido verificada exitosamente.
                        </p>
                    </div>
                )}

                {status === 'rejected' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                            ❌ La verificación no pudo completarse. Por favor, contacta a soporte.
                        </p>
                    </div>
                )}

                {status !== 'verified' && (
                    <KycVerificationButton
                        onStartVerification={handleStartVerification}
                        disabled={false}
                    />
                )}
            </div>
        </Card>
    );
}
