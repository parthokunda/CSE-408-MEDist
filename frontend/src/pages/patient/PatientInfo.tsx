import { FC } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

import { useQuery } from "@tanstack/react-query";
import PatientInfoForm from "./PatientInfoForm";

import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import { PatientAttributes } from "@/models/UserInfo";

const getPatientInfo = async (
  bearerToken: string
): Promise<PatientAttributes> => {
  const response = await axios.get(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/patient/additional-info`,
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`, // Replace with your actual token
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.PatientInfo;
};

export const PatientInfo: FC = () => {
  const [cookies] = useCookies(["user"]);
  
  const {data: patientInfo, isLoading, isError, isFetched} = useQuery({
    queryKey: ["getPatientInfo"],
    queryFn: () => getPatientInfo(cookies.user.token),
  });
  
  if(isError)
    return <p>Error Getting info</p>

  if(isLoading || !isFetched){
    return <LoadingSpinner/>
  }

  //we will probably navigate to a default page from here
  // if(patientInfo.status && patientInfo.status.startsWith(UserStatus.FULLY_REGISTERED)){
  //   return <p>You are fully registered</p>
  // }

  console.log(patientInfo);

  return <PatientInfoForm patientInfo={patientInfo} userToken={cookies.user.token}/>
};

export default PatientInfo;
