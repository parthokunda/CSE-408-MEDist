import { FC } from "react";
import SearchMed from "./SearchMed";

const MedicineSearchPage: FC = () => {
  return <div className="py-3">
    <p className="flex justify-center font-bold text-2xl">Search Medicine</p>
    <SearchMed/>
  </div>;
};

export default MedicineSearchPage;
