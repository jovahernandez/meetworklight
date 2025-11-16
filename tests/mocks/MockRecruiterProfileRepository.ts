import { IRecruiterProfileRepository } from '@/ports/repositories/IRecruiterProfileRepository';
import { RecruiterProfile, CreateRecruiterProfileParams, UpdateRecruiterProfileParams } from '@/domain/entities/RecruiterProfile';

export class MockRecruiterProfileRepository implements IRecruiterProfileRepository {
    private profiles: RecruiterProfile[] = [];
    private nextId = 1;

    async findById(id: string): Promise<RecruiterProfile | null> {
        return this.profiles.find(p => p.id === id) || null;
    }

    async findByUserId(userId: string): Promise<RecruiterProfile | null> {
        return this.profiles.find(p => p.userId === userId) || null;
    }

    async create(params: CreateRecruiterProfileParams): Promise<RecruiterProfile> {
        const profile: RecruiterProfile = {
            id: `profile-${this.nextId++}`,
            ...params,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.profiles.push(profile);
        return profile;
    }

    async update(id: string, params: UpdateRecruiterProfileParams): Promise<RecruiterProfile> {
        const index = this.profiles.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error(`Profile ${id} not found`);
        }

        const updated: RecruiterProfile = {
            ...this.profiles[index],
            ...params,
            updatedAt: new Date(),
        };
        this.profiles[index] = updated;
        return updated;
    }

    clear() {
        this.profiles = [];
        this.nextId = 1;
    }
}
