import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import { DoctorProfileInfo } from "@/models/DoctorSchema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC } from "react";
import { useCookies } from "react-cookie";
import DoctorInfoForm from "./DoctorInfoForm";

const getDoctorInfo = async(authToken: string) : Promise<DoctorProfileInfo> => {
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
  console.log("🚀 ~ file: DoctorInfo.tsx:20 ~ getDoctorInfo ~ response:", response.data)
  return response.data;
}

const DoctorInfo : FC = () => {
  const [cookies] = useCookies(["user"]);

  const {data: doctorProfileData, isLoading, isError} = useQuery({
    queryKey: ["getDoctorInfo"],
    queryFn: () => getDoctorInfo(cookies.user.token)
  })

  if(isLoading) {
    return <div><LoadingSpinner/></div>
  }
  if(isError){
    return <div>Error</div>
  }

  return <DoctorInfoForm doctorInfo={doctorProfileData.DoctorInfo} specialization={doctorProfileData.Specialization} userToken={cookies.user.token}/>

}


export default DoctorInfo;