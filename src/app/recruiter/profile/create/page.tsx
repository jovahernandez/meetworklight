'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { KycVerificationSection } from '@/components/kyc/KycVerificationSection';
import { KycStatus } from '@/ports/services/IKycVerificationService';
import { createClient } from '@/lib/supabase/client';

const INDUSTRIAL_SECTORS = [
    'Construcción',
];

export default function CreateRecruiterProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [kycStatus, setKycStatus] = useState<KycStatus>('pending');
    const [profileExists, setProfileExists] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        phone: '',
        emailContact: '',
        location: '',
        industrialSector: 'Construcción',
        website: '',
        companyRfc: '',
        legalRepresentative: '',
        actaConstitutiva: '',
    });

    // Verificar si ya existe un perfil al cargar
    useEffect(() => {
        checkExistingProfile();
    }, []);

    const checkExistingProfile = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            const { data: profile } = await supabase
                .from('recruiter_profiles')
                .select('*, kyc_status')
                .eq('user_id', user.id)
                .single();

            if (profile) {
                setProfileExists(true);
                setKycStatus(profile.kyc_status || 'pending');
                // Cargar datos existentes en el formulario
                setFormData({
                    companyName: profile.company_name || '',
                    contactName: profile.contact_name || '',
                    phone: profile.contact_phone || '',
                    emailContact: profile.contact_email || '',
                    location: profile.location || '',
                    industrialSector: 'Construcción',
                    website: profile.website || '',
                    companyRfc: profile.company_rfc || '',
                    legalRepresentative: profile.legal_representative || '',
                    actaConstitutiva: profile.acta_constitutiva || '',
                });
            }
        } catch (err) {
            console.error('Error al verificar perfil:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/recruiter/profile', {
                method: profileExists ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                if (!profileExists) {
                    setProfileExists(true);
                    alert('Perfil creado correctamente');
                    // Redirigir al dashboard después de crear el perfil
                    router.push('/recruiter/dashboard');
                } else {
                    alert('Perfil actualizado correctamente');
                    // Recargar datos después de actualizar
                    await checkExistingProfile();
                }
            } else {
                setError(data.error || 'Error al guardar perfil');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleStartKycVerification = async () => {
        const response = await fetch('/api/kyc/start-verification', {
            method: 'POST',
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Error al iniciar verificación');
        }

        const result = await response.json();
        return result;
    };

    return (
        <div className="container mx-auto px-4 py-6 md:py-16">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <h1 className="text-xl md:text-3xl font-heading font-bold text-neutral-900">
                            Crear Perfil de Reclutador
                        </h1>
                        <p className="text-sm md:text-base text-neutral-600 mt-2">
                            Completa la información de tu empresa para empezar a publicar vacantes
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                            <Input
                                label="Nombre de la Empresa *"
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                required
                                placeholder="Ej: Industrias del Norte SA"
                                className="text-base"
                            />

                            <Input
                                label="Nombre de Contacto *"
                                type="text"
                                value={formData.contactName}
                                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                required
                                placeholder="Ej: Juan Pérez García"
                                className="text-base"
                            />

                            <Input
                                label="Teléfono de Contacto *"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                                placeholder="Ej: +52 81 1234 5678"
                                className="text-base"
                            />

                            <Input
                                label="Email de Contacto *"
                                type="email"
                                value={formData.emailContact}
                                onChange={(e) => setFormData({ ...formData, emailContact: e.target.value })}
                                required
                                placeholder="Ej: reclutamiento@empresa.com"
                                className="text-base"
                            />

                            <Input
                                label="Ubicación *"
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                                placeholder="Ej: Monterrey, Nuevo León"
                                className="text-base"
                            />

                            <Input
                                label="Sitio Web (opcional)"
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                placeholder="Ej: https://www.empresa.com"
                                className="text-base"
                            />

                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Información Fiscal (opcional)
                                </h2>

                                <div className="space-y-4">
                                    <Input
                                        label="RFC de la Empresa"
                                        type="text"
                                        value={formData.companyRfc}
                                        onChange={(e) => setFormData({ ...formData, companyRfc: e.target.value })}
                                        placeholder="ABC123456XYZ"
                                        className="text-base"
                                    />

                                    <Input
                                        label="Representante Legal"
                                        type="text"
                                        value={formData.legalRepresentative}
                                        onChange={(e) => setFormData({ ...formData, legalRepresentative: e.target.value })}
                                        placeholder="Nombre completo"
                                        className="text-base"
                                    />

                                    <Input
                                        label="Número de Acta Constitutiva o D2"
                                        type="text"
                                        value={formData.actaConstitutiva}
                                        onChange={(e) => setFormData({ ...formData, actaConstitutiva: e.target.value })}
                                        placeholder="12345"
                                        className="text-base"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full py-3 text-base font-medium"
                                disabled={loading}
                            >
                                {loading ? (profileExists ? 'Actualizando...' : 'Creando perfil...') : (profileExists ? 'Actualizar Perfil' : 'Crear Perfil')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Sección de KYC - Solo visible si el perfil ya fue creado */}
                {profileExists && (
                    <div className="mt-6">
                        <KycVerificationSection
                            initialStatus={kycStatus}
                            onStartVerification={handleStartKycVerification}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
