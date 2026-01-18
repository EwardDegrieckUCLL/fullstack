import database from '../util/database';
import { Teacher } from '../model/teacher';

const getAllTeachers = async (): Promise<Teacher[]> => {
    try {
        const teachersPrisma = await database.teacher.findMany({
            include: {user:true}
        });
        return teachersPrisma.map((t) => Teacher.from(t));
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};

const updateLearningPath = async (teacherId: number, newLearningPath: string): Promise<Teacher> => {
    try {
        const teacherPrisma = await database.teacher.update({
            where: { id: teacherId },
            data: { learningPath: newLearningPath },
            include: { user: true },
        });
        return Teacher.from(teacherPrisma);
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};

const getTeacherById = async (teacherId: number): Promise<Teacher> => {
    try {
        const teacherPrisma = await database.teacher.findUnique({
            where: { id: teacherId },
            include: { user: true },
        });

        return teacherPrisma ? Teacher.from(teacherPrisma) : null;
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllTeachers,
    updateLearningPath,
    getTeacherById,
};
