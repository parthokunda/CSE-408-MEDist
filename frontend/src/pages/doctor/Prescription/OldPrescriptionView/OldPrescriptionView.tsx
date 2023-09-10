import { Button } from "@/components/ui/button";
import { FC } from "react";
import PrescriptionPatientInfo from "../PrescriptionPatientInfo";
import PreviousPrescriptions from "../PreviousPrescriptions";
import OldPrescriptionLeftSide from "./OldPrescriptionLeftSide";
import OldPrescriptionRightSide from "./OldPrescriptionRightSide";
import useOldPrescriptionStore from "@/hooks/useOldPrescriptionStore";

const OldPrescriptionView: FC = () => {
  const downloadLink = useOldPrescriptionStore(state => state.downloadLink);
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
        <div className="flex w-full mt-4 justify-around">
          <a href={downloadLink} target="_blank">
            <Button className="bg-c1 h-12 w-28">Download</Button>
          </a>
        </div>
        <PreviousPrescriptions />
      </div>
    </div>
  );
};

export default OldPrescriptionView;
