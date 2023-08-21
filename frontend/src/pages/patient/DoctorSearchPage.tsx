import { FC, useEffect, useState } from "react";
import SearchDoctor from "./SearchDoctor";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { MedSearchForm } from "@/models/FormSchema";
import { DoctorSearchForm } from "@/models/FormSchema";
import { DoctorPendingAttributes } from "@/models/Brand";
import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import DoctorSearchCards from "./DoctorSearchCards";
import DoctorPendingCards from "./PatientPendingAppointmentsCards";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
  SpecializationAttributes,
  PendingAppointments,
  SearchDoctorInfo,
} from "@/models/Brand";
import { set } from "date-fns";

// import { useMutation } from "@tanstack/react-query";

const DoctorSearchPage: FC = (props) => {
  const [doctors, setDoctors] = useState<SearchDoctorInfo>();
  // const fetchDoctorList =  async(searchFormData:z.infer<typeof DoctorSearchForm>):Promise<SearchDoctorInfo> => {

  //     const str :SearchDoctorInfo= await axios.get(
  //       `${import.meta.env.VITE_DB_URL}:${
  //         import.meta.env.VITE_DB_PORT
  //       }api/doctor/search/${currentSearchPage}?name=${
  //         searchFormData.name
  //       }&specializationID=${searchFormData.department}&pagination=5`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${cookies.user.token}`, // Replace with your actual token
  //         },
  //       }
  //     );
  //     console.log(str);
  //     return str;
  //     // setDoctors(response.data);
  //     // return response.data;

  // };

  // useEffect(() => {
  //   async function fetchDoctors(){
  //     try{
  //       const response = await axios.get(
  //         `${import.meta.env.VITE_DB_URL}:${
  //           import.meta.env.VITE_DB_PORT
  //         }api/doctor/search/${currentSearchPage}?name=${
  //           searchFormData.name
  //         }&specializationID=${searchFormData.department}&pagination=5`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${cookies.user.token}`, // Replace with your actual token
  //           },
  //         }
  //       );
  //       console.log(response.data);
  //       setDoctors(response.data);
  //   }
  //   catch(error){
  //     console.error(error);
  //   }
  // }
  // fetchDoctors();
  // } ,[]);

  // const [Specializations, setSpecializations] = useState<

  const [searchFormData, setSearchFormData] = useState<
    z.infer<typeof DoctorSearchForm>
  >({ name: "", department: "" });
  const updateFormData = (formData: z.infer<typeof DoctorSearchForm>): void => {
    // console.log(formData);
    // async function fetchDoctors(){
    //       try{
    //         const response = await axios.get(
    //           `${import.meta.env.VITE_DB_URL}:${
    //             import.meta.env.VITE_DB_PORT
    //           }/api/doctor/search/1?name=Dh&specializationID=2&pagination=5`,
    //           {
    //             headers: {
    //               Authorization: `Bearer ${cookies.user.token}`, // Replace with your actual token
    //             },
    //           }
    //         );
    //         console.log("here", response.data);
    //         setDoctors(response.data);
    //     }
    //     catch(error){
    //       console.error(error);
    //     }
    //   }
    //   fetchDoctors();
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
        // console.log("here", response.data);
        setDoctors(response.data);
        setSearchFormData(formData);
        // resetCurrentPendingPage();
        // resetCurrentSearchPage();
        console.log("here", searchFormData);
        // console.log("here", doctors);
      })
      .catch((error) => {
        console.error(error);
      });

    // setSearchFormData(formData);
    // console.log("here", searchFormData);
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
  // const { data, isError, isLoading, mutate } = useMutation({
  //   mutationKey: ["doctorList"],
  //   mutationFn: fetchDoctorList,
  // });

  useEffect(() => {
    resetCurrentSearchPage();
  }, [searchFormData.name, searchFormData.department]);
  useEffect(() => {
    resetCurrentPendingPage();
  }, [searchFormData]);
  // useEffect(() => {
  //   mutate(searchFormData);
  // }, [searchFormData, currentSearchPage]);
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
