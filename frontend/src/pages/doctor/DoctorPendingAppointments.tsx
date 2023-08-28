import { FC, useEffect, useState } from "react";
// import SearchDoctor from "./SearchDoctor";
import { PatientSearchForm } from "@/models/FormSchema";
import { z } from "zod";
// import DoctorSearchCards from "./DoctorSearchCards";
import DoctorPendingCards from "./DoctorPendingCards";
import { GetPendingAppointmentsResponse } from "@/models/Appointment";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

const fetchPendingAppointments = async (
  authToken: string,
  currentPage: number
): Promise<GetPendingAppointmentsResponse> => {
  const response = await axios.get(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/appointment/view-pending-appointments/${currentPage}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`, // Replace with your actual token
      },
    }
  );
  console.log(
    "🚀 ~ file: DoctorPendingAppointments.tsx:16 ~ fetchPendingAppointments ~ response:",
    response.data
  );
  return response.data;
};

const PatientSearchPage: FC = (props) => {
  const [searchTab, setSearchTab] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cookies] = useCookies(["user"]);
  const { data, isLoading, isError, mutate } = useMutation({
    mutationFn: () => fetchPendingAppointments(cookies.user.token, currentPage),
  });

  useEffect(() => {
    mutate();
  }, [currentPage]);
  if (data) {
    return (
      <div className="m-3">
        <div className="text-sm font-medium text-center text-c1 border-b border-gray-200 dark:text-gray-400 dark:border-c2">
          {!searchTab && (
            <div>
              <ul className="flex flex-wrap justify-center -mb-px">
                <li className="mr-2">
                  <a className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-c2 hover:border-gray-300 dark:hover:text-c2">
                    Search Previous
                  </a>
                </li>
                <li className="mr-2">
                  <a
                    className="inline-block p-4 text-c1 border-b-2 border-gray-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
                    aria-current="page"
                  >
                    Pending Appointments
                  </a>
                </li>
              </ul>

              <DoctorPendingCards
                patientFetchedData={data}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default PatientSearchPage;
