import { FC } from "react";
import { IconContext } from "react-icons";
import { FaPrescription } from "react-icons/fa";
import useOldPrescriptionStore from "@/hooks/useOldPrescriptionStore";
import PrescribedMedInfo from "../PrescribedMedInfo";
import OldPrescriptionRightBottom from "./OldPrescriptionRightBottom";

const OldPrescriptionRightSide: FC = () => {
    const medList = useOldPrescriptionStore(state => state.medList);
  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-flow-row">
        <IconContext.Provider value={{ size: "2em" }}>
          <FaPrescription />
        </IconContext.Provider>
        <div className="grid grid-cols-12 border-b border-black text-slate-500 mt-2">
          <p className="col-span-5 px-2 pl-1">Name</p>
          <p className="col-span-3 pl-1">Dosage</p>
          <p className="col-span-2 pl-1">When</p>
          <p className="col-span-1 pl-1">Duration</p>
          <p className="col-span-1"></p>
        </div>
        {medList.map((med, index) => (
          <div className="grid grid-cols-12 mt-2" key={index}>
            {med && <PrescribedMedInfo med={med} />}
            <p className="col-span-3 pl-1">{med.dosage}</p>
            <p className="col-span-2 pl-1">
              {med.when === "after" ? "After" : "Before"}
            </p>
            <p className="col-span-1 pl-1">{+med.duration}</p>
          </div>
        ))}
      </div>
      <div className="order-1 flex-grow flex items-center h-full">
        <OldPrescriptionRightBottom />
      </div>
    </div>
  );
};

export default OldPrescriptionRightSide;
