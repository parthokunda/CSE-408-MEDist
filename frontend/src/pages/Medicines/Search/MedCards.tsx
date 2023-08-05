import { BrandInfo } from "@/models/Brand";
import { FC } from "react";
import MedCard from "./MedCard";

const MedCards: FC<{
  brandFetchedData: BrandInfo[] | undefined;
}> = (props) => {
  
  if (props.brandFetchedData && props.brandFetchedData.length === 0) {
    return (
      <div className="flex justify-center align-middle">No Item Found</div>
    );
  }
  return (
    <div className="flex flex-wrap mt-3 gap-6">
      {props.brandFetchedData &&
        props.brandFetchedData.map((medicine) => (
          <MedCard medicine={medicine} key={medicine.Brand.id} />
        ))}
    </div>
  );
};

export default MedCards;
