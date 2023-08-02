import { Brand } from "@/models/Brand";
import { FC } from "react";
import MedCard, { MedCardLoading } from "./MedCard";

const MedCards: FC<{ brandFetchedData?: any; isLoading: boolean }> = (
  props
) => {
  let brandList: Brand[] | undefined = undefined;
  if (!props.isLoading) {
    brandList = props.brandFetchedData.map((result: any) => {
      return {
        id: result.id,
        name: result.name,
        strength: result.strength,
        generic: result.genericID, // Assuming genericID maps to generic
        manufacturer: result.manufacturerID, // Assuming manufacturerID maps to manufacturer
        dosage: {
          type: result.dosageFormID, // Assuming dosageFormID maps to type
          icon: "", // Add the appropriate icon value here if available in the JSON
        },
      };
    });
  }
  if(props.isLoading) {
    return <div className="flex justify-center align-middle"><MedCardLoading /></div>
  }
  return (
    <div className="flex flex-wrap">
      {brandList && brandList.map((medicine) => (
        <MedCard medicine={medicine} key={medicine.id} />
      ))}
    </div>
  );
};

export default MedCards;
