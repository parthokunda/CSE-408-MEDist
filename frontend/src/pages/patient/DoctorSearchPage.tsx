import {
  PendingAppointments,
} from "@/models/Brand";
import { SearchDoctorInfo } from "@/models/DoctorSchema";
import { DoctorSearchForm } from "@/models/FormSchema";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { z } from "zod";
import DoctorSearchCards from "./Appointment/DoctorSearchCards";
import DoctorPendingCards from "./PatientPendingAppointmentsCards";
import SearchDoctor from "./SearchDoctor";

const DoctorSearchPage: FC = (props) => {
  const [doctors, setDoctors] = useState<SearchDoctorInfo>();

  const [searchFormData, setSearchFormData] = useState<
    z.infer<typeof DoctorSearchForm>
  >({ name: "", department: "" });
  const updateFormData = (formData: z.infer<typeof DoctorSearchForm>): void => {
    var str = `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/doctor/search/${currentSearchPage}?name=${
      formData.name
    }&specializationID=${formData.department}&pagination=3`;
    console.log(str);
    axios
      .get(
        `${import.meta.env.VITE_DB_URL}:${
          import.meta.env.VITE_DB_PORT
        }/api/doctor/search/${currentSearchPage}?name=${
          formData.name
        }&specializationID=${formData.department}&pagination=3`,
        {
          headers: {
            Authorization: `Bearer ${cookies.user.token}`, // Replace with your actual token
          },
        }
      )
      .then((response) => {
        setDoctors(response.data);
        setSearchFormData(formData);
        console.log("here", searchFormData);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const [searchTab, setSearchTab] = useState(true);
  const [cookies] = useCookies(["user"]);
  const [currentSearchPage, setCurrentSearchPage] = useState(1);
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [PendingAppointments, setPendingAppointments] =
    useState<PendingAppointments>();
  function resetCurrentSearchPage(): void {
    setCurrentSearchPage(1);
  }
  function resetCurrentPendingPage(): void {
    setCurrentPendingPage(1);
  }
  useEffect(() => {
    resetCurrentSearchPage();
  }, [searchFormData.name, searchFormData.department]);
  useEffect(() => {
    resetCurrentPendingPage();
  }, [searchFormData]);
  useEffect(() => {
    updateFormData(searchFormData);
  }, [currentSearchPage, searchFormData]);

  useEffect(() => {
    async function fetchpending() {
      try {
        axios
          .get(
            `${import.meta.env.VITE_DB_URL}:${
              import.meta.env.VITE_DB_PORT
            }/api/appointment/view-pending-appointments/${currentPendingPage}?pagination=4`,
            {
              headers: {
                Authorization: `Bearer ${cookies.user.token}`, // Replace with your actual token
              },
            }
          )
          .then((response) => {
            console.log(response.data);
            setPendingAppointments(response.data);
          });
      } catch (e) {
        console.log(e);
      }
    }
    fetchpending();
  }, [searchTab]);

  return (
    <div className="m-3">
      <div className="text-sm font-medium text-center text-c1 border-b border-gray-200 dark:text-gray-400 dark:border-c2">
        {searchTab && (
          <div>
            <ul className="flex flex-wrap justify-center -mb-px">
              <li className="mr-2">
                <a
                  className="inline-block p-4 text-c1 border-b-2 border-gray-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
                  aria-current="page"
                >
                  Search Doctor
                </a>
              </li>
              <li className="mr-2">
                <a
                  onClick={() => {
                    setSearchTab(false);
                  }}
                  className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-c2 hover:border-gray-300 dark:hover:text-c2"
                >
                  Pending Appointments
                </a>
              </li>
            </ul>
            <SearchDoctor
              formValues={searchFormData}
              formSubmitHandler={updateFormData}
            />
            {(searchFormData.department ||
              searchFormData.name) && (
                <DoctorSearchCards
                  doctorFetchedData={doctors!}
                  currentPage={currentSearchPage}
                  setCurrentPage={setCurrentSearchPage}
                />
              )}
          </div>
        )}
        {!searchTab && (
          <div>
            <ul className="flex flex-wrap justify-center -mb-px">
              <li className="mr-2">
                <a
                  onClick={() => {
                    setSearchTab(true);
                  }}
                  className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-c2 hover:border-gray-300 dark:hover:text-c2"
                >
                  Search Doctor
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
            {PendingAppointments && PendingAppointments.totalCount !== 0 && (
              <DoctorPendingCards
                doctorFetchedData={PendingAppointments}
                currentPage={currentPendingPage}
                setCurrentPage={setCurrentPendingPage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSearchPage;
