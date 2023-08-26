import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchDoctorInfo } from "@/models/Brand";
import { DoctorSearchFormType } from "@/models/FormSchema";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import DoctorSearchCards from "./DoctorSearchCards";
import SearchDoctor from "./SearchDoctor";

const AppointmentPage: FC = () => {
  const [cookies] = useCookies(["user"]);
  const [doctorSearchTerm, setDoctorSearchTerm] =
    useState<DoctorSearchFormType>({ name: "D", department: "2" });
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
        }&specializationID=${searchTerm.department}&pagination=3`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`, // Replace with your actual token
          },
        }
      );
      setDoctorList(response.data);
      setIsLoading(false);
      return response.data;
    };

    console.log(isLoading);
    fetchDoctorsList(doctorSearchTerm, 1, cookies.user.token);
  }, [doctorSearchTerm]);

  return (
    <Tabs defaultValue="searchDoctor">
      <TabsList className="flex justify-center bg- text-c1  border-gray-200 dark:text-gray-400 gap-6 mt-5 ">
        <TabsTrigger value="searchDoctor">Search Doctor</TabsTrigger>
        <TabsTrigger value="pendingAppointments">
          Pending Appointments
        </TabsTrigger>
      </TabsList>
      <TabsContent value="searchDoctor">
        <><SearchDoctor onUpdate={setDoctorSearchTerm} /></>
        <>{isLoading && <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"><LoadingSpinner /></div>}
        {/* //! slight css bug, both specialization and doctorSearchCards loading, misplaces LoadingSpinner above */}
        {!isLoading && doctorList && (
          <DoctorSearchCards
            doctorFetchedData={doctorList}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}</>
      </TabsContent>
      <TabsContent value="pendingAppointments">
        {/* <PatientPendingAppointments/> */}
        <p>HI</p>
      </TabsContent>
    </Tabs>
  );
};

export default AppointmentPage;
