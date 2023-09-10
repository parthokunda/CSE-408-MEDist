import useOldPrescriptionStore from "@/hooks/useOldPrescriptionStore";
import { FC } from "react";


const OldPrescriptionLeftSide : FC = () => {
    const diagnosisList = useOldPrescriptionStore(state => state.diagnosis);
    const symptomsList = useOldPrescriptionStore(state => state.symptoms);
    const pastHistory = useOldPrescriptionStore(state => state.past_history);
    console.log(diagnosisList);

    return (
        <>
        <div className="flex flex-col">
        <div className="flex items-center pl-4 pt-2">
          <p className="text-c1 font-bold text-xl">Diagnosis</p>
        </div>

        {diagnosisList.map((item, index) => (
          <div className="flex items-center" key={index}>
            <p className="mx-4 text-lg">{item}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center pl-4 pt-2">
          <p className="text-c1 font-bold text-xl">Symptoms</p>
        </div>

        {symptomsList.map((item, index) => (
          <div className="flex items-center" key={index}>
            <p className="mx-4 text-lg">{item}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center pl-4 pt-2">
          <p className="text-c1 font-bold text-xl">Past History</p>
        </div>

        <div className="flex gap-2 mx-4 my-1 items-center">
          <p>{pastHistory}</p>
        </div>
      </div>
        </>
      );
};

export default OldPrescriptionLeftSide;