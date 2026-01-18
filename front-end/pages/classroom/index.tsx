import Header from "@components/header";
import TeacherOverview from "@components/teachers/TeacherOverview";
import TeacherService from "@services/TeacherService";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { User } from "@types";
import AddClassroom from "@components/classrooms/AddClassroom";

const Classrooms: React.FC = () => {
    const [loggedInUser, setLoggedInUser] = useState<User>(null);

    useEffect(() => {
        setLoggedInUser(JSON.parse(sessionStorage.getItem("loggedInUser")));
      }, []);
    
  const { t } = useTranslation();

  const fetcher = async (key: string) => {
    const teachersResponse = await TeacherService.getAllTeachers();
    if (!teachersResponse.ok) {
      throw new Error(t("general.error"));
    }
    const teachers = await teachersResponse.json();

    return { teachers };
  };

  const { data, isLoading, error } = useSWR("Teachers", fetcher);

  return (
    <>
      <Head>
        <title>{t("header.nav.addClassroom")}</title>
      </Head>
      <Header />
      <main className="p-6 min-h-screen flex flex-col items-center">
        {loggedInUser?.role === 'admin' ? (
          <AddClassroom/>
        ) : 
        <p className="text-red-600">{t("error.authorization")}</p>
        }        
      </main>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default Classrooms;
