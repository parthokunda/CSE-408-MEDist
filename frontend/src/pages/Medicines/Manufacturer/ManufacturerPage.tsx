import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import { SingleManufacturerInfo } from "@/models/Brand";
import { useQuery } from "@tanstack/react-query";
import { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import AvailableBrandCards from "./AvailableBrandCards";
import MedCards from "../SearchMedicines/MedCards";

// const fetchManufacturerDescription = async ({
//   queryKey,
// }): Promise<SingleManufacturerInfo> => {
//   const [_, manufacturerId] = queryKey;
//   const response = await fetch(
//     `${import.meta.env.VITE_DB_URL}:${
//       import.meta.env.VITE_DB_PORT
//     // }/api/medicine/get_manufacturer_info/${manufacturerId}`
//     }get_manufacturer_info_v2/${manufacturerId}/${currentPage}?pagination=15`
//   );
//   const data = await response.json();

//   console.log("here ", data.result);
//   return data.result;
// };

//show details of a manufacturer
const ManufacturerDescriptionPage: FC = () => {
  const { manufacturerId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const fetchManufacturerDescription = async ({
    queryKey,
  }): Promise<SingleManufacturerInfo> => {
    const [_, manufacturerId] = queryKey;
    const response = await fetch(
      `${import.meta.env.VITE_DB_URL}:${
        import.meta.env.VITE_DB_PORT
        // }/api/medicine/get_manufacturer_info/${manufacturerId}`
      }/api/medicine/get_manufacturer_info_v2/${manufacturerId}/${currentPage}?pagination=15`
    );
    const data = await response.json();
    console.log(
      `${import.meta.env.VITE_DB_URL}:${
        import.meta.env.VITE_DB_PORT
        // }/api/medicine/get_manufacturer_info/${manufacturerId}`
      }/api/medicine/get_manufacturer_info_v2/${manufacturerId}/${currentPage}?pagination=15`
    );
    console.log("here ", data.result);
    return data.result;
  };

  const {
    data: manufacturer,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["manufacturerDescription", manufacturerId],
    queryFn: fetchManufacturerDescription,
  });
  useEffect(() => {
    fetchManufacturerDescription;
  }, [currentPage]);

  if (isError) return <p>Error Loading Page</p>;
  console.log(isLoading);
  if (isLoading)
    return (
      <div className="flex justify-center align-middle">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="px-5">
      <div className="py-3 font-bold text-2xl text-c1">
        {manufacturer.Manufacturer.name}
      </div>
      <p className="text-xl font-bold">Available Brands</p>
      <MedCards
        brandFetchedData={manufacturer.availableBrands}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ManufacturerDescriptionPage;
