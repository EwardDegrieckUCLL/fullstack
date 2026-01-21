import LearningPath from "@components/learning-path";
import { Teacher, User } from "@types";
import { useEffect, useState } from "react";

type Props = {
  teachers: Teacher[];
};

const TeacherOverview: React.FC<Props> = ({ teachers }: Props) => {
  const [loggedInUser, setLoggedInUser] = useState<User>(null);
  const [databaseError, setDatabaseError] = useState<string | null>(null);

  useEffect(() => {
    setLoggedInUser(JSON.parse(sessionStorage.getItem("loggedInUser")));
  }, []);

  return (
    <>
      <section className="mt-5">
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Learning path</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t.id}>
                <td>
                  {t.user.lastName} {t.user.firstName}
                </td>
                <td>
                  {loggedInUser?.role === "admin" ? (
                    <LearningPath
                      teacherId={t.id}
                      learningPath={t.learningPath}
                      setDatabaseError={setDatabaseError}
                    />
                  ) : (
                    t.learningPath
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {databaseError && <p className="text-red-600">{databaseError}</p>}
      </section>
    </>
  );
};

export default TeacherOverview;
