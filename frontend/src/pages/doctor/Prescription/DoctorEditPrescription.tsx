import { FC } from "react";
import { useParams } from "react-router-dom";
import PrescriptionButtons from "./PastPrescriptionSide/PrescriptionButtons";
import PrescriptionLeftSide from "./PrescriptionLeftSide";
import PrescriptionPatientInfo from "./PrescriptionPatientInfo";
import PrescriptionRightSide from "./PrescriptionRightSide";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import axios from "axios";
import { GETPrescriptionHeaderResponse } from "@/models/Prescriptions";
import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import usePrescriptionFetchedInfoStore from "@/hooks/usePrescriptionFetchedInfo";

const fetchPrescriptionInfo = async (
  prescriptionId: number,
  authToken: string
): Promise<GETPrescriptionHeaderResponse> => {
  console.log("requesting", authToken);
  const response = await axios.get(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/appointment/prescription/generate-prescription-header/${prescriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`, // Replace with your actual token
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const DoctorEditPrescription: FC = () => {
  const { prescriptionId } = useParams();
  const [cookies] = useCookies(["user"]);
  const setAllInfo = usePrescriptionFetchedInfoStore(state => state.setAllInfo);


  if (!prescriptionId) {
    return <>No such ID found</>;
  }

  const fetchAndSetPrescriptionData = async () => {
    const prescriptionAllInfo = await fetchPrescriptionInfo(
      parseInt(prescriptionId),
      cookies.user.token
    );

    setAllInfo(prescriptionAllInfo);
    return prescriptionAllInfo;
  };

  const {
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getPrescriptionInfo"],
    queryFn: fetchAndSetPrescriptionData,
    retry: 2,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  if (isError) {
    <p>Loading errror</p>;
  }

  if (isLoading) {
    <LoadingSpinner />;
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
      </div>
    </div>
  );
};

export default DoctorEditPrescription;
