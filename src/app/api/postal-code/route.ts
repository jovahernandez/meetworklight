// API route para buscar información de código postal usando SEPOMEX
// Esta API es gratuita y proporciona datos de colonias, municipios y estados de México

import { NextRequest, NextResponse } from 'next/server';

interface ColoniaInfo {
    codigo_postal: string;
    colonia: string;
    municipio: string;
    estado: string;
    ciudad?: string;
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
        // Usar la API gratuita de SEPOMEX
        const response = await fetch(
            `https://api.copomex.com/query/info_cp/${cp}?type=simplified&token=pruebas`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            // Fallback: intentar con API alternativa
            const fallbackResponse = await fetch(
                `https://api-sepomex.hckdrk.mx/query/info_cp/${cp}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                }
            );

            if (!fallbackResponse.ok) {
                return NextResponse.json(
                    { error: 'No se encontró información para este código postal' },
                    { status: 404 }
                );
            }

            const fallbackData = await fallbackResponse.json();
            return NextResponse.json({
                success: true,
                data: formatCopomexResponse(fallbackData),
            });
        }

        const data = await response.json();

        // Formatear respuesta
        return NextResponse.json({
            success: true,
            data: formatCopomexResponse(data),
        });

    } catch (error) {
        console.error('Error fetching CP data:', error);

        // Si las APIs externas fallan, devolver datos mock para testing
        // En producción, esto debería manejarse diferente
        return NextResponse.json({
            success: true,
            data: {
                codigo_postal: cp,
                colonias: [`Colonia Centro`],
                municipio: 'Municipio',
                estado: 'Estado',
                ciudad: 'Ciudad',
            },
            warning: 'Datos de respaldo. Verifica manualmente.',
        });
    }
}

function formatCopomexResponse(data: any) {
    // La API de COPOMEX devuelve diferentes formatos
    // Normalizar la respuesta

    if (Array.isArray(data)) {
        // Formato array de colonias
        const firstItem = data[0]?.response || data[0];
        return {
            codigo_postal: firstItem?.cp || firstItem?.codigo_postal,
            colonias: data.map((item: any) => item.response?.asentamiento || item.asentamiento || item.colonia).filter(Boolean),
            municipio: firstItem?.municipio,
            estado: firstItem?.estado,
            ciudad: firstItem?.ciudad,
        };
    }

    if (data.response) {
        // Formato con response wrapper
        const items = Array.isArray(data.response) ? data.response : [data.response];
        return {
            codigo_postal: items[0]?.cp,
            colonias: items.map((item: any) => item.asentamiento).filter(Boolean),
            municipio: items[0]?.municipio,
            estado: items[0]?.estado,
            ciudad: items[0]?.ciudad,
        };
    }

    // Formato simple
    return {
        codigo_postal: data.cp || data.codigo_postal,
        colonias: data.colonias || [data.colonia || data.asentamiento].filter(Boolean),
        municipio: data.municipio,
        estado: data.estado,
        ciudad: data.ciudad,
    };
}
