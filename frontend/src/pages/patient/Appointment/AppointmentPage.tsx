import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchDoctorInfo } from "@/models/DoctorSchema";
import { DoctorSearchFormType } from "@/models/FormSchema";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import DoctorSearchCards from "./DoctorSearchCards";
import SearchDoctor from "./SearchDoctor";
import PatientPendingAppointments from "./PatientPendingAppointments";
import PreviousAppointments from "./PreviousAppointment/PreviousAppointments";

const AppointmentPage: FC = () => {
  const [cookies] = useCookies(["user"]);
  const recordsPerPage = 5;
  const [doctorSearchTerm, setDoctorSearchTerm] =
    useState<DoctorSearchFormType>({ name: "", department: "" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [doctorList, setDoctorList] = useState<SearchDoctorInfo | null>(null);

  useEffect(() => {
    const fetchDoctorsList = async (
      searchTerm: DoctorSearchFormType,
      currentPage: number,
      userToken: string
    ): Promise<SearchDoctorInfo> => {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_DB_URL}:${
          import.meta.env.VITE_DB_PORT
        }/api/doctor/search/${currentPage}?name=${
          searchTerm.name
        }&specializationID=${
          searchTerm.department
        }&pagination=${recordsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`, // Replace with your actual token
          },
        }
      );
      setDoctorList(response.data);
      console.log(
        "🚀 ~ file: AppointmentPage.tsx:39 ~ useEffect ~ response.data:",
        response.data
      );
      setIsLoading(false);
      return response.data;
    };

    // console.log(isLoading);
    fetchDoctorsList(doctorSearchTerm, currentPage, cookies.user.token);
  }, [doctorSearchTerm, currentPage]);

  return (
    <Tabs defaultValue="searchDoctor">
      <TabsList className="flex justify-center bg- text-c1  border-gray-200 dark:text-gray-400 gap-6 mt-5 ">
        <TabsTrigger
          className="text-c1 text-lg data-[state=active]:text-c1 data-[state=inactive]:text-[#B6C698]"
          value="searchDoctor"
        >
          Search Doctor
        </TabsTrigger>
        <TabsTrigger value="pendingAppointments">
          Pending Appointments
        </TabsTrigger>
        <TabsTrigger value="previousAppointments">Prescriptions</TabsTrigger>
      </TabsList>
      <TabsContent value="searchDoctor">
        <>
          <SearchDoctor onUpdate={setDoctorSearchTerm} />
        </>
        <>
          {isLoading && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <LoadingSpinner />
            </div>
          )}
          {/* //! slight css bug, both specialization and doctorSearchCards loading, misplaces LoadingSpinner above */}
          {!isLoading && doctorList && (
            <DoctorSearchCards
              doctorFetchedData={doctorList}
              currentPage={currentPage}
              recordsPerPage={recordsPerPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      </TabsContent>
      <TabsContent value="pendingAppointments">
        <PatientPendingAppointments />
      </TabsContent>
      <TabsContent value="previousAppointments">
        <PreviousAppointments />
      </TabsContent>
    </Tabs>
  );
};

export default AppointmentPage;
