import { User } from './user';
import { Teacher as TeacherPrisma, User as UserPrisma } from '@prisma/client';

export class Teacher {
    readonly id?: number;
    readonly user: User;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
    readonly learningPath: string;

    constructor(teacher: {
        id?: number;
        user: User;
        createdAt?: Date;
        updatedAt?: Date;
        learningPath: string;
    }) {
        this.validate(teacher);

        this.id = teacher.id;
        this.user = teacher.user;
        this.createdAt = teacher.createdAt;
        this.updatedAt = teacher.updatedAt;
        this.learningPath = teacher.learningPath;
    }

    validate(teacher: { user: User; learningPath: string }) {
        if (!teacher.user) {
            throw new Error('User is required');
        }
        if (!teacher.learningPath?.trim()) {
            throw new Error('Learning path is required');
        }
    }

    static from({
        id,
        user,
        createdAt,
        updatedAt,
        learningPath,
    }: TeacherPrisma & { user: UserPrisma }) {
        return new Teacher({
            id,
            user: User.from(user) as User,
            createdAt,
            updatedAt,
            learningPath,
        });
    }
}
