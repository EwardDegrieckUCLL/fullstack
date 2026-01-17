import teacherDb from '../repository/teacher.db';
import { Teacher } from '../model/teacher';

const getAllTeachers = async (): Promise<Teacher[]> => teacherDb.getAllTeachers();

const updateLearningPath = async (teacherId: number, learningPath: string): Promise<Teacher> => {
    const teacher = await teacherDb.getTeacherById(teacherId);
    if (!teacher) {
        throw new Error(`No teacher with id ${teacherId}`);
    }
    return teacherDb.updateLearningPath(teacherId, learningPath);
};

export default { getAllTeachers, updateLearningPath };
