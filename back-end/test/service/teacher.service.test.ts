import { Teacher } from '../../model/teacher';
import { User } from '../../model/user';
import teacherDb from '../../repository/teacher.db';
import bcrypt from 'bcrypt';
import { Role } from '../../types';
import TeacherService from '../../service/teacher.service';

const userId = 1;
const username = 'username';
const firstName = 'Jan';
const lastName = 'Jansens';
const email = 'jan@mail.com';
const password = 'random-password';
const role: Role = 'teacher';

const getStoredUser = async () => {
    const hashedPassword = await bcrypt.hash(password, 12);
    return new User({
        id: userId,
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
    });
};

const id = 1;
const createdAt: Date = new Date('2026-01-16T20:00:00');
const updatedAt: Date = new Date('2026-01-17T22:00:00');
const learningPath = 'Software development';

let mockTeacherDbGetAllTeachers: jest.Mock;
let mockTeacherDbUpdateLearningPath: jest.Mock;
let mockTeacherDbGetTeacherById: jest.Mock;

beforeEach(() => {
    mockTeacherDbGetAllTeachers = jest.fn();
    mockTeacherDbUpdateLearningPath = jest.fn();
    mockTeacherDbGetTeacherById = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
});

// happy cases
test('given: teachers in database, when: getting all teachers, then: teachers are returned', async () => {
    //given
    const user = await getStoredUser();
    const teacher = new Teacher({ id, user, createdAt, updatedAt, learningPath });
    teacherDb.getAllTeachers = mockTeacherDbGetAllTeachers.mockResolvedValue([teacher]);

    //when
    const teachers = await TeacherService.getAllTeachers();

    //then
    expect(teachers).toEqual([teacher]);
    expect(mockTeacherDbGetAllTeachers).toHaveBeenCalledTimes(1);
});

test('given: teacher, when: updating learning path, then: teachers is updated', async () => {
    //given
    const user = await getStoredUser();
    const newLearningPath = 'Cybersecurity';
    const now = new Date(Date.now());
    const teacher = new Teacher({
        id,
        user,
        createdAt,
        updatedAt,
        learningPath,
    });
    const teacherNewPath = new Teacher({
        id,
        user,
        createdAt,
        updatedAt: now,
        learningPath: newLearningPath,
    });
    teacherDb.getTeacherById = mockTeacherDbGetTeacherById.mockResolvedValue(teacher);
    teacherDb.updateLearningPath =
        mockTeacherDbUpdateLearningPath.mockResolvedValue(teacherNewPath);

    //when
    const updatedTeacher = await TeacherService.updateLearningPath(id, newLearningPath);

    //then
    expect(updatedTeacher).toEqual(teacherNewPath);
    expect(mockTeacherDbGetTeacherById).toHaveBeenCalledTimes(1);
     expect(mockTeacherDbGetTeacherById).toHaveBeenCalledWith(id);
     expect(mockTeacherDbUpdateLearningPath).toHaveBeenCalledTimes(1);
     expect(mockTeacherDbUpdateLearningPath).toHaveBeenCalledWith(id, newLearningPath);
});

// unhappy cases
test('given: no teacher with, when: updating learning path, then: error is thrown', async () => {
    //given
    const newLearningPath = 'Cybersecurity';
    teacherDb.getTeacherById = mockTeacherDbGetTeacherById.mockResolvedValue(null);
    teacherDb.updateLearningPath =
        mockTeacherDbUpdateLearningPath;

    //when
    const promise = TeacherService.updateLearningPath(id, newLearningPath);

    //then
    await expect(promise).rejects.toThrow(`No teacher with id ${id}`);
    expect(mockTeacherDbGetTeacherById).toHaveBeenCalledTimes(1);
     expect(mockTeacherDbGetTeacherById).toHaveBeenCalledWith(id);
     expect(mockTeacherDbUpdateLearningPath).toHaveBeenCalledTimes(0);
});