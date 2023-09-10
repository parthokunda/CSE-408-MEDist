import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import { GetPendingAppointments } from "@/models/Appointment";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC, useState } from "react";
import { useCookies } from "react-cookie";
import PatientPendingAppointmentCards from "./PatientPendingAppointmentsCards";

const fetchPreviousAppointments = async (input: {
  authToken: string;
  currentPage: number;
}): Promise<GetPendingAppointments> => {
  const response = await axios.get(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/appointment/view-appointments/${input.currentPage}?pagination=5&status=prescribed`,
    {
      headers: {
        Authorization: `Bearer ${input.authToken}`, // Replace with your actual token
        "Content-Type": "application/json",
      },
    }
  );
  console.log(
    "🚀 ~ file: PreviousAppointments.tsx:16 ~ fetchPreviousAppointments ~ response:",
    response.data
  );

  return response.data;
};

const PreviousAppointments: FC = () => {
  const [cookies] = useCookies(["user"]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["prevAppointmentPatient"],
    queryFn: () =>
      fetchPreviousAppointments({
        authToken: cookies.user.token,
        currentPage: currentPage,
      }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  if (isError) {
    return <div>Error</div>;
  }
  return (
    <PatientPendingAppointmentCards
      doctorFetchedData={data}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
};

export default PreviousAppointments;
