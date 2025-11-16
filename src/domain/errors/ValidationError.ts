import { DomainError } from './DomainError';

export class ValidationError extends DomainError {
    public readonly field?: string;

    constructor(message: string, field?: string) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
