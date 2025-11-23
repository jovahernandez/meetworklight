'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';

const INDUSTRIAL_SECTORS = ['Construcción'];

export default function ChangeRolePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentRole, setCurrentRole] = useState<string>('');
    const [newRole, setNewRole] = useState<string>('');
    const [showRecruiterForm, setShowRecruiterForm] = useState(false);

    const [recruiterData, setRecruiterData] = useState({
        companyName: '',
        rfc: '',
        d2Document: '', // Número de documento D2 o acta constitutiva
        contactName: '',
        phone: '',
        emailContact: '',
        location: '',
        industrialSector: 'Construcción',
        website: '',
        businessProof: '', // Documento de constitución o registro
    });

    useEffect(() => {
        // Obtener rol actual del usuario
        fetch('/api/user/role')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCurrentRole(data.role);
                }
            });
    }, []);

    const handleRoleSelection = (role: string) => {
        setNewRole(role);
        setShowRecruiterForm(role === 'recruiter');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (newRole === 'recruiter') {
                // Validar información de reclutador
                if (!recruiterData.companyName || !recruiterData.rfc || !recruiterData.d2Document ||
                    !recruiterData.contactName || !recruiterData.phone || !recruiterData.emailContact ||
                    !recruiterData.location) {
                    setError('Todos los campos obligatorios son requeridos para validar tu empresa');
                    setLoading(false);
                    return;
                }

                // Validar formato de RFC (básico)
                const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
                if (!rfcRegex.test(recruiterData.rfc.toUpperCase())) {
                    setError('El RFC no tiene un formato válido');
                    setLoading(false);
                    return;
                }
            }

            const response = await fetch('/api/user/change-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    newRole,
                    recruiterData: newRole === 'recruiter' ? recruiterData : null,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Redirigir según el nuevo rol
                if (newRole === 'recruiter') {
                    router.push('/recruiter/dashboard');
                } else {
                    router.push('/seeker/dashboard');
                }
                router.refresh();
            } else {
                setError(data.error || 'Error al cambiar de rol');
                setLoading(false);
            }
        } catch (err) {
            setError('Error de conexión');
            setLoading(false);
        }
    };

    if (!currentRole) {
        return <div className="container mx-auto px-4 py-16 text-center">Cargando...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <h1 className="text-2xl font-heading font-bold text-neutral-900">
                            Cambiar de Rol
                        </h1>
                        <p className="text-neutral-600 mt-2">
                            Tu rol actual es: <strong>{currentRole === 'seeker' ? 'Buscador de Empleo' : 'Reclutador'}</strong>
                        </p>
                        <p className="text-sm text-neutral-500 mt-2">
                            ⚠️ Al cambiar de rol, tu perfil anterior se mantendrá pero solo podrás usar las funciones del nuevo rol.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-4">Selecciona tu nuevo rol:</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => handleRoleSelection('seeker')}
                                        disabled={currentRole === 'seeker'}
                                        className={`p-4 border-2 rounded-lg transition ${newRole === 'seeker'
                                            ? 'border-primary bg-primary/5'
                                            : 'border-neutral-200 hover:border-primary/50'
                                            } ${currentRole === 'seeker' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">👷</div>
                                            <h4 className="font-semibold">Busco Trabajo</h4>
                                            <p className="text-sm text-neutral-600 mt-1">
                                                Explorar y aplicar a vacantes
                                            </p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleRoleSelection('recruiter')}
                                        disabled={currentRole === 'recruiter'}
                                        className={`p-4 border-2 rounded-lg transition ${newRole === 'recruiter'
                                            ? 'border-accent-dark bg-accent/5'
                                            : 'border-neutral-200 hover:border-accent-dark/50'
                                            } ${currentRole === 'recruiter' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">🏢</div>
                                            <h4 className="font-semibold">Soy Reclutador</h4>
                                            <p className="text-sm text-neutral-600 mt-1">
                                                Publicar vacantes y contratar
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {showRecruiterForm && (
                                <div className="border-t pt-6 space-y-4">
                                    <h3 className="font-semibold text-lg mb-4">
                                        Validación de Empresa
                                    </h3>
                                    <p className="text-sm text-neutral-600 mb-4">
                                        Para validar que representas legalmente a una empresa, necesitamos la siguiente información:
                                    </p>

                                    <Input
                                        label="Nombre de la Empresa *"
                                        type="text"
                                        value={recruiterData.companyName}
                                        onChange={(e) => setRecruiterData({ ...recruiterData, companyName: e.target.value })}
                                        required
                                        placeholder="Ej: Constructora del Norte SA de CV"
                                    />

                                    <Input
                                        label="RFC de la Empresa *"
                                        type="text"
                                        value={recruiterData.rfc}
                                        onChange={(e) => setRecruiterData({ ...recruiterData, rfc: e.target.value.toUpperCase() })}
                                        required
                                        placeholder="Ej: ABC123456XYZ"
                                        maxLength={13}
                                    />

                                    <div>
                                        <Input
                                            label="Número de Acta Constitutiva o D2 *"
                                            type="text"
                                            value={recruiterData.d2Document}
                                            onChange={(e) => setRecruiterData({ ...recruiterData, d2Document: e.target.value })}
                                            required
                                            placeholder="Ej: 123456 o número de folio"
                                        />
                                        <p className="text-xs text-neutral-500 mt-1">
                                            Ingresa el número de tu acta constitutiva o documento D2 ante el SAT
                                        </p>
                                    </div>

                                    <Input
                                        label="Nombre del Representante Legal *"
                                        type="text"
                                        value={recruiterData.contactName}
                                        onChange={(e) => setRecruiterData({ ...recruiterData, contactName: e.target.value })}
                                        required
                                        placeholder="Ej: Juan Pérez"
                                    />

                                    <Input
                                        label="Teléfono Corporativo *"
                                        type="tel"
                                        value={recruiterData.phone}
                                        onChange={(e) => setRecruiterData({ ...recruiterData, phone: e.target.value })}
                                        required
                                        placeholder="Ej: 8112345678"
                                    />

                                    <Input
                                        label="Email Corporativo *"
                                        type="email"
                                        value={recruiterData.emailContact}
                                        onChange={(e) => setRecruiterData({ ...recruiterData, emailContact: e.target.value })}
                                        required
                                        placeholder="Ej: reclutamiento@empresa.com"
                                    />

                                    <Input
                                        label="Ubicación de la Empresa *"
                                        type="text"
                                        value={recruiterData.location}
                                        onChange={(e) => setRecruiterData({ ...recruiterData, location: e.target.value })}
                                        required
                                        placeholder="Ej: Monterrey, Nuevo León"
                                    />

                                    <Input
                                        label="Sitio Web (opcional)"
                                        type="url"
                                        value={recruiterData.website}
                                        onChange={(e) => setRecruiterData({ ...recruiterData, website: e.target.value })}
                                        placeholder="Ej: https://www.empresa.com"
                                    />

                                    <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm">
                                        <p className="font-semibold text-yellow-800 mb-2">
                                            ℹ️ Verificación de Identidad
                                        </p>
                                        <p className="text-yellow-700">
                                            La información proporcionada será revisada. Nos reservamos el derecho de solicitar
                                            documentación adicional para validar la legitimidad de tu empresa.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => router.back()}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={loading || !newRole || newRole === currentRole}
                                    className="flex-1"
                                >
                                    {loading ? 'Procesando...' : 'Cambiar de Rol'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
