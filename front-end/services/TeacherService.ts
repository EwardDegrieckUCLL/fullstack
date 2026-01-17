const getAllTeachers = () => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/teachers", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
};

const updateLearningPath = (teacherId: number, learningPath: string) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/teachers/${teacherId}/learningPath?learningPath=${learningPath}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        }
    })
};

const TeacherService = {
  getAllTeachers,
  updateLearningPath,
};

export default TeacherService;
