import { Teacher } from '../../model/teacher';
import { User } from '../../model/user';
import { Role } from '../../types';

const userId = 2;
const username = 'username';
const firstName = 'Jan';
const lastName = 'Jansens';
const email = 'jan@mail.com';
const password = 'random-password';
const role: Role = 'teacher';
const user = new User({
    id: userId,
    username,
    firstName,
    lastName,
    email,
    password,
    role,
});

const id = 1;
const createdAt: Date = new Date('2026-01-16T20:00:00');
const updatedAt: Date = new Date('2026-01-17T22:00:00');
const learningPath = 'Software development';

// happy cases
test('given: teacher details, when: creating teacher, then: user created with those values', () => {
    //given
    //when
    const teacher = new Teacher({
        id,
        user,
        createdAt,
        updatedAt,
        learningPath,
    });
    //then
    expect(teacher.id).toEqual(id);
    expect(teacher.user).toEqual(user);
    expect(teacher.createdAt).toEqual(createdAt);
    expect(teacher.updatedAt).toEqual(updatedAt);
    expect(teacher.learningPath).toEqual(learningPath);
});

// unhappy cases
test('given: empty user, when: creating teacher, then: error is thrown', () => {
    //given
    //when
    const teacherCreation = () => {
        new Teacher({
            id,
            user: null,
            createdAt,
            updatedAt,
            learningPath,
        });
    };
    //then
    expect(teacherCreation).toThrow('User is required')
});

test('given: empty learning path, when: creating teacher, then: error is thrown', () => {
    //given
    //when
    const teacherCreation = () => {
        new Teacher({
            id,
            user,
            createdAt,
            updatedAt,
            learningPath: "",
        });
    };
    //then
    expect(teacherCreation).toThrow('Learning path is required')
});