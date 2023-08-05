import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import { GenericDescription } from "@/models/Brand";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import {useParams} from "react-router-dom"
import MedCards from "../SearchMedicines/MedCards";

const fetchGenericDescription = async ({queryKey}) : Promise<GenericDescription> => {
  const [_, genericId] = queryKey;
  console.log(`http://localhost:3000/api/medicine/get_generic_info/${genericId}`);
  const response = await fetch(`http://localhost:3000/api/medicine/get_generic_info/${genericId}`);
  const data = await response.json();
  console.log(data.result);
  return data.result;
}

//show details of a generic
const GenericSingleBox: FC<{ boxHeader: string; boxText: string }> = (
  props
) => {
  return (
    <div className="my-2">
      <div className="bg-c3 text-xl text-c1 py-1 mx rounded-md">
        <b className="ml-3">{props.boxHeader}</b>
      </div>
      <p className="ml-3 mt-1 break-normal whitespace-pre-wrap">
        {props.boxText}
      </p>
    </div>
  );
};

const GenericDescriptionPage: FC = () => {
  const {genericId} = useParams();

  const {data:generic, isLoading, isError} = useQuery({
    queryKey: ["genericDescription", genericId],
    queryFn: fetchGenericDescription,
  });

  if (isError) return <p>Error Loading Page</p>;
  if (isLoading)
    return (
      <div className="flex justify-center align-middle">
        <LoadingSpinner />
      </div>
    );
  
  return (
    <div className="flex flex-col m-3">
      <p className="text-c1 font-bold text-2xl mt-3">{generic.Generic.name}</p>
      <p className="opacity-50">{generic.Generic.type}</p>
      <p className="text-xl mt-6 font-bold">Available Brands</p>
      <MedCards brandFetchedData={generic.availableBrands} />
    </div>
  );
          }
export default GenericDescriptionPage;