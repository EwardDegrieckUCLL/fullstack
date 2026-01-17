import { User } from '../../model/user';
import { Role } from '../../types';

const id = 1;
const username = 'username';
const firstName = 'Jan';
const lastName = 'Jansens';
const email = 'jan@mail.com';
const password = 'random-password';
const role: Role = 'teacher';

// happy cases
test('given: user details, when: creating user, then: user created with those values', () => {
    //given
    //when
    const user = new User({
        id,
        username,
        firstName,
        lastName,
        email,
        password,
        role,
    });
    //then
    expect(user.id).toEqual(id);
    expect(user.username).toEqual(username);
    expect(user.firstName).toEqual(firstName);
    expect(user.lastName).toEqual(lastName);
    expect(user.email).toEqual(email);
    expect(user.password).toEqual(password);
    expect(user.role).toEqual(role);
});

test('given: users with values, when: comparing user to those values, then: true is returned', () => {
    //given
    const user = new User({
        id,
        username,
        firstName,
        lastName,
        email,
        password,
        role,
    });

    // when
    const bool = user.equals({ id, username, firstName, lastName, email, password, role });

    //then
    expect(bool).toBe(true);
});

// unhappy cases
test('given: empty username, when: creating user, then: user created with those values', () => {
    //given
    //when
    const userCreation = () => {
        new User({
            id,
            username: '',
            firstName,
            lastName,
            email,
            password,
            role,
        });
    };
    //then
    expect(userCreation).toThrow('Username is required');
});

test('given: empty first name, when: creating user, then: user created with those values', () => {
    //given
    //when
    const userCreation = () => {
        new User({
            id,
            username,
            firstName: '',
            lastName,
            email,
            password,
            role,
        });
    };
    //then
    expect(userCreation).toThrow('First name is required');
});

test('given: empty last name, when: creating user, then: user created with those values', () => {
    //given
    //when
    const userCreation = () => {
        new User({
            id,
            username,
            firstName,
            lastName: '',
            email,
            password,
            role,
        });
    };
    //then
    expect(userCreation).toThrow('Last name is required');
});

test('given: empty email, when: creating user, then: user created with those values', () => {
    //given
    //when
    const userCreation = () => {
        new User({
            id,
            username,
            firstName,
            lastName,
            email: '',
            password,
            role,
        });
    };
    //then
    expect(userCreation).toThrow('Email is required');
});

test('given: empty password, when: creating user, then: user created with those values', () => {
    //given
    //when
    const userCreation = () => {
        new User({
            id,
            username,
            firstName,
            lastName,
            email,
            password: '',
            role,
        });
    };
    //then
    expect(userCreation).toThrow('Password is required');
});
