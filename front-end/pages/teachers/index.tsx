import Header from "@components/header";
import TeacherOverview from "@components/teachers/TeacherOverview";
import TeacherService from "@services/TeacherService";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import useSWR from "swr";

const Teachers: React.FC = () => {
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
        <title>Teachers</title>
      </Head>
      <Header />
      <main className="p-6 min-h-screen flex flex-col items-center">
        <h1>Teachers</h1>

        <section className="mt-5">
          {error && <p className="text-danger">{error}</p>}
          {isLoading && <p>Loading...</p>}
          {data && <TeacherOverview teachers={data.teachers} />}
        </section>
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

export default Teachers;
