import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/useDebounce";
import { BrandInfo, SearchBrandOutput } from "@/models/Brand";
import { PrescribedMedType } from "@/models/Prescriptions";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

const fetchMedList = async (searchTerm: string): Promise<BrandInfo[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/medicine/get_all_medicines/${1}?searchBy=${searchTerm}&pagination=5`
  );
  console.log(
    "🚀 ~ file: SearchMedicine.tsx:15 ~ fetchMedList ~ response:",
    response.data.results
  );
  return response.data.results.brandInfos as BrandInfo[];
};

const SearchMedicine: FC<{
  form: UseFormReturn<PrescribedMedType, any, undefined>;
}> = (props) => {
  const medSearchName = props.form.watch("name", "");
  const debouncedSearchTerm = useDebounce<string>(medSearchName, 300);

  const { mutate: mutateSearch, data: fetchedMeds } = useMutation({
    mutationKey: ["fetchMeds"],
    mutationFn: (searchTerm: string) => fetchMedList(searchTerm),
  });

  useEffect(() => {
    mutateSearch(debouncedSearchTerm);
    props.form.resetField;
  }, [debouncedSearchTerm]);

  return (
    <>
      <Controller
        control={props.form.control}
        name="name"
        render={({ field }) => <Input {...field} />}
      />
      <ScrollArea className="h-max-72 rounded-md py-1">
        {fetchedMeds &&
          fetchedMeds.map((med) => (
            <div
              className="my-2 pl-2 bg-c4 rounded-md flex h-8 items-center "
              onClick={() => props.form.setValue("name", med.Brand.name)}
            >
              <img
                src={med.DosageForm.img_url}
                className="ml-1 h-6 w-6"
                placeholder="img_404"
              />
              <p className="pl-3">{med.Brand.name}</p>
              <p className="pl-6">{med.Brand.strength}</p>
            </div>
          ))}
      </ScrollArea>
    </>
  );
};

export default SearchMedicine;
