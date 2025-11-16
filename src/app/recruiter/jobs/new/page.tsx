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

const JOB_AREAS = [
    'Operaciones',
    'Producción',
    'Mantenimiento',
    'Calidad',
    'Supervisión',
    'Almacén',
    'Logística',
    'Seguridad',
    'Administración',
    'Técnico',
];

const CONTRACT_TYPES = [
    'Tiempo Completo',
    'Medio Tiempo',
    'Por Proyecto',
    'Temporal',
    'Prácticas',
];

const MODALITIES = [
    'Presencial',
    'Remoto',
    'Híbrido',
];

const SHIFTS = [
    'Diurno',
    'Nocturno',
    'Mixto',
    'Rotativo',
];

export default function CreateJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        companyName: '',
        location: '',
        industrialSector: '',
        jobArea: '',
        contractType: '',
        modality: '',
        salaryRange: '',
        shift: '',
        descriptionShort: '',
        descriptionLong: '',
        contactPhone: '',
        contactEmail: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/recruiter/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/recruiter/jobs');
                router.refresh();
            } else {
                setError(data.error || 'Error al crear vacante');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <h1 className="text-3xl font-heading font-bold text-neutral-900">
                            Crear Nueva Vacante
                        </h1>
                        <p className="text-neutral-600 mt-2">
                            Completa la información de la vacante que deseas publicar
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <Input
                                        label="Título del Puesto *"
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="Ej: Operador de Maquinaria Industrial"
                                    />
                                </div>

                                <Input
                                    label="Nombre de la Empresa *"
                                    type="text"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    required
                                    placeholder="Ej: Industrias del Norte SA"
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

                                <Select
                                    label="Área de Trabajo *"
                                    value={formData.jobArea}
                                    onChange={(e) => setFormData({ ...formData, jobArea: e.target.value })}
                                    required
                                >
                                    <option value="">Selecciona un área</option>
                                    {JOB_AREAS.map((area) => (
                                        <option key={area} value={area}>
                                            {area}
                                        </option>
                                    ))}
                                </Select>

                                <Select
                                    label="Tipo de Contrato *"
                                    value={formData.contractType}
                                    onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                                    required
                                >
                                    <option value="">Selecciona tipo</option>
                                    {CONTRACT_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </Select>

                                <Select
                                    label="Modalidad *"
                                    value={formData.modality}
                                    onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                                    required
                                >
                                    <option value="">Selecciona modalidad</option>
                                    {MODALITIES.map((mod) => (
                                        <option key={mod} value={mod}>
                                            {mod}
                                        </option>
                                    ))}
                                </Select>

                                <Input
                                    label="Rango Salarial *"
                                    type="text"
                                    value={formData.salaryRange}
                                    onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                                    required
                                    placeholder="Ej: $12,000 - $15,000 MXN"
                                />

                                <Select
                                    label="Turno *"
                                    value={formData.shift}
                                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                                    required
                                >
                                    <option value="">Selecciona turno</option>
                                    {SHIFTS.map((shift) => (
                                        <option key={shift} value={shift}>
                                            {shift}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-neutral-700">
                                    Descripción Corta *
                                </label>
                                <textarea
                                    value={formData.descriptionShort}
                                    onChange={(e) => setFormData({ ...formData, descriptionShort: e.target.value })}
                                    required
                                    placeholder="Descripción breve de la vacante (máx. 200 caracteres)"
                                    maxLength={200}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                <p className="text-xs text-neutral-500">
                                    {formData.descriptionShort.length}/200 caracteres
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-neutral-700">
                                    Descripción Completa *
                                </label>
                                <textarea
                                    value={formData.descriptionLong}
                                    onChange={(e) => setFormData({ ...formData, descriptionLong: e.target.value })}
                                    required
                                    placeholder="Descripción detallada: responsabilidades, requisitos, beneficios..."
                                    rows={8}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <Input
                                    label="Teléfono de Contacto *"
                                    type="tel"
                                    value={formData.contactPhone}
                                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                    required
                                    placeholder="Ej: +52 81 1234 5678"
                                />

                                <Input
                                    label="Email de Contacto *"
                                    type="email"
                                    value={formData.contactEmail}
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    required
                                    placeholder="Ej: reclutamiento@empresa.com"
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={() => router.back()}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="flex-1"
                                    disabled={loading}
                                >
                                    {loading ? 'Publicando...' : 'Publicar Vacante'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
