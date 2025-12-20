'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface PostalCodeData {
    codigo_postal: string;
    colonias: string[];
    municipio: string;
    estado: string;
    ciudad?: string;
}

interface PostalCodeInputProps {
    onAddressChange: (data: {
        postalCode: string;
        colonia: string;
        municipio: string;
        estado: string;
        fullAddress: string;
    }) => void;
    initialPostalCode?: string;
    initialColonia?: string;
    label?: string;
    required?: boolean;
}

export function PostalCodeInput({
    onAddressChange,
    initialPostalCode = '',
    initialColonia = '',
    label = 'Código Postal',
    required = false,
}: PostalCodeInputProps) {
    const [postalCode, setPostalCode] = useState(initialPostalCode);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState<PostalCodeData | null>(null);
    const [selectedColonia, setSelectedColonia] = useState(initialColonia);

    // Usar ref para evitar llamadas infinitas al callback
    const lastNotifiedRef = useRef<string>('');

    const fetchPostalCodeData = useCallback(async (cp: string) => {
        if (cp.length !== 5) {
            setData(null);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/postal-code?cp=${cp}`);
            const result = await response.json();

            if (response.ok && result.success) {
                setData(result.data);
                // Auto-seleccionar la primera colonia si hay solo una
                if (result.data.colonias?.length === 1) {
                    setSelectedColonia(result.data.colonias[0]);
                } else {
                    setSelectedColonia('');
                }

                // Mostrar advertencia si son datos de respaldo
                if (result.warning) {
                    setError(result.warning);
                }
            } else {
                setError(result.error || 'No se encontró el código postal');
                setData(null);
            }
        } catch (err) {
            setError('Error al buscar código postal. Ingresa la dirección manualmente.');
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Buscar cuando el CP tenga 5 dígitos
    useEffect(() => {
        if (postalCode.length === 5 && /^\d{5}$/.test(postalCode)) {
            fetchPostalCodeData(postalCode);
        }
    }, [postalCode, fetchPostalCodeData]);

    // Notificar cambios al componente padre - SOLO cuando realmente cambia
    useEffect(() => {
        if (data && selectedColonia) {
            const fullAddress = `${selectedColonia}, ${data.municipio}, ${data.estado}, CP ${postalCode}`;

            // Solo notificar si la dirección cambió
            if (lastNotifiedRef.current !== fullAddress) {
                lastNotifiedRef.current = fullAddress;
                onAddressChange({
                    postalCode,
                    colonia: selectedColonia,
                    municipio: data.municipio,
                    estado: data.estado,
                    fullAddress,
                });
            }
        }
    }, [data, selectedColonia, postalCode]); // Removido onAddressChange de deps para evitar loops

    const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 5);
        setPostalCode(value);
        if (value.length < 5) {
            setData(null);
            setSelectedColonia('');
            setError('');
        }
    };

    const handleColoniaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedColonia(e.target.value);
    };

    return (
        <div className="space-y-4">
            {/* Input de Código Postal */}
            <div className="relative">
                <Input
                    label={label}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={postalCode}
                    onChange={handlePostalCodeChange}
                    placeholder="Ej: 64000"
                    maxLength={5}
                    required={required}
                    className="text-base"
                />
                {loading && (
                    <div className="absolute right-3 top-9">
                        <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}
            </div>

            {error && (
                <p className={`text-sm ${error.includes('respaldo') || error.includes('manualmente') ? 'text-amber-600' : 'text-red-600'}`}>
                    {error}
                </p>
            )}

            {/* Mostrar datos encontrados */}
            {data && (
                <div className="bg-neutral-50 rounded-lg p-4 space-y-3 border border-neutral-200">
                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Código postal encontrado
                    </div>

                    {/* Selector de Colonia */}
                    {data.colonias && data.colonias.length > 1 ? (
                        <Select
                            label="Colonia *"
                            value={selectedColonia}
                            onChange={handleColoniaChange}
                            required={required}
                            className="text-base"
                        >
                            <option value="">Selecciona una colonia</option>
                            {data.colonias.map((colonia, index) => (
                                <option key={index} value={colonia}>
                                    {colonia}
                                </option>
                            ))}
                        </Select>
                    ) : data.colonias?.length === 1 ? (
                        <div>
                            <p className="text-xs text-neutral-500 mb-1">Colonia</p>
                            <p className="font-medium text-neutral-900">{data.colonias[0]}</p>
                        </div>
                    ) : null}

                    {/* Municipio y Estado (solo lectura) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-neutral-500 mb-1">Municipio/Alcaldía</p>
                            <p className="font-medium text-neutral-900">{data.municipio || 'No disponible'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-500 mb-1">Estado</p>
                            <p className="font-medium text-neutral-900">{data.estado || 'No disponible'}</p>
                        </div>
                    </div>

                    {data.ciudad && data.ciudad !== data.municipio && (
                        <div>
                            <p className="text-xs text-neutral-500 mb-1">Ciudad</p>
                            <p className="font-medium text-neutral-900">{data.ciudad}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Hint de ayuda */}
            {!data && !loading && !error && postalCode.length < 5 && (
                <p className="text-xs text-neutral-500">
                    Ingresa el código postal de 5 dígitos para autocompletar la dirección
                </p>
            )}
        </div>
    );
}
