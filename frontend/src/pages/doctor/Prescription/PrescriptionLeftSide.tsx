import { FC } from "react";
import PrescriptionDiagnosis from "./PrescriptionDiagnosis";
import PrescriptionSymptoms from "./PrescriptionSymptoms";

const PrescriptionLeftSide: FC = () => {
  

  return (
    <>
    <PrescriptionDiagnosis/>
    <PrescriptionSymptoms/>
    </>
  );
};

export default PrescriptionLeftSide;
