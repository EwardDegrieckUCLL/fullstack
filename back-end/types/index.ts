type Role = 'admin' | 'student' | 'teacher';

type UserInput = {
    id?: number;
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: Role;
};

type TeacherInput = {
    id?: number;
    user?: UserInput;
    phase?: string;
};

type ClassroomInput = {
    id?: number;
    name: string;
}

type AuthenticationResponse = {
    token: string;
    username: string;
    fullname: string;
    role: string;
};

export { Role, TeacherInput, UserInput, AuthenticationResponse, ClassroomInput };
