import { KycStatus } from '@/ports/services/IKycVerificationService';

interface KycStatusBadgeProps {
    status: KycStatus;
}

export function KycStatusBadge({ status }: KycStatusBadgeProps) {
    const config = {
        pending: {
            label: 'Pendiente',
            className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        },
        verified: {
            label: 'Verificado',
            className: 'bg-green-100 text-green-800 border-green-300',
        },
        rejected: {
            label: 'Rechazado',
            className: 'bg-red-100 text-red-800 border-red-300',
        },
    };

    const { label, className } = config[status];

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${className}`}>
            {label}
        </span>
    );
}
