'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { KycVerificationSection } from '@/components/kyc/KycVerificationSection';
import { KycStatus } from '@/ports/services/IKycVerificationService';
import { createClient } from '@/lib/supabase/client';

const INDUSTRIAL_SECTORS = [
    'Construcción',
];

const EXPERIENCE_LEVELS = [
    'Sin experiencia',
    '1-2 años',
    '3-5 años',
    '6-10 años',
    'Más de 10 años',
];

export default function CreateSeekerProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [kycStatus, setKycStatus] = useState<KycStatus>('pending');
    const [profileExists, setProfileExists] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        location: '',
        preferredSector: '',
        experienceLevel: '',
        skills: '',
        bio: '',
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
                .from('seeker_profiles')
                .select('*, kyc_status')
                .eq('user_id', user.id)
                .single();

            if (profile) {
                setProfileExists(true);
                setKycStatus(profile.kyc_status || 'pending');
                // Cargar datos existentes
                setFormData({
                    fullName: profile.full_name || '',
                    phone: profile.phone || '',
                    location: profile.location || '',
                    preferredSector: profile.preferred_sector || '',
                    experienceLevel: profile.experience_level || '',
                    skills: profile.skills || '',
                    bio: profile.bio || '',
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
            const response = await fetch('/api/seeker/profile', {
                method: profileExists ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                if (!profileExists) {
                    setProfileExists(true);
                    alert('Perfil creado correctamente');
                    // Redirigir a /jobs después de crear el perfil
                    router.push('/jobs');
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
                            Crear Perfil de Buscador
                        </h1>
                        <p className="text-sm md:text-base text-neutral-600 mt-2">
                            Completa tu información para encontrar las mejores oportunidades
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                            <Input
                                label="Nombre Completo *"
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                                placeholder="Ej: María González López"
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
                                label="Ubicación *"
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                                placeholder="Ej: Monterrey, Nuevo León"
                                className="text-base"
                            />

                            <Select
                                label="Sector Industrial Preferido *"
                                value={formData.preferredSector}
                                onChange={(e) => setFormData({ ...formData, preferredSector: e.target.value })}
                                required
                                className="text-base"
                            >
                                <option value="">Selecciona un sector</option>
                                {INDUSTRIAL_SECTORS.map((sector) => (
                                    <option key={sector} value={sector}>
                                        {sector}
                                    </option>
                                ))}
                            </Select>

                            <Select
                                label="Nivel de Experiencia *"
                                value={formData.experienceLevel}
                                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                                required
                                className="text-base"
                            >
                                <option value="">Selecciona tu nivel</option>
                                {EXPERIENCE_LEVELS.map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </Select>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-neutral-700">
                                    Habilidades *
                                </label>
                                <textarea
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    required
                                    placeholder="Ej: Operación de maquinaria, soldadura, control de calidad..."
                                    rows={3}
                                    className="w-full px-3 py-2 text-base border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-neutral-700">
                                    Sobre mí (opcional)
                                </label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Cuéntanos un poco sobre ti y tu experiencia..."
                                    rows={4}
                                    className="w-full px-3 py-2 text-base border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
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
                                {loading ? (profileExists ? 'Actualizando...' : 'Creando perfil...') : (profileExists ? 'Actualizar Perfil' : 'Completar Perfil')}
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
