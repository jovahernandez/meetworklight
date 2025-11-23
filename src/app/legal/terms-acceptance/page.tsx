'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const TERMS_VERSION = 'v1';

const TERMS_CONTENT = `
# Términos y Condiciones de Uso - Meetwork Light

**Versión ${TERMS_VERSION} - Última actualización: Enero 2025**

## 1. Aceptación de Términos

Al utilizar Meetwork Light, usted acepta estar sujeto a estos Términos y Condiciones. 
Si no está de acuerdo, no utilice esta plataforma.

## 2. Responsabilidad del Usuario

### 2.1 Veracidad de la Información
- Usted es responsable de proporcionar información veraz, precisa y actualizada.
- Cualquier información falsa puede resultar en la suspensión de su cuenta.

### 2.2 Uso Adecuado
- No publicar contenido ofensivo, discriminatorio o ilegal.
- No utilizar la plataforma para actividades fraudulentas.
- Respetar los derechos de propiedad intelectual.

## 3. Responsabilidad de Meetwork

### 3.1 Intermediación
- Meetwork actúa como intermediario entre reclutadores y buscadores de empleo.
- **NO nos hacemos responsables** de:
  - Acuerdos laborales realizados fuera de la plataforma.
  - Condiciones de trabajo específicas.
  - Conflictos entre empleadores y empleados.

### 3.2 Verificación de Identidad
- Implementamos verificación de identidad para seguridad de los usuarios.
- La verificación NO garantiza la idoneidad laboral o moral de una persona.

## 4. Privacidad y Datos

- Sus datos personales serán tratados conforme a nuestra Política de Privacidad.
- NO compartimos sus documentos de identidad con terceros.
- Solo almacenamos el **estado de verificación**, no los documentos originales.

## 5. Modificaciones

Meetwork se reserva el derecho de modificar estos términos en cualquier momento.
Los usuarios serán notificados de cambios significativos.

## 6. Contacto

Para preguntas sobre estos términos: soporte@meetwork.mx

---

**Al hacer clic en "Acepto", usted confirma que:**
- Ha leído y comprendido estos términos.
- Acepta cumplir con todas las condiciones establecidas.
- Proporciona información veraz y actualizada.
`;

export default function TermsAcceptancePage() {
    const router = useRouter();
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAccept = async () => {
        if (!accepted) {
            setError('Debes aceptar los términos para continuar');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/legal/accept-terms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ version: TERMS_VERSION }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al aceptar términos');
            }

            // Redirigir según el rol del usuario
            // Usamos window.location para forzar recarga completa y actualizar estado
            window.location.href = '/';
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Card className="p-6 sm:p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Términos y Condiciones
                        </h1>
                        <p className="text-gray-600">
                            Por favor, lee y acepta nuestros términos antes de continuar
                        </p>
                    </div>

                    {/* Contenido de términos con scroll */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 h-96 overflow-y-auto">
                        <div className="prose prose-sm max-w-none">
                            {TERMS_CONTENT.split('\n').map((line, index) => {
                                if (line.startsWith('# ')) {
                                    return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
                                }
                                if (line.startsWith('## ')) {
                                    return <h2 key={index} className="text-xl font-semibold mt-4 mb-2">{line.slice(3)}</h2>;
                                }
                                if (line.startsWith('### ')) {
                                    return <h3 key={index} className="text-lg font-medium mt-3 mb-1">{line.slice(4)}</h3>;
                                }
                                if (line.startsWith('**') && line.endsWith('**')) {
                                    return <p key={index} className="font-bold my-2">{line.slice(2, -2)}</p>;
                                }
                                if (line.startsWith('- ')) {
                                    return <li key={index} className="ml-4">{line.slice(2)}</li>;
                                }
                                if (line.trim() === '') {
                                    return <br key={index} />;
                                }
                                return <p key={index} className="my-2">{line}</p>;
                            })}
                        </div>
                    </div>

                    {/* Checkbox de aceptación */}
                    <div className="mb-6">
                        <label className="flex items-start space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={accepted}
                                onChange={(e) => setAccepted(e.target.checked)}
                                className="mt-1 h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">
                                He leído y acepto los Términos y Condiciones de Meetwork Light (versión {TERMS_VERSION})
                            </span>
                        </label>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <Button
                        onClick={handleAccept}
                        disabled={!accepted || loading}
                        className="w-full"
                    >
                        {loading ? 'Procesando...' : 'Aceptar y Continuar'}
                    </Button>
                </Card>
            </div>
        </div>
    );
}
