import SearchMed from "@/components/customUI/SearchMed";
import { FC } from "react";

const MedicineSearchPage: FC = () => {
  return <>
    <div className="flex justify-center font-bold text-2xl py-3">Search Medicine</div>
    <SearchMed/>
  </>;
};

export default MedicineSearchPage;
