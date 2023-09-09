import usePrescribeBottomStore from "@/hooks/usePrescribedBottomStore";
import { FC } from "react";
import PrescriptionAdvices from "./PrescriptionAdvices";
import PrescriptionTests from "./PrescriptionTests";
import PrescriptionMeetAfter from "./PrescriptionMeetAfter";

const PrescriptionRightBottom : FC = () => {
  return <div className="flex flex-col w-full">
  <div className="grid grid-cols-2">
    <PrescriptionAdvices/>
    <PrescriptionTests/>
  </div>
  <div><PrescriptionMeetAfter/></div>
  </div>
};

export default PrescriptionRightBottom;