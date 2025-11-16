import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
    public readonly resource: string;

    constructor(resource: string, identifier?: string) {
        const message = identifier
            ? `${resource} with identifier ${identifier} not found`
            : `${resource} not found`;
        super(message);
        this.name = 'NotFoundError';
        this.resource = resource;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
