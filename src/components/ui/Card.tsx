import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export function Card({ children, className }: CardProps) {
    return (
        <div className={cn('bg-white rounded-lg shadow-md border border-neutral-200', className)}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className }: CardProps) {
    return (
        <div className={cn('px-6 py-4 border-b border-neutral-200', className)}>
            {children}
        </div>
    );
}

export function CardContent({ children, className }: CardProps) {
    return (
        <div className={cn('px-6 py-4', className)}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className }: CardProps) {
    return (
        <div className={cn('px-6 py-4 border-t border-neutral-200', className)}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className }: CardProps) {
    return (
        <h2 className={cn('text-xl font-semibold text-neutral-900', className)}>
            {children}
        </h2>
    );
}
