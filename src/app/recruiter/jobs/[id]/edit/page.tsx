'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { JOB_AREAS, CONTRACT_TYPES, SHIFTS } from '@/lib/constants';

const INDUSTRIAL_SECTORS = ['Construcción'];
const MODALITIES = ['Presencial'];

export default function EditJobPage() {
    const router = useRouter();
    const params = useParams();
    const jobId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetchingJob, setFetchingJob] = useState(true);
    const [error, setError] = useState('');
    const [tasks, setTasks] = useState<string[]>(['']);
    const [sameLocation, setSameLocation] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        companyName: '',
        location: '',
        industrialSector: 'Construcción',
        jobArea: '',
        contractType: '',
        modality: 'Presencial',
        salaryMin: '',
        salaryMax: '',
        shift: '',
        descriptionShort: '',
        descriptionLong: '',
        contactPhone: '',
        contactEmail: '',
        // Iteración 2: Datos de seguridad
        companyRfc: '',
        companyLocation: '',
        worksiteLocation: '',
        worksiteGoogleMapsUrl: '',
        contractorPhoneWhatsapp: '',
        companyPhone: '',
        startDate: '',
        // Iteración 3: Vigencia
        validityDays: 30,
    });

    useEffect(() => {
        if (jobId) {
            fetchJob();
        }
    }, [jobId]);

    const fetchJob = async () => {
        try {
            const response = await fetch(`/api/recruiter/jobs/${jobId}`);
            const data = await response.json();

            if (response.ok) {
                const job = data.data;

                // Extraer tareas de la descripción
                const taskLines = job.descriptionLong?.split('\n').map((line: string) => line.replace('• ', '').trim()).filter((line: string) => line) || [''];
                setTasks(taskLines.length > 0 ? taskLines : ['']);

                // Extraer salario min/max del rango
                const salaryMatch = job.salaryRange?.match(/\$?(\d+,?\d*)\s*-\s*\$?(\d+,?\d*)/);
                const salaryMin = salaryMatch ? salaryMatch[1].replace(/,/g, '') : '';
                const salaryMax = salaryMatch ? salaryMatch[2].replace(/,/g, '') : '';

                setFormData({
                    title: job.title,
                    companyName: job.companyName,
                    location: job.location,
                    industrialSector: job.industrialSector,
                    jobArea: job.jobArea,
                    contractType: job.contractType,
                    modality: job.modality,
                    salaryMin,
                    salaryMax,
                    shift: job.shift,
                    descriptionShort: job.descriptionShort,
                    descriptionLong: job.descriptionLong,
                    contactPhone: job.contactPhone,
                    contactEmail: job.contactEmail,
                    // Iteración 2: Datos de seguridad
                    companyRfc: job.companyRfc || '',
                    companyLocation: job.companyLocation || '',
                    worksiteLocation: job.worksiteLocation || '',
                    worksiteGoogleMapsUrl: job.worksiteGoogleMapsUrl || '',
                    contractorPhoneWhatsapp: job.contractorPhoneWhatsapp || '',
                    companyPhone: job.companyPhone || '',
                    startDate: job.startDate ? new Date(job.startDate).toISOString().split('T')[0] : '',
                    // Iteración 3: Vigencia
                    validityDays: job.validityDays || 30,
                });
            } else {
                setError('No se pudo cargar la vacante');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setFetchingJob(false);
        }
    };

    const addTask = () => {
        setTasks([...tasks, '']);
    };

    const removeTask = (index: number) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    const updateTask = (index: number, value: string) => {
        const newTasks = [...tasks];
        newTasks[index] = value;
        setTasks(newTasks);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const tasksList = tasks
                .filter(task => task.trim())
                .map(task => `• ${task}`)
                .join('\n');

            const salaryRange = formData.salaryMin && formData.salaryMax
                ? `$${formData.salaryMin} - $${formData.salaryMax} MXN`
                : formData.salaryMin
                    ? `Desde $${formData.salaryMin} MXN`
                    : formData.salaryMax
                        ? `Hasta $${formData.salaryMax} MXN`
                        : 'A convenir';

            const dataToSubmit = {
                ...formData,
                descriptionLong: tasksList,
                salaryRange,
                // Convertir startDate a objeto Date
                startDate: formData.startDate ? new Date(formData.startDate) : undefined,
                // Iteración 3: validityDays ya viene como número del slider
                validityDays: formData.validityDays,
            };

            const response = await fetch(`/api/recruiter/jobs/${jobId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSubmit),
            });

            const data = await response.json();

            if (response.ok) {
                router.push(`/recruiter/jobs/${jobId}`);
                router.refresh();
            } else {
                setError(data.error || 'Error al actualizar vacante');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingJob) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-neutral-600">Cargando vacante...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <h1 className="text-3xl font-heading font-bold text-neutral-900">
                            Editar Vacante
                        </h1>
                        <p className="text-neutral-600 mt-2">
                            Modifica la información de la vacante
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
                                    />
                                </div>

                                <Input
                                    label="Nombre de la Empresa *"
                                    type="text"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    required
                                />

                                <Input
                                    label="Ubicación *"
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />

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

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Rango Salarial Mensual *
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Salario Mínimo"
                                            type="number"
                                            value={formData.salaryMin}
                                            onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                                            placeholder="Ej: 12000"
                                            min="0"
                                        />
                                        <Input
                                            label="Salario Máximo"
                                            type="number"
                                            value={formData.salaryMax}
                                            onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                                            placeholder="Ej: 15000"
                                            min="0"
                                        />
                                    </div>
                                </div>

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
                                    maxLength={200}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-neutral-700">
                                    Responsabilidades y Tareas del Puesto *
                                </label>

                                {tasks.map((task, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            type="text"
                                            value={task}
                                            onChange={(e) => updateTask(index, e.target.value)}
                                            placeholder={`Tarea ${index + 1}`}
                                            className="flex-1"
                                        />
                                        {tasks.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => removeTask(index)}
                                                className="text-red-600"
                                            >
                                                ✕
                                            </Button>
                                        )}
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addTask}
                                    className="w-full"
                                >
                                    + Agregar otra tarea
                                </Button>
                            </div>

                            {/* Iteración 2: Sección de Datos de Seguridad */}
                            <div className="border-t pt-6 mt-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                                    📋 Datos de Seguridad de la Vacante
                                </h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="RFC de la Empresa *"
                                            type="text"
                                            value={formData.companyRfc}
                                            onChange={(e) => setFormData({ ...formData, companyRfc: e.target.value.toUpperCase() })}
                                            required
                                            placeholder="Ej: ABC123456XXX"
                                            maxLength={13}
                                        />

                                        <Input
                                            label="Teléfono de la Empresa *"
                                            type="tel"
                                            value={formData.companyPhone}
                                            onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                                            required
                                            placeholder="Ej: +52 81 1234 5678"
                                        />
                                    </div>

                                    <Input
                                        label="Ubicación de la Empresa *"
                                        type="text"
                                        value={formData.companyLocation}
                                        onChange={(e) => setFormData({ ...formData, companyLocation: e.target.value })}
                                        required
                                        placeholder="Ej: Monterrey, Nuevo León"
                                    />

                                    <Input
                                        label="Ubicación de la Obra / Sitio de Trabajo *"
                                        type="text"
                                        value={formData.worksiteLocation}
                                        onChange={(e) => setFormData({ ...formData, worksiteLocation: e.target.value })}
                                        required
                                        placeholder="Ej: San Pedro Garza García, N.L."
                                    />

                                    <label className="flex items-center gap-2 text-sm text-neutral-700">
                                        <input
                                            type="checkbox"
                                            checked={sameLocation}
                                            onChange={(e) => {
                                                setSameLocation(e.target.checked);
                                                if (e.target.checked) {
                                                    setFormData({ ...formData, worksiteLocation: formData.companyLocation });
                                                }
                                            }}
                                            className="rounded border-neutral-300"
                                        />
                                        La obra está en la misma ubicación que la empresa
                                    </label>

                                    <Input
                                        label={`Link de Google Maps del Sitio de Trabajo ${formData.modality === 'Remoto' ? '(opcional)' : '*'}`}
                                        type="url"
                                        value={formData.worksiteGoogleMapsUrl}
                                        onChange={(e) => setFormData({ ...formData, worksiteGoogleMapsUrl: e.target.value })}
                                        required={formData.modality !== 'Remoto'}
                                        placeholder="Ej: https://maps.app.goo.gl/..."
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="WhatsApp del Contratante *"
                                            type="tel"
                                            value={formData.contractorPhoneWhatsapp}
                                            onChange={(e) => setFormData({ ...formData, contractorPhoneWhatsapp: e.target.value })}
                                            required
                                            placeholder="Ej: +52 81 9876 5432"
                                        />

                                        <Input
                                            label="Fecha de Inicio de Actividades *"
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Iteración 3: Vigencia y urgencia */}
                            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                                <div>
                                    <div className="flex items-start mb-3">
                                        <span className="text-2xl mr-2">⏱</span>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-neutral-800">
                                                Duración y nivel de urgencia
                                            </h3>
                                            <p className="text-sm text-neutral-600 mt-1">
                                                Elige cuántos días estará activa tu vacante. Las vacantes urgentes reciben más visibilidad.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Vigencia de la vacante: {formData.validityDays} días
                                            </label>
                                            <input
                                                type="range"
                                                min="7"
                                                max="30"
                                                step="1"
                                                value={formData.validityDays}
                                                onChange={(e) => setFormData({ ...formData, validityDays: parseInt(e.target.value) })}
                                                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-accent"
                                            />
                                            <div className="flex justify-between text-xs text-neutral-500 mt-1">
                                                <span>7 días</span>
                                                <span>30 días</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white p-3 rounded border border-neutral-200">
                                                <p className="text-sm font-medium text-neutral-700">
                                                    Nivel de urgencia:
                                                </p>
                                                <p className={`text-lg font-bold mt-1 ${formData.validityDays <= 10
                                                    ? 'text-red-600'
                                                    : formData.validityDays <= 20
                                                        ? 'text-yellow-600'
                                                        : 'text-green-600'
                                                    }`}>
                                                    {formData.validityDays <= 10
                                                        ? '🔴 Alta'
                                                        : formData.validityDays <= 20
                                                            ? '🟡 Media'
                                                            : '🟢 Baja'}
                                                </p>
                                            </div>

                                            <div className="bg-white p-3 rounded border border-neutral-200">
                                                <p className="text-sm font-medium text-neutral-700">
                                                    Activa hasta:
                                                </p>
                                                <p className="text-lg font-bold text-neutral-800 mt-1">
                                                    {new Date(Date.now() + formData.validityDays * 24 * 60 * 60 * 1000).toLocaleDateString('es-MX', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-xs text-neutral-600 italic">
                                            💡 Tip: Las vacantes con urgencia alta (7-10 días) aparecen destacadas para los candidatos.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <Input
                                    label="Teléfono de Contacto *"
                                    type="tel"
                                    value={formData.contactPhone}
                                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                    required
                                />

                                <Input
                                    label="Email de Contacto *"
                                    type="email"
                                    value={formData.contactEmail}
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    required
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
                                    onClick={() => router.push(`/recruiter/jobs/${jobId}`)}
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
                                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
