import usePrescriptionFetchedInfoStore from "@/hooks/usePrescriptionFetchedInfoStore";
import { FC } from "react";


const PrescriptionPatientInfo: FC = () => {
  const patientInfo = usePrescriptionFetchedInfoStore(state => state.patientInfo);
  return (
    <div className="flex w-full h-full items-center font-bold text-c1 text-xl">
      <p className="flex-grow pl-4">Name: {patientInfo ? patientInfo.name : "N/A"}</p>
      <p className="flex-grow text-center">Blood: {patientInfo ? patientInfo.bloodGroup : "N/A"}</p>
      <p className="flex-grow text-center">Age: {patientInfo ? patientInfo.age : "N/A"}</p>
      <p className="flex-grow text-center">Height: {patientInfo ? `${patientInfo.height.feet}'${patientInfo.height.inches}''` : "N/A"}</p>
      <p className="flex-grow text-center">Weight: {patientInfo ? patientInfo.weight : "N/A"}</p>
    </div>
  );
};

export default PrescriptionPatientInfo;
