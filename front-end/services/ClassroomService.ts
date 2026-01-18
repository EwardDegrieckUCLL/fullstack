import { ClassroomInput } from "@types";

const getToken = (): string => {
  const loggedInUserString = sessionStorage.getItem("loggedInUser");
  return loggedInUserString ? JSON.parse(loggedInUserString).token : "";
};

const getClassroomByName = (name: string) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/classrooms/${name}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

const createClassroom = (classroomInput: ClassroomInput) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/classrooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(classroomInput),
  });
};

const ClassroomService = {
  getClassroomByName,
  createClassroom,
};

export default ClassroomService;
