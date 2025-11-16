import { IAuthService, RegisterCredentials } from '@/ports/services/IAuthService';
import { IUserRepository } from '@/ports/repositories/IUserRepository';
import { User, UserRole } from '@/domain/entities/User';
import { ValidationError } from '@/domain/errors/ValidationError';

export class RegisterUser {
    constructor(
        private authService: IAuthService,
        private userRepository: IUserRepository
    ) { }

    async execute(credentials: RegisterCredentials): Promise<User> {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.email)) {
            throw new ValidationError('Invalid email format', 'email');
        }

        // Validate password strength
        if (credentials.password.length < 8) {
            throw new ValidationError('Password must be at least 8 characters long', 'password');
        }

        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(credentials.email);
        if (existingUser) {
            throw new ValidationError('Email already registered', 'email');
        }

        // Register user via auth service (role will be null initially)
        const user = await this.authService.register(credentials);

        return user;
    }
}
