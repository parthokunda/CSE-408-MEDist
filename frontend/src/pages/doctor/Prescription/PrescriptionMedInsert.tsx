import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import usePrescribedStore from "@/hooks/usePrescribedStore";
import { PrescribedMedType } from "@/models/Prescriptions";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IconContext } from "react-icons";
import { TiTick } from "react-icons/ti";
import SearchMedicine from "./SearchMedicine";
import { Button } from "@/components/ui/button";

const onMedNameUpdate = (data: PrescribedMedType) => {
  console.log(
    "🚀 ~ file: PrescriptionMedInsert.tsx:10 ~ onSubmit ~ data:",
    data
  );
};

const PrescriptionMedInsert: FC = () => {
  const [isShowInput, setIsShowInput] = useState<boolean>(true);
  const addToPresctionStore = usePrescribedStore((state) => state.addMed);

  const medSearchForm = useForm<PrescribedMedType>({
    defaultValues: {
      name: "",
      when: "before",
      dosage: {
        morning: 0,
        day: 0,
        night: 0,
      },
      duration: 0,
      brandInfo: undefined,
    },
  });

  const onAddMed = (data: PrescribedMedType) => {
    if(data.brandInfo === undefined) {
      return;
    }
    addToPresctionStore(data);
    medSearchForm.reset({
      name: "",
      when: "before",
      dosage: {
        morning: 0,
        day: 0,
        night: 0,
      },
      duration: 0,
    });
    setIsShowInput(true);
  };

  useEffect(() => {
    const subscription = medSearchForm.watch(() =>
      medSearchForm.handleSubmit(onMedNameUpdate)()
    );
    return () => subscription.unsubscribe();
  }, [medSearchForm.handleSubmit, medSearchForm.watch]);

  return (
    <form
      className="grid grid-cols-12 mt-2 gap-1"
      onSubmit={medSearchForm.handleSubmit(onAddMed)}
    >
      <div className="pl-.5 col-span-5">
        {isShowInput && (
          <SearchMedicine form={medSearchForm} setIsShowInput={setIsShowInput}/>
        )}
        {isShowInput || (
          <p
            className="flex items-center text-c1 font-bold mt-2"
            onClick={() => {
              medSearchForm.setValue("brandInfo", undefined);
              setIsShowInput(true);
            }}
          >
            <img
              src={medSearchForm.getValues("brandInfo")?.DosageForm.img_url}
              className="ml-1 h-4 w-4"
              placeholder="img_404"
            />
            <p className="pl-3">
              {medSearchForm.getValues("brandInfo")?.Brand.name}
            </p>
            <p className="pl-6">
              {medSearchForm.getValues("brandInfo")?.Brand.strength}
            </p>
          </p>
        )}
      </div>
      <div className="col-span-3 grid grid-cols-3 gap-0.5">
        <div>
          <Controller
            control={medSearchForm.control}
            name="dosage.morning"
            render={({ field }) => <Input {...field} />}
          />
        </div>
        <div>
          <Controller
            control={medSearchForm.control}
            name="dosage.day"
            render={({ field }) => <Input {...field} />}
          />
        </div>
        <div>
          <Controller
            control={medSearchForm.control}
            name="dosage.night"
            render={({ field }) => <Input {...field} />}
          />
        </div>
      </div>

      <div className="col-span-2">
        <Controller
          control={medSearchForm.control}
          name="when"
          render={({ field }) => (
            <Select onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="before">Before</SelectItem>
                <SelectItem value="after">After</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="col-span-1">
        <Controller
          control={medSearchForm.control}
          name="duration"
          render={({ field }) => <Input {...field} />}
        />
      </div>
      <button
        tabIndex={0}
        className="flex mt-1 mx-2 justify-center h-8 w-8 "
        onClick={medSearchForm.handleSubmit(onAddMed)}
      >
        <IconContext.Provider value={{ size: "2em", color: "blue" }}>
          <TiTick />
        </IconContext.Provider>
      </button>
    </form>
  );
};

export default PrescriptionMedInsert;
