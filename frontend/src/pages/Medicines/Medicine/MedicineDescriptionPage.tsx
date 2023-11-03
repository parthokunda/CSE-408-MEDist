import { FC } from "react";
import { BrandDescription, DescriptionAttributes } from "@/models/Brand";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";

const fetchMedicineDescription = async ({
  queryKey,
}: any): Promise<BrandDescription> => {
  const [_, medicineId] = queryKey;
  const response = await fetch(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/medicine/get_medicine_info/${medicineId}`
  );
  const data = await response.json();
  console.log(
    "🚀 ~ file: MedicineDescriptionPage.tsx:13 ~ fetchMedicineDescription ~ data.result:",
    data.result
  );
  return data.result;
};

const MedCardSingleBox: FC<{ boxHeader: string; boxText: string }> = (
  props
) => {
  return (
    <div className="my-2">
      <div className="bg-c3 text-xl text-c1 py-2 mt-2 rounded-md">
        <b className="ml-3">{props.boxHeader}</b>
      </div>
      <p className="ml-3 mt-1 break-normal whitespace-pre-wrap">
        {props.boxText}
      </p>
    </div>
  );
};

const MedicineDescriptionPage: FC = () => {
  const { medicineId } = useParams();

  const {
    data: medicine,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["medicineDescription", medicineId],
    queryFn: fetchMedicineDescription,
  });
  if (isError) return <p>Error Loading Page</p>;
  if (isLoading)
    return (
      <div className="flex justify-center align-middle">
        <LoadingSpinner />
      </div>
    );

  const description: DescriptionAttributes = medicine.Description;
  return (
    <div className="flex flex-col m-3">
      <div className="flex flex-col my-3 ml-3">
        <div className="flex items-center font-bold text-2xl text-c1">
          {medicine.Brand.name}
          <img
            src={medicine.DosageForm.img_url}
            className="ml-3 h-6 w-6"
            placeholder="img_404"
          />
        </div>
        <p className="opacity-50">{medicine.DosageForm.name}</p>
        <Link to={`/generic/${medicine.Generic.id}`}>
          <p className="hover:text-cyan-700">{medicine.Generic.name}</p>
        </Link>
        <p>{medicine.Brand.strength}</p>
        <Link to={`/manufacturer/${medicine.Manufacturer.id}`}>
          <p className=" opacity-50 hover:text-c2">
            {medicine.Manufacturer.name}
          </p>
        </Link>
        {/* <p className=" opacity-50 hover:text-c2">{medicine.Manufacturer.name}</p> */}
        <p>
          Unit price :
          {medicine.Description.unit_price
            ? medicine.Description.unit_price
            : "19.99 place"}
        </p>
      </div>

      {description.indications && (
        <MedCardSingleBox
          boxHeader="Indications"
          boxText={description.indications}
        />
      )}
      {description.pharmacology && (
        <MedCardSingleBox
          boxHeader="Pharmacology"
          boxText={description.pharmacology}
        />
      )}
      {description.dosage_and_administration && (
        <MedCardSingleBox
          boxHeader="Dosage and Administration"
          boxText={description.dosage_and_administration}
        />
      )}
      {description.interaction && (
        <MedCardSingleBox
          boxHeader="Interaction"
          boxText={description.interaction}
        />
      )}
      {description.contraindications && (
        <MedCardSingleBox
          boxHeader="Contraindiction"
          boxText={description.contraindications}
        />
      )}
      {description.side_effects && (
        <MedCardSingleBox
          boxHeader="Side Effects"
          boxText={description.side_effects}
        />
      )}
      {description.overdose_effects && (
        <MedCardSingleBox
          boxHeader="Overdose Effects"
          boxText={description.overdose_effects}
        />
      )}
      {description.storage_conditions && (
        <MedCardSingleBox
          boxHeader="Storage Condition"
          boxText={description.storage_conditions}
        />
      )}
    </div>
  );
};

export default MedicineDescriptionPage;
