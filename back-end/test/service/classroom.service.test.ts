import { Classroom } from '../../model/classroom';
import classroomDb from '../../repository/classroom.db';
import ClassroomService from '../../service/classroom.service';

const id = 1;
const name = 'C001';
const classroom = new Classroom({ id, name });

const adminRole = { role: 'admin' };
const noAdminRole = { role: 'student' };

let mockClassroomDbGetClassroomByName: jest.Mock;
let mockClassroomDbCreateClassroom: jest.Mock;

beforeEach(() => {
    mockClassroomDbGetClassroomByName = jest.fn();
    mockClassroomDbCreateClassroom = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
});

// happy cases
test('given: classroom with name in database, when: getting that classroom, then: classroom is returned', async () => {
    //given
    classroomDb.getClassroomByName = mockClassroomDbGetClassroomByName.mockResolvedValue(classroom);

    //when
    const foundClassroom = await ClassroomService.getClassroomByName(name);

    //then
    expect(foundClassroom).toEqual(classroom);
    expect(mockClassroomDbGetClassroomByName).toHaveBeenCalledTimes(1);
    expect(mockClassroomDbGetClassroomByName).toHaveBeenLastCalledWith(name);
});

test('given: classroom details, when: creating classroom, then: classroom is created', async () => {
    //given
    classroomDb.getClassroomByName = mockClassroomDbGetClassroomByName.mockResolvedValue(null);
    classroomDb.createClassroom = mockClassroomDbCreateClassroom.mockResolvedValue(classroom);

    //when
    const createdClassroom = await ClassroomService.createClassroom({ name }, adminRole);

    //then
    expect(createdClassroom).toEqual(classroom);
    expect(mockClassroomDbGetClassroomByName).toHaveBeenCalledTimes(1);
    expect(mockClassroomDbGetClassroomByName).toHaveBeenCalledWith(name);
    expect(mockClassroomDbCreateClassroom).toHaveBeenCalledTimes(1);
    expect(mockClassroomDbCreateClassroom).toHaveBeenLastCalledWith(
        expect.objectContaining({ name }),
    );
});

// unhappy cases
test('given: no classroom with name in database, when: getting that classroom, then: error is thrown', async () => {
    //given
    classroomDb.getClassroomByName = mockClassroomDbGetClassroomByName.mockResolvedValue(null);

    //when
    const promise = ClassroomService.getClassroomByName(name);

    //then
    await expect(promise).rejects.toThrow(`No classroom with name ${name}`);
    expect(mockClassroomDbGetClassroomByName).toHaveBeenCalledTimes(1);
    expect(mockClassroomDbGetClassroomByName).toHaveBeenLastCalledWith(name);
});

test('given: name already in database, when: creating classroom, then: error is thrown', async () => {
    //given
    classroomDb.getClassroomByName = mockClassroomDbGetClassroomByName.mockResolvedValue(classroom);
    classroomDb.createClassroom = mockClassroomDbCreateClassroom;

    //when
    const promise = ClassroomService.createClassroom({ name }, adminRole);

    //then
    await expect(promise).rejects.toThrow(`Classroom with name ${name} is already registered.`);
    expect(mockClassroomDbGetClassroomByName).toHaveBeenCalledTimes(1);
    expect(mockClassroomDbGetClassroomByName).toHaveBeenCalledWith(name);
    expect(mockClassroomDbCreateClassroom).toHaveBeenCalledTimes(0);
});


test('given: no admin, when: creating classroom, then: error is thrown', async () => {
    //given
    classroomDb.getClassroomByName = mockClassroomDbGetClassroomByName;
    classroomDb.createClassroom = mockClassroomDbCreateClassroom;

    //when
    const promise = ClassroomService.createClassroom({ name }, noAdminRole);

    //then
    await expect(promise).rejects.toThrow(`You are not authorized to access this resource.`);
    expect(mockClassroomDbGetClassroomByName).toHaveBeenCalledTimes(0);
    expect(mockClassroomDbCreateClassroom).toHaveBeenCalledTimes(0);
});
