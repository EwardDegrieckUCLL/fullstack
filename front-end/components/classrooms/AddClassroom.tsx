import ClassroomService from "@services/ClassroomService";
import { ClassroomInput } from "@types";
import { useTranslation } from "next-i18next";
import { useState } from "react";

const AddClassroom: React.FC = () => {
  const { t } = useTranslation();

  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  const clearAll = () => {
    setNameError(null);
    setAddSuccess(null);
    setAddError(null);
  };

  const validateInput = (): boolean => {
    let result = true;
    if (!name || name.trim() === "") {
      setNameError(t("addClassroom.error.name"));
      result = false;
    }
    return result;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    clearAll();

    if (!validateInput()) {
      return;
    }

    const existingResponse = await ClassroomService.getClassroomByName(name);

    if (existingResponse.ok) {
      setAddError(t("addClassroom.error.duplicate"));
      return;
    }

    const classroomInput: ClassroomInput = { name };
    const creationResponse =
      await ClassroomService.createClassroom(classroomInput);

    if (!creationResponse.ok) {
      setAddError(t("addClassroom.error.add"));
      return;
    }

    const createdClassroom = await creationResponse.json();
    setAddSuccess(
      t("addClassroom.successWithId", {
        name: createdClassroom.name,
        id: createdClassroom.id,
      }),
    );
    setName("");
  };

  return (
    <>
      <h2>{t("header.nav.addClassroom")}</h2>
      {addError && <p className="text-red-600">{addError}</p>}
      {addSuccess && <p className="text-green-700">{addSuccess}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="nameInput">{t("addClassroom.label.name")}</label>
        <div>
          <input
            id="nameInput"
            className="border border-black py-1 px-2 mb-2 rounded"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {nameError && <p className="text-red-600 mb-2">{nameError}</p>}
        </div>
        <button
          className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-1 px-4 rounded"
          type="submit"
        >
          {t("addClassroom.button.add")}
        </button>
      </form>
    </>
  );
};

export default AddClassroom;
