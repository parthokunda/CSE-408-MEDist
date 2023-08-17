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

const DoctorSearchPage: FC = (props) => {
  const [searchFormData, setSearchFormData] = useState<
    z.infer<typeof DoctorSearchForm>
  >({ name: "", department: "" });
  const updateFormData = (formData: z.infer<typeof DoctorSearchForm>): void => {
    setSearchFormData(formData);
    console.log("here",searchFormData);
  };
  const [searchTab, setSearchTab] = useState(true);
  const [currentSearchPage, setCurrentSearchPage] = useState(1);
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const data=[
    {
        img : "https://www.w3schools.com/howto/img_avatar.png",
        name: "Dr. John Doe",
        degree : "MBBS, MD",
        department : "ENT",
        bmdcNumber : "123456",
        cost : 500,
        contact : "01712345678",
    },
    {
        img : "https://www.w3schools.com/howto/img_avatar.png",
        name: "Dr. John Doe",
        degree : "MBBS, MD",
        department : "ENT",
        bmdcNumber : "123456",
        cost : 500,
        contact : "01712345678",
    },
    {
        img : "https://www.w3schools.com/howto/img_avatar.png",
        name: "Dr. John Doe",
        degree : "MBBS, MD",
        department : "ENT",
        bmdcNumber : "123456",
        cost : 500,
        contact : "01712345678",
    },
    {
        img : "https://www.w3schools.com/howto/img_avatar.png",
        name: "Dr. John Doe",
        degree : "MBBS, MD",
        department : "ENT",
        bmdcNumber : "123456",
        cost : 500,
        contact : "01712345678",
    },
  ]
  const pendingAppointments=[
    {
        appID : "123456",
        name : "John Doe",
        date : new Date(),
        meetLink : "https://meet.google.com/",
    },
    {
        appID : "123456",
        name : "John Doe",
        date : new Date(),
        meetLink : "https://meet.google.com/",
    },
    {
        appID : "123456",
        name : "John Doe",
        date : new Date(),
        meetLink : "https://meet.google.com/",
    },
    {
        appID : "123456",
        name : "John Doe",
        date : new Date(),
        meetLink : "https://meet.google.com/",
    },
  ]
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
            {((searchFormData.department!=="")||(searchFormData.name!==""))&& (
                <DoctorSearchCards
                    doctorFetchedData={data}
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
            <DoctorPendingCards doctorFetchedData={pendingAppointments} currentPage={currentPendingPage} setCurrentPage={setCurrentPendingPage}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSearchPage;
