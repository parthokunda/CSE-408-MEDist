import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { DoctorSearchForm } from "@/models/FormSchema";
import { FC, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { AiOutlineSearch } from "react-icons/ai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SearchDoctor: FC<{
  formValues: z.infer<typeof DoctorSearchForm>;
  formSubmitHandler: (formData: z.infer<typeof DoctorSearchForm>) => void;
}> = (props) => {
  const forms = useForm<z.infer<typeof DoctorSearchForm>>({
    defaultValues: {
      name: props.formValues.name,
      department: props.formValues.department,
    },
    resolver: zodResolver(DoctorSearchForm),
  });

  const onSubmit: SubmitHandler<z.infer<typeof DoctorSearchForm>> = (data) => {
    props.formSubmitHandler(data);
  };
  const departments = [
    "ENT",
    "Cardiology",
    "Dermatology",
    "Gastroenterology",
    "Gynecology",
    "Neurology",
    "Oncology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
  ];
  useEffect(() => {
    const subscription = forms.watch(() => forms.handleSubmit(onSubmit)());
    console.log(
      "🚀 ~ file: test.tsx:32 ~ useEffect ~ subscription:",
      subscription
    );
    return () => subscription.unsubscribe();
  }, [forms.handleSubmit, forms.watch]);    

  

  return (
    <>
      <form
        onSubmit={forms.handleSubmit(onSubmit)}
        // onChange={forms.handleSubmit(onSubmit)}
        className="flex w-screen justify-start gap-5 items-center"
      >
        <Controller
          name="name"
          control={forms.control}
          render={({ field }) => (
            <div className=" relative w-1/3 ">
              <AiOutlineSearch className="h-8 w-8 absolute p-1 box-border right-3 top-1/2 transform -translate-y-1/2" />
              <Input {...field} placeholder="Search By Name" />
            </div>
          )}
        />
        <div className="flex  w-1/3 m-3 gap-3">
          Specialization:
          <Controller
            name="department"
            control={forms.control}
            render={({ field  }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="flex width-2 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </form>
      <p className="text-red-600 ml-4">
        {forms.formState.errors.name?.message}
      </p>
    </>
  );
};
export default SearchDoctor;
