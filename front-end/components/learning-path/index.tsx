import TeacherService from "@services/TeacherService";
import { useState } from "react";

type Props = {
  teacherId: number;
  learningPath: string;
};

const LearningPath: React.FC<Props> = ({ teacherId, learningPath }: Props) => {
  const [currentLearningPath, setCurrentLearningPath] = useState<string>(learningPath);

  const handleLearningPathChange = async (event: {
    target: { value: string };
  }) => {
    {
      const newPath = event.target.value;
      setCurrentLearningPath(newPath);
      await TeacherService.updateLearningPath(teacherId, newPath);
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
