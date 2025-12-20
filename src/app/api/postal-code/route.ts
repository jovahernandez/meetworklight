// API route para buscar información de código postal mexicano
// Usa Zippopotam.us como fuente principal (gratuita y confiable)

import { NextRequest, NextResponse } from 'next/server';

interface PostalCodeData {
    codigo_postal: string;
    colonias: string[];
    municipio: string;
    estado: string;
    ciudad: string;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const cp = searchParams.get('cp');

    if (!cp || cp.length !== 5 || !/^\d{5}$/.test(cp)) {
        return NextResponse.json(
            { error: 'Código postal inválido. Debe ser de 5 dígitos.' },
            { status: 400 }
        );
    }

    try {
        // Usar Zippopotam.us - API gratuita y confiable
        const data = await fetchFromZippopotam(cp);

        if (!data) {
            return NextResponse.json({
                success: false,
                error: 'No se encontró información para este código postal.',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data,
        });

    } catch (error) {
        console.error('Error fetching CP data:', error);
        return NextResponse.json({
            success: false,
            error: 'Error al buscar el código postal. Intenta de nuevo.',
        }, { status: 500 });
    }
}

// Zippopotam.us - API gratuita para códigos postales mundiales
async function fetchFromZippopotam(cp: string): Promise<PostalCodeData | null> {
    try {
        const response = await fetch(
            `https://api.zippopotam.us/mx/${cp}`,
            {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                signal: AbortSignal.timeout(5000),
            }
        );

        // 404 significa que el CP no existe
        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (!data.places || data.places.length === 0) {
            return null;
        }

        // Extraer colonias (place names)
        const colonias = data.places.map((place: any) => place['place name']).filter(Boolean);

        // El estado viene del primer lugar
        const estado = data.places[0].state || '';

        // Determinar el municipio/ciudad
        // Zippopotam no da municipio directamente, usamos el primer lugar como referencia
        const municipio = inferMunicipio(colonias, estado);

        return {
            codigo_postal: cp,
            colonias,
            municipio,
            estado,
            ciudad: municipio,
        };
    } catch (e) {
        console.error('Zippopotam API error:', e);
        return null;
    }
}

// Función auxiliar para inferir el municipio basado en las colonias
function inferMunicipio(colonias: string[], estado: string): string {
    // Si hay una colonia que termina en "Centro", probablemente es el municipio
    const centroColonia = colonias.find((c: string) =>
        c.toLowerCase().includes('centro') ||
        c.toLowerCase().includes('downtown')
    );

    if (centroColonia) {
        // Extraer el nombre del municipio del "XXX Centro"
        const match = centroColonia.match(/^(.+?)\s*Centro/i);
        if (match) {
            return match[1].trim();
        }
    }

    // Si no, usar el estado como fallback o la primera colonia
    if (colonias.length > 0) {
        const firstColonia = colonias[0];
        return firstColonia
            .replace(/\s*(Norte|Sur|Oriente|Poniente|Centro)$/i, '')
            .trim() || estado;
    }

    return estado;
}
