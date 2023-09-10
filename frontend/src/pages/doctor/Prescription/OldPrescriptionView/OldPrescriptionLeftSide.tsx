import { GETOldPrescriptionInfo } from "@/models/Prescriptions";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC } from "react";
import { useParams } from "react-router-dom";

const fetchOldPrescriptionInfo = async (prescriptionId:number, authToken: string) : Promise<GETOldPrescriptionInfo> => {
    const response = await axios.get(
        `${import.meta.env.VITE_DB_URL}:${
          import.meta.env.VITE_DB_PORT
        }/api/appointment/prescription/get-prescription/${prescriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Replace with your actual token
            "Content-Type": "application/json",
          },
        }
      );
      console.log("🚀 ~ file: DoctorEditPrescription.tsx:31 ~ response.data:", response.data)
      return response.data;
}

const OldPrescriptionLeftSide : FC = () => {
    const prescriptionId = useParams();
    
    useQuery({
        queryKey:["oldPrescriptionInfo"],
        queryFn: fetchOldPrescriptionInfo,
    });


    if(!prescriptionId){
        return <>Invalid Prescription ID</>
    };


    fetch
    return (
        <>
        <div className="flex flex-col">
        <div className="flex items-center pl-4 pt-2">
          <p className="text-c1 font-bold text-xl">Diagnosis</p>
          <p className="pl-2">(max 3)</p>
        </div>

        {diagnosisList.map((item, index) => (
          <div className="flex items-center" key={index}>
            <p className="mx-4 text-lg">{item}</p>
            <MdCancel onClick={() => removeString(item)} />
          </div>
        ))}

        {diagnosisList.length < 3 && (
          <div className="flex gap-2 mx-4 my-1 items-center">
            <Input
              className="rounded-lg"
              onChange={handleChange}
              value={inputString}
              onKeyDown={handleEnter}
            />
            <AiOutlinePlus onClick={addString} />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center pl-4 pt-2">
          <p className="text-c1 font-bold text-xl">Symptoms</p>
          <p className="pl-2">(max 5)</p>
        </div>

        {symptomsList.map((item, index) => (
          <div className="flex items-center" key={index}>
            <p className="mx-4 text-lg">{item}</p>
            <MdCancel onClick={() => removeString(item)} />
          </div>
        ))}

        {symptomsList.length < 5 && (
          <div className="flex gap-2 mx-4 my-1 items-center">
            <Input
              className="rounded-lg"
              onChange={handleChange}
              value={inputString}
              onKeyDown={handleEnter}
            />
            <AiOutlinePlus onClick={addString} />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center pl-4 pt-2">
          <p className="text-c1 font-bold text-xl">Past History</p>
        </div>

        <div className="flex gap-2 mx-4 my-1 items-center">
          <Textarea
            className="rounded-lg h-36"
            onChange={handleChange}
            value={pastHistory}
          />
        </div>
      </div>
        </>
      );
};

export default OldPrescriptionLeftSide;