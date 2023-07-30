
import { TestForm } from "@/components/forms/test";
import { FC } from "react";

const MedicineSearchPage: FC = () => {
  return <div className="py-3">
    <text className="flex justify-center font-bold text-2xl">Search Medicine</text>
    <TestForm/>
  </div>;
};

export default MedicineSearchPage;
