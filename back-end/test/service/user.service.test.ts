import { User } from '../../model/user';
import userDb from '../../repository/user.db';
import UserService from '../../service/user.service';
import { AuthenticationResponse, Role } from '../../types';
import { generateJwtToken } from '../../util/jwt';
import bcrypt from 'bcrypt';

const id = 1;
const username = 'username';
const firstName = 'Jan';
const lastName = 'Jansens';
const email = 'jan@mail.com';
const password = 'random-password';
const role: Role = 'teacher';

const getStoredUser = async () => {
    const hashedPassword = await bcrypt.hash(password, 12);
    return new User({
        id,
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
    });
};

const authenticationResponse: AuthenticationResponse = {
    token: generateJwtToken({ username, role }),
    username,
    fullname: `${firstName} ${lastName}`,
    role,
};

let mockUserDbGetAllUsers: jest.Mock;
let mockUserDbGetUserById: jest.Mock;
let mockUserDbGetUserByUsername: jest.Mock;
let mockUserDbCreateUser: jest.Mock;
beforeEach(() => {
    mockUserDbGetAllUsers = jest.fn();
    mockUserDbGetUserById = jest.fn();
    mockUserDbGetUserByUsername = jest.fn();
    mockUserDbCreateUser = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
});

// happy cases
test('given: users in database, when: getting all users, then: users are returned', async () => {
    //given
    const user = await getStoredUser();
    userDb.getAllUsers = mockUserDbGetAllUsers.mockResolvedValue([user]);

    //when
    const users = await UserService.getAllUsers();

    //then
    expect(users).toEqual([user]);
    expect(mockUserDbGetAllUsers).toHaveBeenCalledTimes(1);
});

test('given: user with username in database, when: getting by username, then: user is returned', async () => {
    //given
    const user = await getStoredUser();
    userDb.getUserByUsername = mockUserDbGetUserByUsername.mockResolvedValue(user);

    //when
    const foundUser = await UserService.getUserByUsername({ username });

    //then
    expect(foundUser).toEqual(user);
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledWith({ username });
});

test('given: credentials of users, when: authenticating, then: authentication response is returned', async () => {
    //given
    const user = await getStoredUser();
    userDb.getUserByUsername = mockUserDbGetUserByUsername.mockResolvedValue(user);

    //when
    const response = await UserService.authenticate({ username, password });

    //then
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledWith({ username });
    expect(response).toMatchObject({
        token: expect.any(String),
        fullname: `${firstName} ${lastName}`,
        username,
        role,
    });
});

test('given: user details, when: creating user, then: user is created', async () => {
    //given
    const user = await getStoredUser();
    userDb.getUserByUsername = mockUserDbGetUserByUsername.mockResolvedValue(null);
    userDb.createUser = mockUserDbCreateUser.mockResolvedValue(user);

    //when
    const userCreated = await UserService.createUser({
        username,
        password,
        firstName,
        lastName,
        email,
        role,
    });

    //then
    expect(userCreated).toEqual(user);
    expect(mockUserDbCreateUser).toBeCalledWith(
        expect.objectContaining({
            username,
            firstName,
            lastName,
            email,
            role,
        }),
    );
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledWith({ username });
});

// unhappy cases
test('given: no user with username in database, when: getting by username, then: error is thrown', async () => {
    //given
    userDb.getUserByUsername = mockUserDbGetUserByUsername.mockResolvedValue(null);

    //when
    const promise = UserService.getUserByUsername({ username });

    //then
    await expect(promise).rejects.toThrow(`User with username: ${username} does not exist.`);
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledWith({ username });
});

test('given: incorrect password, when: authenticating, then: error is thrown', async () => {
    //given
    const user = await getStoredUser();
    userDb.getUserByUsername = mockUserDbGetUserByUsername.mockResolvedValue(user);

    //when
    const promise = UserService.authenticate({ username, password: 'random' });

    //then
    await expect(promise).rejects.toThrow('Incorrect password');
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledWith({ username });
});

test('given: username already in database, when: creating user, then: error is thrown', async () => {
    //given
    const user = await getStoredUser();
    userDb.getUserByUsername = mockUserDbGetUserByUsername.mockResolvedValue(user);
    userDb.createUser = mockUserDbCreateUser;

    //when
    const promise = UserService.createUser({
        username,
        password,
        firstName,
        lastName,
        email,
        role,
    });

    //then
    await expect(promise).rejects.toThrow('User with username username is already registered.');
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledWith({ username });
    expect(mockUserDbCreateUser).toBeCalledTimes(0);
});
