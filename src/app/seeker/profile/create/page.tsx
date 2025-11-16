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
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        location: '',
        preferredSector: '',
        experienceLevel: '',
        skills: '',
        bio: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/seeker/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect to jobs page after successful profile creation
                router.push('/jobs');
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
                            Crear Perfil de Buscador
                        </h1>
                        <p className="text-neutral-600 mt-2">
                            Completa tu información para encontrar las mejores oportunidades
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Nombre Completo *"
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                                placeholder="Ej: María González López"
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
                                label="Ubicación *"
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                                placeholder="Ej: Monterrey, Nuevo León"
                            />

                            <Select
                                label="Sector Industrial Preferido *"
                                value={formData.preferredSector}
                                onChange={(e) => setFormData({ ...formData, preferredSector: e.target.value })}
                                required
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
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? 'Creando perfil...' : 'Completar Perfil'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
