'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { PostalCodeInput } from '@/components/ui/PostalCodeInput';
import { JOB_AREAS, CONTRACT_TYPES, SHIFTS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

const INDUSTRIAL_SECTORS = [
    'Construcción',
];

const MODALITIES = [
    'Presencial',
];

export default function CreateJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tasks, setTasks] = useState<string[]>(['']);
    const [sameLocation, setSameLocation] = useState(false);
    // Iteración 6: Estado para imagen
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

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

    // Iteración 6: Manejar selección de imagen
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validar tamaño (máx 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('La imagen no debe superar los 5MB');
                return;
            }
            // Validar tipo
            if (!file.type.startsWith('image/')) {
                setError('Solo se permiten archivos de imagen');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setError('');
        }
    };

    // Iteración 6: Subir imagen a Supabase Storage
    const uploadImage = async (): Promise<string | null> => {
        if (!imageFile) return null;

        setUploadingImage(true);
        try {
            const supabase = createClient();
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { data, error: uploadError } = await supabase.storage
                .from('job-images')
                .upload(fileName, imageFile);

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                throw new Error('Error al subir la imagen');
            }

            // Obtener URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('job-images')
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (err) {
            console.error('Upload error:', err);
            return null;
        } finally {
            setUploadingImage(false);
        }
    };

    // Callback memoizado para evitar re-renders infinitos en PostalCodeInput
    const handlePostalCodeChange = useCallback((data: {
        postalCode: string;
        colonia: string;
        municipio: string;
        estado: string;
        fullAddress: string;
    }) => {
        setFormData(prev => ({
            ...prev,
            worksiteLocation: data.fullAddress,
        }));
    }, []);

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
            // Iteración 6: Subir imagen primero si existe
            let imageUrl: string | null = null;
            if (imageFile) {
                imageUrl = await uploadImage();
                if (!imageUrl && imageFile) {
                    setError('Error al subir la imagen. Intenta de nuevo.');
                    setLoading(false);
                    return;
                }
            }

            // Convertir tareas a formato de lista
            const tasksList = tasks
                .filter(task => task.trim())
                .map(task => `• ${task}`)
                .join('\n');

            // Construir el rango salarial
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
                // Convertir startDate a objeto Date (formato YYYY-MM-DD del input date)
                startDate: formData.startDate ? new Date(formData.startDate + 'T00:00:00') : new Date(),
                // Iteración 3: validityDays ya viene como número del slider
                validityDays: formData.validityDays,
                // Iteración 6: URL de imagen
                imageUrl,
            };

            const response = await fetch('/api/recruiter/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSubmit),
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
        <div className="container mx-auto px-4 py-6 md:py-16">
            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <h1 className="text-xl md:text-3xl font-heading font-bold text-neutral-900">
                            Crear Nueva Vacante
                        </h1>
                        <p className="text-sm md:text-base text-neutral-600 mt-2">
                            Completa la información de la vacante que deseas publicar
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                            {/* Iteración 6: Campo de imagen prominente al inicio */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-neutral-700">
                                    Imagen de la Vacante
                                </label>
                                <p className="text-xs text-neutral-500 mb-2">
                                    Sube una imagen atractiva de tu vacante. Solo debe contener información del puesto, NO datos de contacto como teléfonos o correos.
                                </p>

                                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-4 hover:border-primary transition-colors">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setImagePreview(null);
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center cursor-pointer py-4">
                                            <svg className="w-12 h-12 text-neutral-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm text-neutral-600 font-medium">
                                                Haz clic para subir una imagen
                                            </span>
                                            <span className="text-xs text-neutral-500 mt-1">
                                                PNG, JPG hasta 5MB
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>

                                <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span>
                                        <strong>Importante:</strong> La imagen será revisada antes de publicarse. No incluyas información privada de contacto en la imagen.
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="md:col-span-2">
                                    <Input
                                        label="Título del Puesto *"
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="Ej: Operador de Maquinaria Industrial"
                                        className="text-base"
                                    />
                                </div>

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
                                    label="Ubicación *"
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                    placeholder="Ej: Monterrey, Nuevo León"
                                    className="text-base"
                                />

                                <Select
                                    label="Área de Trabajo *"
                                    value={formData.jobArea}
                                    onChange={(e) => setFormData({ ...formData, jobArea: e.target.value })}
                                    required
                                    className="text-base"
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
                                    className="text-base"
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
                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <Input
                                            label="Salario Mínimo"
                                            type="number"
                                            value={formData.salaryMin}
                                            onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                                            placeholder="Ej: 12000"
                                            min="0"
                                            className="text-base"
                                        />
                                        <Input
                                            label="Salario Máximo"
                                            type="number"
                                            value={formData.salaryMax}
                                            onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                                            placeholder="Ej: 15000"
                                            min="0"
                                            className="text-base"
                                        />
                                    </div>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        Ingresa el rango salarial mensual en pesos mexicanos (MXN)
                                    </p>
                                </div>

                                <Select
                                    label="Turno *"
                                    value={formData.shift}
                                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                                    required
                                    className="text-base"
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
                                    className="w-full px-3 py-2 text-base border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                <p className="text-xs text-neutral-500">
                                    {formData.descriptionShort.length}/200 caracteres
                                </p>
                            </div>

                            <div className="space-y-3 md:space-y-4">
                                <label className="block text-sm font-medium text-neutral-700">
                                    Responsabilidades y Tareas del Puesto *
                                </label>
                                <p className="text-xs text-neutral-500">
                                    Agrega las tareas y responsabilidades principales del puesto (una por línea)
                                </p>

                                {tasks.map((task, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            type="text"
                                            value={task}
                                            onChange={(e) => updateTask(index, e.target.value)}
                                            placeholder={`Tarea ${index + 1}: Ej: Operar maquinaria pesada siguiendo normas de seguridad`}
                                            className="flex-1 text-base"
                                        />
                                        {tasks.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => removeTask(index)}
                                                className="text-red-600 hover:text-red-700 px-3"
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
                                    className="w-full py-3 text-base"
                                >
                                    + Agregar otra tarea
                                </Button>
                            </div>

                            {/* Iteración 2: Sección de Datos de Seguridad */}
                            <div className="border-t pt-6 mt-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                                    📋 Datos de Seguridad de la Vacante
                                </h3>
                                <p className="text-sm text-neutral-600 mb-6">
                                    Esta información genera confianza en los candidatos y mejora la calidad de las aplicaciones
                                </p>

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
                                            className="text-base"
                                        />

                                        <Input
                                            label="Teléfono de la Empresa *"
                                            type="tel"
                                            value={formData.companyPhone}
                                            onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                                            required
                                            placeholder="Ej: +52 81 1234 5678"
                                            className="text-base"
                                        />
                                    </div>

                                    <Input
                                        label="Ubicación de la Empresa *"
                                        type="text"
                                        value={formData.companyLocation}
                                        onChange={(e) => setFormData({ ...formData, companyLocation: e.target.value })}
                                        required
                                        placeholder="Ej: Monterrey, Nuevo León"
                                        className="text-base"
                                    />

                                    {/* Iteración 6: Código Postal de la Obra con autocompletado */}
                                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                        <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Ubicación de la Obra (Autocompletado por CP)
                                        </h4>
                                        <PostalCodeInput
                                            onAddressChange={handlePostalCodeChange}
                                            label="Código Postal de la Obra *"
                                            required={true}
                                        />
                                    </div>

                                    <Input
                                        label="Ubicación de la Obra / Sitio de Trabajo *"
                                        type="text"
                                        value={formData.worksiteLocation}
                                        onChange={(e) => setFormData({ ...formData, worksiteLocation: e.target.value })}
                                        required
                                        placeholder="Se autocompleta con el CP o escribe manualmente"
                                        className="text-base"
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
                                        className="text-base"
                                    />
                                    <p className="text-xs text-neutral-500 -mt-2">
                                        Copia el enlace desde Google Maps para que los candidatos puedan verificar la ubicación
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="WhatsApp del Contratante *"
                                            type="tel"
                                            value={formData.contractorPhoneWhatsapp}
                                            onChange={(e) => setFormData({ ...formData, contractorPhoneWhatsapp: e.target.value })}
                                            required
                                            placeholder="Ej: +52 81 9876 5432"
                                            className="text-base"
                                        />

                                        <Input
                                            label="Fecha de Inicio de Actividades *"
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            required
                                            className="text-base"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Iteración 3: Vigencia y urgencia */}
                            <div className="bg-orange-50 rounded-lg p-4 md:p-6 border border-orange-200">
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <Input
                                    label="Teléfono de Contacto *"
                                    type="tel"
                                    value={formData.contactPhone}
                                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                    required
                                    placeholder="Ej: +52 81 1234 5678"
                                    className="text-base"
                                />

                                <Input
                                    label="Email de Contacto *"
                                    type="email"
                                    value={formData.contactEmail}
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    required
                                    placeholder="Ej: reclutamiento@empresa.com"
                                    className="text-base"
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full sm:flex-1 py-3 text-base font-medium"
                                    onClick={() => router.back()}
                                    disabled={loading || uploadingImage}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full sm:flex-1 py-3 text-base font-medium"
                                    disabled={loading || uploadingImage}
                                >
                                    {uploadingImage ? 'Subiendo imagen...' : loading ? 'Publicando...' : 'Publicar Vacante'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
