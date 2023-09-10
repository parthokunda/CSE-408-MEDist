import { FC } from "react";
import PrescriptionDiagnosis from "./PrescriptionDiagnosis";
import PrescriptionSymptoms from "./PrescriptionSymptoms";
import PrescriptionPastHistory from "./PrescriptionPastHistory";

const PrescriptionLeftSide: FC = () => {
  return (
    <>
    <PrescriptionDiagnosis/>
    <PrescriptionSymptoms/>
    <PrescriptionPastHistory/>
    </>
  );
};

export default PrescriptionLeftSide;
