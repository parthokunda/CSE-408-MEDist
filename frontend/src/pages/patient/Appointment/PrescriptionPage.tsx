import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import useOldPrescriptionStore from "@/hooks/useOldPrescriptionStore";
import usePrescriptionFetchedInfoStore from "@/hooks/usePrescriptionFetchedInfoStore";
import { AppointmentStatus } from "@/models/Appointment";
import {
    GETPrescriptionResponse
} from "@/models/Prescriptions";
import OldPrescriptionView from "@/pages/doctor/Prescription/OldPrescriptionView/OldPrescriptionView";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";

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

const PrescriptionPage: FC = () => {
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
    appStatus === AppointmentStatus.PRESCRIBED
  ) {
    return <OldPrescriptionView/>;
  }
  else return <div>Ki bal prescription</div>
};

export default PrescriptionPage;
