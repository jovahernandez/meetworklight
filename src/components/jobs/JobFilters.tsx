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
        onFilterChange(newFilters);
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
        <div className="bg-white rounded-lg shadow-md border border-neutral-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                    label="Buscar"
                    placeholder="Puesto, empresa, palabras clave..."
                    value={filters.searchText}
                    onChange={(e) => handleChange('searchText', e.target.value)}
                />

                <Input
                    label="Ubicación"
                    placeholder="Ciudad, estado..."
                    value={filters.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                />

                <Input
                    label="Salario Mínimo"
                    type="number"
                    placeholder="Ej: 12000"
                    value={filters.minSalary}
                    onChange={(e) => handleChange('minSalary', e.target.value)}
                />

                <Select
                    label="Sector Industrial"
                    value={filters.industrialSector}
                    onChange={(e) => handleChange('industrialSector', e.target.value)}
                    options={[
                        { value: '', label: 'Todos los sectores' },
                        ...INDUSTRY_SECTORS.map(sector => ({ value: sector, label: sector })),
                    ]}
                />

                <Select
                    label="Área de Trabajo"
                    value={filters.jobArea}
                    onChange={(e) => handleChange('jobArea', e.target.value)}
                    options={[
                        { value: '', label: 'Todas las áreas' },
                        ...JOB_AREAS.map(area => ({ value: area, label: area })),
                    ]}
                />

                <Select
                    label="Tipo de Contrato"
                    value={filters.contractType}
                    onChange={(e) => handleChange('contractType', e.target.value as ContractType | '')}
                    options={[
                        { value: '', label: 'Todos los tipos' },
                        ...Object.entries(CONTRACT_TYPES).map(([key, label]) => ({ value: key, label })),
                    ]}
                />

                <Select
                    label="Modalidad"
                    value={filters.modality}
                    onChange={(e) => handleChange('modality', e.target.value as Modality | '')}
                    options={[
                        { value: '', label: 'Todas las modalidades' },
                        ...Object.entries(MODALITIES).map(([key, label]) => ({ value: key, label })),
                    ]}
                />
            </div>

            <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" onClick={handleReset}>
                    Limpiar Filtros
                </Button>
            </div>
        </div>
    );
}
