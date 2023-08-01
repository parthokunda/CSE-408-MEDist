import { Brand } from "@/models/Brand";
import { FC } from "react";
import MedCard from "./MedCard";

const MedCards: FC<{ medicineList: Brand[] }> = (props) => {
  return (
    <div className="flex flex-wrap">
      {props.medicineList.map((medicine) => (
        <MedCard medicine={medicine}/>
      ))}
    </div>
  );
};

export default MedCards;