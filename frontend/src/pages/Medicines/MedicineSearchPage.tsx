import { FC } from "react";
import SearchMed from "./SearchMed";
// import { Brand } from "@/models/Brand";
import { BrandInfo } from "@/models/Brand";
import MedCards from "./MedCards";
import { useQuery } from "@tanstack/react-query";

// const medicineList: Brand[] = [
//   {
//     id: 1,
//     name: "Napa",
//     strength: "500mg",
//     generic: "Paracetamol",
//     manufacturer: "Beximco Pharama",
//     dosage: { type: "Suppository", icon: "dummy" },
//   },
//   {
//     id: 2,
//     name: "Napa",
//     strength: "500mg",
//     generic: "Paracetamol",
//     manufacturer: "Beximco Pharama",
//     dosage: { type: "Suppository", icon: "dummy" },
//   },
//   {
//     id: 3,
//     name: "Napa",
//     strength: "500mg",
//     generic: "Paracetamol",
//     manufacturer: "Beximco Pharama",
//     dosage: { type: "Suppository", icon: "dummy" },
//   },
//   {
//     id: 4,
//     name: "Napa",
//     strength: "500mg",
//     generic: "Paracetamol",
//     manufacturer: "Beximco Pharama",
//     dosage: { type: "Suppository", icon: "dummy" },
//   },
//   {
//     id: 5,
//     name: "Napa",
//     strength: "500mg",
//     generic: "Paracetamol",
//     manufacturer: "Beximco Pharama",
//     dosage: { type: "Suppository", icon: "dummy" },
//   },
//   {
//     id: 6,
//     name: "Napa",
//     strength: "500mg",
//     generic: "Paracetamol",
//     manufacturer: "Beximco Pharama",
//     dosage: { type: "Suppository", icon: "dummy" },
//   },
// ];

const fetchMedList = async () : Promise<BrandInfo[]> => {
  const response = await fetch(
    "http://localhost:3000/api/medicine/get_all_medicines?searchBy=&filterBy=brands"
  );
  const data = await response.json();
  // await new Promise(resolve => setTimeout(resolve,1000));
  return data.results;
};

const MedicineSearchPage: FC = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["medList"],
    queryFn: fetchMedList,
  });

  return (
    <div className="py-3">
      <p className="flex justify-center font-bold text-2xl">Search Medicine</p>
      <SearchMed />
      {isError && <p>Cannot Load Brand Names</p>}
      {/* {isLoading && <MedCards isLoading={isLoading} />} */}
      <MedCards isLoading={isLoading} brandFetchedData={data} />
    </div>
  );
};

export default MedicineSearchPage;
