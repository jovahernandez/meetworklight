'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface KycVerificationButtonProps {
    onStartVerification: () => Promise<void>;
    disabled?: boolean;
}

export function KycVerificationButton({ onStartVerification, disabled }: KycVerificationButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        try {
            await onStartVerification();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleClick}
            disabled={disabled || loading}
            className="w-full sm:w-auto"
        >
            {loading ? 'Iniciando...' : '🔒 Iniciar Verificación de Identidad'}
        </Button>
    );
}
