import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import useOldPrescriptionStore from "@/hooks/useOldPrescriptionStore";
import usePrescriptionFetchedInfoStore from "@/hooks/usePrescriptionFetchedInfoStore";
import { AppointmentStatus } from "@/models/Appointment";
import {
  GETPrescriptionResponse
} from "@/models/Prescriptions";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import PrescriptionButtons from "./PastPrescriptionSide/PrescriptionButtons";
import PrescriptionLeftSide from "./PrescriptionLeftSide";
import PrescriptionPatientInfo from "./PrescriptionPatientInfo";
import PrescriptionRightSide from "./PrescriptionRightSide";
import OldPrescriptionView from "./OldPrescriptionView/OldPrescriptionView";
import PreviousPrescriptions from "./PreviousPrescriptions";

const fetchPrescriptionInfo = async (
  prescriptionId: number,
  authToken: string
): Promise<GETPrescriptionResponse> => {
  const response = await axios.get(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/appointment/prescription/get-prescription/${prescriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`, // Replace with your actual token
        "Content-Type": "application/json",
      },
    }
  );
  console.log(
    "🚀 ~ file: DoctorEditPrescription.tsx:31 ~ response.data:",
    response.data
  );
  return response.data;
};

const DoctorEditPrescription: FC = () => {
  const [appStatus, setAppStatus] = useState<AppointmentStatus>();
  const { prescriptionId } = useParams();
  const [cookies] = useCookies(["user"]);
  const setAllInfo = usePrescriptionFetchedInfoStore(
    (state) => state.setAllInfo
  );
  const setPrescriptionInfo = useOldPrescriptionStore(
    (state) => state.setAllInfo
  );

  if (!prescriptionId) {
    return <>No such ID found</>;
  }

  console.log(prescriptionId, "prescriptionId");
  

  const fetchAndSetPrescriptionData = async () => {
    const prescriptionAllInfo = await fetchPrescriptionInfo(
      parseInt(prescriptionId),
      cookies.user.token
    );
    setAllInfo(prescriptionAllInfo);
    setAppStatus(prescriptionAllInfo.Header.AppointmentPortionInfo.status);
    if (
      prescriptionAllInfo.Header.AppointmentPortionInfo.status ===
        AppointmentStatus.COMPLETED ||
      prescriptionAllInfo.Header.AppointmentPortionInfo.status ===
        AppointmentStatus.PRESCRIBED
    ) {
      setPrescriptionInfo(prescriptionAllInfo);
    }
    return prescriptionAllInfo;
  };

  const { mutate, isLoading, isError } = useMutation({
    mutationKey: ["getPrescriptionInfo"],
    mutationFn: fetchAndSetPrescriptionData,
    // retry: 2,
    // staleTime: Infinity,
    // refetchOnWindowFocus: false,
  });

  useEffect(() => {
    mutate();
  },[prescriptionId])

  if (isError) {
    <p>Errror</p>;
  }

  if (isLoading || !appStatus) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (
    appStatus === AppointmentStatus.COMPLETED ||
    appStatus === AppointmentStatus.PRESCRIBED
  ) {
    return <OldPrescriptionView/>;
  }

  return (
    <div className="grid grid-cols-4 h-screen">
      <div className="col-span-3 h-full">
        <div className="row-span-1 h-16 bg-[#BFD8E0] border border-black border-r-0 border-t-0">
          <PrescriptionPatientInfo />
        </div>
        <div className="row-span-5 grid grid-cols-6 h-screen">
          <div className="col-span-2 bg-[#EFDAEA] h-full">
            <PrescriptionLeftSide />
          </div>
          <div className="col-span-4 bg-[#FFFFFF] h-full p-4">
            <PrescriptionRightSide />
          </div>
        </div>
      </div>
      <div className="col-span-1 bg-[#F4F1E7] h-full border border-black">
        <PrescriptionButtons />
        <PreviousPrescriptions />
      </div>
    </div>
  );
};

export default DoctorEditPrescription;
