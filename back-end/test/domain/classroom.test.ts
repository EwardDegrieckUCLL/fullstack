import { Classroom } from '../../model/classroom';

const id = 1;
const name = 'C001';

// happy cases
test('given: classroom details, when: creating classroom, then: classroom created with those values', () => {
    //given
    //when
    const classroom = new Classroom({
        id,
        name,
    });
    //then
    expect(classroom.id).toEqual(id);
    expect(classroom.name).toEqual(name);
});

// unhappy cases
test('given: empty name, when: creating classroom, then: error thrown', () => {
    //given
    //when
    const classroomCreation = () => {
        new Classroom({ id, name:'' });
    };
    //then
    expect(classroomCreation).toThrow('Name is required');
});