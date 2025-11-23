import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    children: React.ReactNode;
}

export function Badge({
    variant = 'default',
    className,
    children,
    ...props
}: BadgeProps) {
    const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

    const variants = {
        default: 'bg-neutral-100 text-neutral-800',
        success: 'bg-primary text-white',
        warning: 'bg-accent text-neutral-900',
        error: 'bg-secondary-coral text-white',
        info: 'bg-secondary-teal text-white',
    };

    return (
        <div
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </div>
    );
}
