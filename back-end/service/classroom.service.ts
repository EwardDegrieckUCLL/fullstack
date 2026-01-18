import classroomDb from '../repository/classroom.db';
import { Classroom } from '../model/classroom';
import { ClassroomInput } from '../types';

const getClassroomByName = async (name: string): Promise<Classroom> => {
    const classroom = await classroomDb.getClassroomByName(name);
    if (!classroom) {
        throw new Error(`No classroom with name ${name}`);
    }
    return classroom;
};

const createClassroom = async ({ name }: ClassroomInput, { role }): Promise<Classroom> => {
    if (role !== 'admin') {
        throw new Error('You are not authorized to access this resource.')
    }
    const existingClassroom = await classroomDb.getClassroomByName(name);

    if (existingClassroom) {
        throw new Error(`Classroom with name ${name} is already registered.`);
    }

    const classroom = new Classroom({ name });
    return await classroomDb.createClassroom(classroom);
};

export default { getClassroomByName, createClassroom };
