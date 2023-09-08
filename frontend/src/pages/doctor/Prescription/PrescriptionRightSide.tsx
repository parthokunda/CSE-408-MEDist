import { IconContext } from "react-icons";
import { FaPrescription } from "react-icons/fa";
import PrescriptionMedInsert from "./PrescriptionMedInsert";
import usePrescribedStore from "@/hooks/usePrescribedStore";
import { MdCancel } from "react-icons/md";
import PrescribedMeds from "./PrescribedMeds";



function PrescriptionRightSide () {
    const prescrtiptionMeds = usePrescribedStore();
  return (
    <>
      <IconContext.Provider value={{ size: "2em" }}>
        <FaPrescription />
      </IconContext.Provider>

      <div className="grid grid-flow-row">
        <div className="grid grid-cols-12 border-b border-black text-slate-500 mt-2">
          <p className="col-span-5 px-2 pl-1">Name</p>
          <p className="col-span-3 pl-1">Dosage</p>
          <p className="col-span-2 pl-1">When</p>
          <p className="col-span-1 pl-1">Duration</p>
          <p className="col-span-1"></p>
        </div>
        <PrescribedMeds/>
        <PrescriptionMedInsert />
      </div>
    </>
  );
};

export default PrescriptionRightSide;
