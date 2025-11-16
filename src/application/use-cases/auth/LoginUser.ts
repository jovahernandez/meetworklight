import { IAuthService, LoginCredentials, AuthSession } from '@/ports/services/IAuthService';
import { ValidationError } from '@/domain/errors/ValidationError';

export class LoginUser {
    constructor(private authService: IAuthService) { }

    async execute(credentials: LoginCredentials): Promise<AuthSession> {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.email)) {
            throw new ValidationError('Invalid email format', 'email');
        }

        if (!credentials.password) {
            throw new ValidationError('Password is required', 'password');
        }

        return await this.authService.login(credentials);
    }
}
