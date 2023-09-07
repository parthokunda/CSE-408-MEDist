import { FC } from "react";
import { useParams } from "react-router-dom";
import PrescriptionLeftSide from "./PrescriptionLeftSide";
import PrescriptionPatientInfo from "./PrescriptionPatientInfo";

const DoctorEditPrescription: FC = () => {
  const { prescriptionId } = useParams();
  
  return (
    <div className="grid grid-cols-4 h-screen">
      <div className="col-span-3 h-full">
        <div className="row-span-1 h-16 bg-[#BFD8E0] border border-black border-r-0 border-t-0"><PrescriptionPatientInfo/></div>
        <div className="row-span-5 grid grid-cols-6 h-screen">
            <div className="col-span-2 bg-[#EFDAEA] h-full">
              <PrescriptionLeftSide/>
            </div>
            <div className="col-span-4 bg-[#FFFFFF] h-full">Here</div>
        </div>
      </div>
      <div className="col-span-1 bg-gray-300 h-full border border-black">Past Prescriptions</div>
    </div>
  );
};

export default DoctorEditPrescription;
