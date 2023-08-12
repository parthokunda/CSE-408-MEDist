import { FC, useEffect, useState } from "react";
import SearchMed from "./SearchMed";
import {
  SearchBrandOutput,
  SearchGenericOutput,
  isSearchBrandOutput,
  isSearchGenericOutput,
} from "@/models/Brand";
import MedCards from "./MedCards";
import { z } from "zod";

import { useMutation } from "@tanstack/react-query";
import { MedSearchForm } from "@/models/FormSchema";
import GenericList from "./GenericList";
import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";

const fetchMedList = async (
  formData: z.infer<typeof MedSearchForm>
): Promise<SearchBrandOutput | SearchGenericOutput> => {
  console.log(
    "🚀 ~ file: MedicineSearchPage.tsx:65 ~ fetchMedList ~ formData:",
    formData
  );
  const response = await fetch(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/medicine/get_all_medicines?searchBy=${formData.searchText}&filterBy=${
      formData.filterBy
    }&pagination=60`
  );
  const data = await response.json();
  // await new Promise(resolve => setTimeout(resolve,1000));
  console.log(
    "🚀 ~ file: MedicineSearchPage.tsx:20 ~ fetchMedList ~ results:",
    data.results
  );
  return data.results;
};

const MedicineSearchPage: FC = () => {
  const [searchFormData, setSearchFormData] = useState<
    z.infer<typeof MedSearchForm>
  >({ searchText: "", filterBy: "brands" });

  const updateFormData = (formData: z.infer<typeof MedSearchForm>): void => {
    setSearchFormData(formData);
  };

  useEffect(() => {
    mutate(searchFormData);
  }, [searchFormData]);

  const { data, isError, isLoading, mutate } = useMutation({
    mutationKey: ["medList"],
    mutationFn: fetchMedList,
  });

  return (
    <div className="m-3">
      <p className="flex justify-center font-bold text-2xl m-3">
        Search Medicine
      </p>
      <SearchMed
        formValues={searchFormData}
        formSubmitHandler={updateFormData}
      />
      {isError && <p>Cannot Load Brand Names</p>}
      {isLoading && (
        <div className="flex justify-center align-middle">
          <LoadingSpinner />
        </div>
      )}
      {searchFormData.filterBy === "generics" &&
        data &&
        isSearchGenericOutput(data) && <GenericList genericList={data} />}
      {searchFormData.filterBy === "brands" &&
        data &&
        isSearchBrandOutput(data) && <MedCards brandFetchedData={data} />}

      {/* {searchFormData.filterBy === "brands" && <>Find Brand List</>} */}
    </div>
  );
};

export default MedicineSearchPage;
