import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import { DoctorAttributes, DoctorProfileInfo, OnlineScheduleOverview } from "@/models/DoctorSchema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC } from "react";
import { useCookies } from "react-cookie";
import DoctorInfoForm from "./DoctorInfoForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddSchedule from "./AddSchedule";

const getDoctorInfo = async (authToken: string): Promise<DoctorProfileInfo> => {
  const response = await axios.get(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/doctor/profile-info`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`, // Replace with your actual token
        "Content-Type": "application/json",
      },
    }
  );
  console.log(
    "🚀 ~ file: DoctorInfo.tsx:20 ~ getDoctorInfo ~ response:",
    response.data
  );
  return response.data;
};

const getDefaultTab = (doctorInfoData : DoctorAttributes, scheduleData: OnlineScheduleOverview) : "schedule" | "info" => {
  for(const key in doctorInfoData){
    if(key !== 'image' && doctorInfoData[key] === null){
      return "info";
    }
  }
  if(scheduleData.visit_fee === null || scheduleData.schedules.length === 0){
    return "schedule"
  }

  return "info";
} 

const DoctorInfo: FC = () => {
  const [cookies] = useCookies(["user"]);

  const {
    data: doctorProfileData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getDoctorInfo"],
    queryFn: () => getDoctorInfo(cookies.user.token),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center mt-12">
        <LoadingSpinner />
      </div>
    );
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <Tabs defaultValue={getDefaultTab(doctorProfileData.DoctorInfo, doctorProfileData.OnlineSchedule)}>
      <TabsList className="flex justify-center bg- text-c1  border-gray-200 dark:text-gray-400 gap-6 mt-5 ">
        <TabsTrigger value="info">Account Info</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
      </TabsList>
      <TabsContent value="info">
        <DoctorInfoForm
          doctorInfo={doctorProfileData.DoctorInfo}
          specialization={doctorProfileData.Specialization}
          userToken={cookies.user.token}
        />
      </TabsContent>
      <TabsContent value="schedule">
        <AddSchedule scheduleData={doctorProfileData.OnlineSchedule}/>
      </TabsContent>
    </Tabs>
  );
};

export default DoctorInfo;
