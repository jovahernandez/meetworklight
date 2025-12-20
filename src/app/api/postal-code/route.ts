// API route para buscar información de código postal usando SEPOMEX
// Usa múltiples APIs de respaldo para mayor confiabilidad

import { NextRequest, NextResponse } from 'next/server';

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
        // Intentar con API 1: api-sepomex.hckdrk.mx (más confiable)
        let data = await tryAPI1(cp);
        
        if (!data) {
            // Fallback a API 2: copomex.com
            data = await tryAPI2(cp);
        }
        
        if (!data) {
            // Si ninguna API funciona, devolver error claro
            return NextResponse.json({
                success: true,
                data: {
                    codigo_postal: cp,
                    colonias: [],
                    municipio: '',
                    estado: '',
                    ciudad: '',
                },
                warning: 'No se pudo obtener información del CP. Ingresa la dirección manualmente.',
            });
        }

        return NextResponse.json({
            success: true,
            data,
        });

    } catch (error) {
        console.error('Error fetching CP data:', error);
        return NextResponse.json({
            success: true,
            data: {
                codigo_postal: cp,
                colonias: [],
                municipio: '',
                estado: '',
                ciudad: '',
            },
            warning: 'Error de conexión. Ingresa la dirección manualmente.',
        });
    }
}

// API 1: api-sepomex.hckdrk.mx
async function tryAPI1(cp: string): Promise<any | null> {
    try {
        const response = await fetch(
            `https://api-sepomex.hckdrk.mx/query/info_cp/${cp}`,
            {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                signal: AbortSignal.timeout(5000), // 5 segundos timeout
            }
        );

        if (!response.ok) return null;

        const data = await response.json();
        
        if (data.error || !data.response) return null;

        // Formatear respuesta
        const items = Array.isArray(data.response) ? data.response : [data.response];
        
        if (!items.length || !items[0]) return null;

        return {
            codigo_postal: cp,
            colonias: items.map((item: any) => item.asentamiento).filter(Boolean),
            municipio: items[0].municipio || '',
            estado: items[0].estado || '',
            ciudad: items[0].ciudad || items[0].municipio || '',
        };
    } catch (e) {
        console.log('API1 failed:', e);
        return null;
    }
}

// API 2: copomex.com (con token de pruebas)
async function tryAPI2(cp: string): Promise<any | null> {
    try {
        const response = await fetch(
            `https://api.copomex.com/query/info_cp/${cp}?token=pruebas`,
            {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                signal: AbortSignal.timeout(5000),
            }
        );

        if (!response.ok) return null;

        const data = await response.json();
        
        if (data.error || !data.response) return null;

        const items = Array.isArray(data.response) ? data.response : [data.response];
        
        if (!items.length || !items[0]) return null;

        return {
            codigo_postal: cp,
            colonias: items.map((item: any) => item.asentamiento).filter(Boolean),
            municipio: items[0].municipio || '',
            estado: items[0].estado || '',
            ciudad: items[0].ciudad || items[0].municipio || '',
        };
    } catch (e) {
        console.log('API2 failed:', e);
        return null;
    }
}
