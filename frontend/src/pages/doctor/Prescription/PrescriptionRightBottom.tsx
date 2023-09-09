import { FC } from "react";
import PrescriptionAdvices from "./PrescriptionAdvices";
import PrescriptionMeetAfter from "./PrescriptionMeetAfter";
import PrescriptionTests from "./PrescriptionTests";

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