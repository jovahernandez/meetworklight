'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

const INDUSTRIAL_SECTORS = [
    'Construcción',
    'Logística y Transporte',
    'Manufactura',
    'Energía',
    'Minería',
    'Agricultura y Agroindustria',
    'Petróleo y Gas',
    'Automotriz',
    'Alimentaria',
    'Química y Farmacéutica',
];

export default function CreateRecruiterProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        phone: '',
        emailContact: '',
        location: '',
        industrialSector: '',
        website: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/recruiter/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect to dashboard after successful profile creation
                router.push('/recruiter/dashboard');
                router.refresh();
            } else {
                setError(data.error || 'Error al crear perfil');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <h1 className="text-3xl font-heading font-bold text-neutral-900">
                            Crear Perfil de Reclutador
                        </h1>
                        <p className="text-neutral-600 mt-2">
                            Completa la información de tu empresa para empezar a publicar vacantes
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Nombre de la Empresa *"
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                required
                                placeholder="Ej: Industrias del Norte SA"
                            />

                            <Input
                                label="Nombre de Contacto *"
                                type="text"
                                value={formData.contactName}
                                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                required
                                placeholder="Ej: Juan Pérez García"
                            />

                            <Input
                                label="Teléfono de Contacto *"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                                placeholder="Ej: +52 81 1234 5678"
                            />

                            <Input
                                label="Email de Contacto *"
                                type="email"
                                value={formData.emailContact}
                                onChange={(e) => setFormData({ ...formData, emailContact: e.target.value })}
                                required
                                placeholder="Ej: reclutamiento@empresa.com"
                            />

                            <Input
                                label="Ubicación *"
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                                placeholder="Ej: Monterrey, Nuevo León"
                            />

                            <Select
                                label="Sector Industrial *"
                                value={formData.industrialSector}
                                onChange={(e) => setFormData({ ...formData, industrialSector: e.target.value })}
                                required
                            >
                                <option value="">Selecciona un sector</option>
                                {INDUSTRIAL_SECTORS.map((sector) => (
                                    <option key={sector} value={sector}>
                                        {sector}
                                    </option>
                                ))}
                            </Select>

                            <Input
                                label="Sitio Web (opcional)"
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                placeholder="Ej: https://www.empresa.com"
                            />

                            {error && (
                                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? 'Creando perfil...' : 'Crear Perfil'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
