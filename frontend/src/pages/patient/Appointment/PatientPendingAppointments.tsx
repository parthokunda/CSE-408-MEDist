import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import { GetPendingAppointments} from "@/models/Appointment";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import DoctorPendingCards from "./PatientPendingAppointmentsCards";

const fetchPendingAppointments = async (
  authToken: string,
  currentPage: number
): Promise<GetPendingAppointments> => {
  const response = await axios.get(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/appointment/view-appointments/${currentPage}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`, // Replace with your actual token
      },
    }
  );
  console.log(
    "🚀 ~ file: PatientPendingAppointments.tsx:16 ~ fetchPendingAppointments ~ response:",
    response.data
  );
  return response.data;
};

const PatientPendingAppointments: FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cookies] = useCookies(["user"]);
  const { data, isLoading, isError, mutate } = useMutation({
    mutationFn: () => fetchPendingAppointments(cookies.user.token, currentPage),
  });

  useEffect(() => {
    mutate();
  }, [currentPage]);
  if (isError) return <>Error Loading</>;
  if (isLoading)
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <LoadingSpinner />
      </div>
    );
  if (data)
    return (
      <DoctorPendingCards
        doctorFetchedData={data}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    );
  return <></>;
};

export default PatientPendingAppointments;
