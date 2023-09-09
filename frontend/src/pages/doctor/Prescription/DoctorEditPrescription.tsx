import { FC } from "react";
import { useParams } from "react-router-dom";
import PrescriptionLeftSide from "./PrescriptionLeftSide";
import PrescriptionPatientInfo from "./PrescriptionPatientInfo";
import PrescriptionRightSide from "./PrescriptionRightSide";
import { Button } from "@/components/ui/button";
import usePrescribedLeftStore from "@/hooks/usePrescribedLeftStore";
import usePrescribedStore from "@/hooks/usePrescribedStore";
import usePrescribeBottomStore from "@/hooks/usePrescribedBottomStore";
import PrescriptionButtons from "./PastPrescriptionSide/PrescriptionButtons";

const DoctorEditPrescription: FC = () => {
  const { prescriptionId } = useParams();
  const diagnosis = usePrescribedLeftStore(state => state.diagnosis);
  const symptoms = usePrescribedLeftStore(state => state.symptoms);
  const pastHistory = usePrescribedLeftStore(state => state.pastHistory);
  const brands = usePrescribedStore(state => state.medList);
  const advices = usePrescribeBottomStore(state => state.advices);
  const tests = usePrescribeBottomStore(state => state.tests);
  const meetAfter = usePrescribeBottomStore(state => state.meetAfter);
  const onSavePrescription = () => {
    console.log({brands, diagnosis, symptoms})
  }
  
  return (
    <div className="grid grid-cols-4 h-screen">
      <div className="col-span-3 h-full">
        <div className="row-span-1 h-16 bg-[#BFD8E0] border border-black border-r-0 border-t-0"><PrescriptionPatientInfo/></div>
        <div className="row-span-5 grid grid-cols-6 h-screen">
            <div className="col-span-2 bg-[#EFDAEA] h-full">
              <PrescriptionLeftSide/>
            </div>
            <div className="col-span-4 bg-[#FFFFFF] h-full p-4">
              <PrescriptionRightSide/>
            </div>
        </div>
      </div>
      <div className="col-span-1 bg-[#F4F1E7] h-full border border-black">
        <PrescriptionButtons/>
      </div>
    </div>
  );
};

export default DoctorEditPrescription;
