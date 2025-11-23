'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import {
    INDUSTRY_SECTORS,
    JOB_AREAS,
    CONTRACT_TYPES,
    MODALITIES,
    COMMON_LOCATIONS
} from '@/lib/constants';
import { ContractType, Modality } from '@/domain/entities/JobPosting';

export interface FilterValues {
    searchText: string;
    location: string;
    industrialSector: string;
    jobArea: string;
    contractType: ContractType | '';
    modality: Modality | '';
    minSalary: string;
}

interface JobFiltersProps {
    onFilterChange: (filters: FilterValues) => void;
}

export function JobFilters({ onFilterChange }: JobFiltersProps) {
    const [filters, setFilters] = useState<FilterValues>({
        searchText: '',
        location: '',
        industrialSector: '',
        jobArea: '',
        contractType: '',
        modality: '',
        minSalary: '',
    });

    const handleChange = (field: keyof FilterValues, value: string) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        // Ya no aplicamos filtros automáticamente
    };

    const handleSearch = () => {
        // Aplicar filtros solo cuando se presiona el botón
        onFilterChange(filters);
    };

    const handleReset = () => {
        const resetFilters: FilterValues = {
            searchText: '',
            location: '',
            industrialSector: '',
            jobArea: '',
            contractType: '',
            modality: '',
            minSalary: '',
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-neutral-200 p-4 md:p-6 mb-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 md:hidden">Filtros de Búsqueda</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <Input
                    label="Buscar"
                    placeholder="Puesto, empresa..."
                    value={filters.searchText}
                    onChange={(e) => handleChange('searchText', e.target.value)}
                    className="text-base"
                />

                <Input
                    label="Ubicación"
                    placeholder="Ciudad, estado..."
                    value={filters.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="text-base"
                />

                <Input
                    label="Salario Mínimo"
                    type="number"
                    placeholder="Ej: 12000"
                    value={filters.minSalary}
                    onChange={(e) => handleChange('minSalary', e.target.value)}
                    className="text-base"
                />

                <Select
                    label="Área de Trabajo"
                    value={filters.jobArea}
                    onChange={(e) => handleChange('jobArea', e.target.value)}
                    options={[
                        { value: '', label: 'Todas las áreas' },
                        ...JOB_AREAS.map(area => ({ value: area, label: area })),
                    ]}
                    className="text-base"
                />

                <Select
                    label="Tipo de Contrato"
                    value={filters.contractType}
                    onChange={(e) => handleChange('contractType', e.target.value as ContractType | '')}
                    options={[
                        { value: '', label: 'Todos los tipos' },
                        ...CONTRACT_TYPES.map(type => ({ value: type, label: type })),
                    ]}
                    className="text-base"
                />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-between gap-2 sm:gap-3">
                <Button
                    variant="ghost"
                    size="md"
                    onClick={handleReset}
                    className="w-full sm:w-auto order-2 sm:order-1"
                >
                    Limpiar Filtros
                </Button>
                <Button
                    variant="primary"
                    size="md"
                    onClick={handleSearch}
                    className="w-full sm:w-auto order-1 sm:order-2 text-base py-3"
                >
                    🔍 Buscar
                </Button>
            </div>
        </div>
    );
}
