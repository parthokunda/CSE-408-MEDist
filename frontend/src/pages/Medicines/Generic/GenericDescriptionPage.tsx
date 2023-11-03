import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import { GenericDescription } from "@/models/Brand";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useParams } from "react-router-dom";
import AvailableBrandCards from "./AvailableBrandCards";

const fetchGenericDescription = async ({
  queryKey,
} : any): Promise<GenericDescription> => {
  const [_, genericId] = queryKey;
  const response = await fetch(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/medicine/get_generic_info/${genericId}`
  );
  const data = await response.json();
  console.log(data.result);
  return data.result;
};

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
  const { genericId } = useParams();

  const {
    data: generic,
    isLoading,
    isError,
  } = useQuery({
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
    <div className="flex ">
      <div className="flex-[70%] flex flex-col m-3">
        <p className="text-c1 font-bold text-2xl mt-3">
          {generic.Generic.name}
        </p>
        <p className="opacity-50">{generic.Generic.type}</p>

        {generic.Description.indications && (
          <GenericSingleBox
            boxHeader="Indications"
            boxText={generic.Description.indications}
          />
        )}

        {generic.Description.compositions && (
          <GenericSingleBox
            boxHeader="Compositions"
            boxText={generic.Description.compositions}
          />
        )}

        {generic.Description.pharmacology && (
          <GenericSingleBox
            boxHeader="Pharmacology"
            boxText={generic.Description.pharmacology}
          />
        )}
        {generic.Description.dosage_and_administration && (
          <GenericSingleBox
            boxHeader="Dosage and Administration"
            boxText={generic.Description.dosage_and_administration}
          />
        )}
        {generic.Description.interaction && (
          <GenericSingleBox
            boxHeader="Interaction"
            boxText={generic.Description.interaction}
          />
        )}
        {generic.Description.contraindications && (
          <GenericSingleBox
            boxHeader="Contraindictions"
            boxText={generic.Description.contraindications}
          />
        )}
        {generic.Description.side_effects && (
          <GenericSingleBox
            boxHeader="Side Effects"
            boxText={generic.Description.side_effects}
          />
        )}
        {generic.Description.pregnancy_and_lactation && (
          <GenericSingleBox
            boxHeader="Pregnancy and Lactation"
            boxText={generic.Description.pregnancy_and_lactation}
          />
        )}
        {generic.Description.precautions_and_warnings && (
          <GenericSingleBox
            boxHeader="Precautions and Warning"
            boxText={generic.Description.precautions_and_warnings}
          />
        )}
        {generic.Description.overdose_effects && (
          <GenericSingleBox
            boxHeader="Overdose Effects"
            boxText={generic.Description.overdose_effects}
          />
        )}
        {generic.Description.therapeutic_class && (
          <GenericSingleBox
            boxHeader="Threpeutic Class"
            boxText={generic.Description.therapeutic_class}
          />
        )}
        {generic.Description.storage_conditions && (
          <GenericSingleBox
            boxHeader="Storage Conditions"
            boxText={generic.Description.storage_conditions}
          />
        )}
      </div>
      <div className="flex-[50%] mt-6 ml-3">
        <p className="text-xl justify-center align-middle font-bold">
          Available Brands
        </p>
        <AvailableBrandCards brandFetchedData={generic.availableBrands} />
      </div>
    </div>
  );
};
export default GenericDescriptionPage;
