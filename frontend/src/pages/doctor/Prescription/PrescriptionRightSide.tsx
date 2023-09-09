import { IconContext } from "react-icons";
import { FaPrescription } from "react-icons/fa";
import PrescribedMeds from "./PrescribedMeds";
import PrescriptionMedInsert from "./PrescriptionMedInsert";
import PrescriptionRightBottom from "./PrescriptionRightBottom";

function PrescriptionRightSide() {
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
        <PrescribedMeds />
        <PrescriptionMedInsert />
      </div>
      <div className="order-1 flex-grow flex items-center h-full">
          <PrescriptionRightBottom />
      </div>
    </div>
  );
}

export default PrescriptionRightSide;
