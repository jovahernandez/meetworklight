'use client';

import { useState, useEffect } from 'react';
import { JobCard } from '@/components/jobs/JobCard';
import { JobFilters, FilterValues } from '@/components/jobs/JobFilters';
import { JobPosting } from '@/domain/entities/JobPosting';

export default function JobsPage() {
    const [jobs, setJobs] = useState<JobPosting[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/jobs');
            if (response.ok) {
                const data = await response.json();
                setJobs(data);
                setFilteredJobs(data);
            }
        } catch (error) {
            console.error('Failed to load jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filters: FilterValues) => {
        let filtered = [...jobs];

        // Búsqueda por texto - case insensitive y flexible
        if (filters.searchText) {
            const search = filters.searchText.toLowerCase().trim();
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(search) ||
                job.companyName.toLowerCase().includes(search) ||
                job.descriptionShort.toLowerCase().includes(search) ||
                job.location.toLowerCase().includes(search)
            );
        }

        // Filtro de ubicación - flexible, normaliza acentos y mayúsculas
        if (filters.location) {
            const locationSearch = normalizeString(filters.location);
            filtered = filtered.filter(job =>
                normalizeString(job.location).includes(locationSearch)
            );
        }

        // Filtro de sector industrial - exacto
        if (filters.industrialSector) {
            filtered = filtered.filter(job => job.industrialSector === filters.industrialSector);
        }

        // Filtro de área de trabajo - flexible
        if (filters.jobArea) {
            const areaSearch = normalizeString(filters.jobArea);
            filtered = filtered.filter(job =>
                normalizeString(job.jobArea).includes(areaSearch)
            );
        }

        // Filtro de tipo de contrato - exacto
        if (filters.contractType) {
            filtered = filtered.filter(job => job.contractType === filters.contractType);
        }

        // Filtro de modalidad - exacto
        if (filters.modality) {
            filtered = filtered.filter(job => job.modality === filters.modality);
        }

        // Filtro de salario mínimo - extrae números del rango y compara
        if (filters.minSalary) {
            const minSalary = parseInt(filters.minSalary);
            if (!isNaN(minSalary)) {
                filtered = filtered.filter(job => {
                    const salaryNumbers = extractSalaryNumbers(job.salaryRange || '');
                    // Si el salario máximo es mayor o igual al mínimo buscado, lo incluimos
                    return salaryNumbers.max >= minSalary;
                });
            }
        }

        setFilteredJobs(filtered);
    };

    // Función helper para normalizar strings
    const normalizeString = (str: string): string => {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
            .replace(/[.,\-_]/g, '') // Elimina puntuación
            .trim();
    };

    // Función para extraer números del rango salarial
    const extractSalaryNumbers = (salaryRange: string): { min: number; max: number } => {
        // Extrae todos los números del string (ignora $, comas, MXN, etc)
        const numbers = salaryRange.match(/\d+/g);

        if (!numbers || numbers.length === 0) {
            return { min: 0, max: 0 };
        }

        const parsedNumbers = numbers.map(n => parseInt(n.replace(/,/g, '')));

        if (parsedNumbers.length === 1) {
            return { min: parsedNumbers[0], max: parsedNumbers[0] };
        }

        return {
            min: Math.min(...parsedNumbers),
            max: Math.max(...parsedNumbers)
        };
    }; return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-heading font-bold text-neutral-900 mb-2">
                    Vacantes Disponibles
                </h1>
                <p className="text-lg text-neutral-600">
                    Explora oportunidades en el sector industrial
                </p>
            </div>

            <JobFilters onFilterChange={handleFilterChange} />

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-neutral-600">Cargando vacantes...</p>
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-neutral-600">
                        No se encontraron vacantes que coincidan con los filtros seleccionados.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 max-w-4xl mx-auto">
                    {filteredJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            )}
        </div>
    );
}
