import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import { ManufacturerDescription } from "@/models/Brand";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useParams } from "react-router-dom";
// import AvailableBrandCards from "./AvailableBrandCards";
import MedCards from "../SearchMedicines/MedCards";

const fetchManufacturerDescription = async ({
  queryKey,
}): Promise<ManufacturerDescription> => {
  const [_, manufacturerId] = queryKey;
  console.log(
    `http://localhost:3000/api/medicine/get_manufacturer_info/${manufacturerId}`
  );
  const response = await fetch(
    `http://localhost:3000/api/medicine/get_manufacturer_info/${manufacturerId}`
  );
  const data = await response.json();

  console.log("here ",data.result);
  return data.result;
};

//show details of a manufacturer
const ManufacturerDescriptionPage: FC = () => {
  const { manufacturerId } = useParams();

  const {
    data: manufacturer,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["manufacturerDescription", manufacturerId],
    queryFn: fetchManufacturerDescription,
  });

  if (isError) return <p>Error Loading Page</p>;
  if (isLoading)
    return (
      <div className="flex justify-center align-middle">
        <LoadingSpinner />
      </div>
    );
    

  return (
    <div>
      <div className="font-bold text-2xl text-c1">
        {manufacturer.Manufacturer.name}
        </div>
        <p className="text-xl mt-6 font-bold">
          Available Brands
        </p>
        <MedCards brandFetchedData={manufacturer.availableBrands} />
    </div>
  );
};

export default ManufacturerDescriptionPage;
