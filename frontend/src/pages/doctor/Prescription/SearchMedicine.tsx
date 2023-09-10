import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/useDebounce";
import { BrandInfo } from "@/models/Brand";
import { PrescribedMedType } from "@/models/Prescriptions";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FC, useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
  setIsShowInput: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props) => {
  const medSearchName = props.form.watch("name", "");
  const debouncedSearchTerm = useDebounce<string>(medSearchName, 300);
  const navigate = useNavigate();

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
          fetchedMeds.map((med, index) => (
            <HoverCard>
              <HoverCardTrigger
                key={index}
                className="my-2 pl-2 bg-c4 rounded-md flex h-8 items-center "
                onClick={() => {
                  props.form.setValue("name", med.Brand.name);
                  props.form.setValue("brandInfo", med);
                  props.setIsShowInput(false);
                }}
              >
                <img
                  src={med.DosageForm.img_url}
                  className="ml-1 h-6 w-6"
                  placeholder="img_404"
                />
                <p className="pl-3">{med.Brand.name}</p>
                <p className="pl-6">{med.Brand.strength}</p>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="flex flex-col">
                  <div
                    onClick={() =>
                      navigate(
                        `/generic/${
                          med.Generic.id
                        }`
                      )
                    }
                  >
                    <p className="text-c1 font-bold">Generics:</p>{" "}
                    {med.Generic.name}
                  </div>
                  <div
                    onClick={() =>
                      navigate(
                        `/manufacturer/${
                          med.Manufacturer.id
                        }`
                      )
                    }
                  >
                    <p className="text-c1 font-bold">Manufacturer: </p>{" "}
                    {med.Manufacturer.name}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
      </ScrollArea>
    </>
  );
};

export default SearchMedicine;
