import { FC } from "react";
import PrescriptionPatientInfo from "../PrescriptionPatientInfo";
import OldPrescriptionLeftSide from "./OldPrescriptionLeftSide";
import OldPrescriptionRightSide from "./OldPrescriptionRightSide";
import PastPrescriptions from "../PastPrescriptionSide/PastPrescription";
import PreviousPrescriptions from "../PreviousPrescriptions";



const OldPrescriptionView: FC = () => {

  return (
    <div className="grid grid-cols-4 h-screen">
      <div className="col-span-3 h-full">
        <div className="row-span-1 h-16 bg-[#BFD8E0] border border-black border-r-0 border-t-0">
          <PrescriptionPatientInfo />
        </div>
        <div className="row-span-5 grid grid-cols-6 h-screen">
          <div className="col-span-2 bg-[#EFDAEA] h-full">
            <OldPrescriptionLeftSide />
          </div>
          <div className="col-span-4 bg-[#FFFFFF] h-full p-4">
            <OldPrescriptionRightSide />
          </div>
        </div>
      </div>
      <div className="col-span-1 bg-[#F4F1E7] h-full border border-black">
        <PreviousPrescriptions/>
      </div>
    </div>
  );
};

export default OldPrescriptionView;
