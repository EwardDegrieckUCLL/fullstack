import TeacherService from "@services/TeacherService";
import { useState } from "react";
import { useTranslation } from "next-i18next";

type Props = {
  teacherId: number;
  learningPath: string;
  setDatabaseError: (databaseError: string | null) => void;
};

const LearningPath: React.FC<Props> = ({
  teacherId,
  learningPath,
  setDatabaseError,
}: Props) => {
  const { t } = useTranslation();
  const [currentLearningPath, setCurrentLearningPath] =
    useState<string>(learningPath);

  const clearError = () => {
    setDatabaseError(null);
  };

  const handleLearningPathChange = async (event: {
    target: { value: string };
  }) => {
    clearError();
    const newPath = event.target.value;
    setCurrentLearningPath(newPath);
    const response = await TeacherService.updateLearningPath(
      teacherId,
      newPath,
    );
    if (!response.ok) {
      setDatabaseError(t("general.error"));
    }
  };

  return (
    <div className="ml-6">
      <select
        id="learningPath"
        className="ml-2 p-1"
        value={currentLearningPath}
        onChange={handleLearningPathChange}
      >
        <option value="Infrastructure">Infrastructure</option>
        <option value="Software development">Software development</option>
        <option value="Cybersecurity">Cybersecurity</option>
      </select>
    </div>
  );
};

export default LearningPath;
