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
import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { IconContext } from "react-icons";
import { TiTick } from "react-icons/ti";
import SearchMedicine from "./SearchMedicine";

const onMedNameUpdate = (data: PrescribedMedType) => {
  console.log(
    "🚀 ~ file: PrescriptionMedInsert.tsx:10 ~ onSubmit ~ data:",
    data
  );
};

const PrescriptionMedInsert: FC = () => {
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
    },
  });

  const onAddMed = (data: PrescribedMedType) => {
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
        <SearchMedicine form={medSearchForm}/>
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
      <div className="flex items-center justify-center" onClick={medSearchForm.handleSubmit(onAddMed)}>
          <IconContext.Provider value={{ size: "2em" }}>
            <TiTick />
          </IconContext.Provider>
      </div>
    </form>
  );
};

export default PrescriptionMedInsert;
