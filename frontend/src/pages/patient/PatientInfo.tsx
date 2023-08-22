import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "../../components/ui/input";
import { FC, useEffect } from "react";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PatientAdditionalInfoForm } from "@/models/FormSchema";
import { Button } from "@/components/ui/button";
import { useCookies } from "react-cookie";

import axios from "axios";

import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { useQuery } from "@tanstack/react-query";
import { PatientAttributes, UserStatus } from "@/models/UserInfo";
import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import PatientInfoForm from "./PatientInfoForm";

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

  return <PatientInfoForm patientInfo={patientInfo} userToken={cookies.user.token}/>
};

export default PatientInfo;
