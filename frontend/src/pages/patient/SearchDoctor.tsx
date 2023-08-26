import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { DoctorSearchForm } from "@/models/FormSchema";
import { FC, useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { AiOutlineSearch } from "react-icons/ai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCookies } from "react-cookie";
import axios from "axios";
import { SpecializationAttributes } from "@/models/Brand";
import { Button } from "../../components/ui/button";

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
  const [cookies] = useCookies(["user"]);
  const [specializations, setSpecializations] = useState<
    SpecializationAttributes[]
  >([]);

  useEffect(() => {
    async function fetchSpecializations() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_DB_URL}:${
            import.meta.env.VITE_DB_PORT
          }/api/doctor/specialization-list`,
          {
            headers: {
              Authorization: `Bearer ${cookies.user.token}`, // Replace with your actual token
            },
          }
        );
        setSpecializations(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchSpecializations();
  }, []);

  return (
    <>
      <form
        onSubmit={forms.handleSubmit(onSubmit)}
        className="flex w-screen justify-start gap-5 items-center"
      >
        <Controller
          name="name"
          control={forms.control}
          render={({ field }) => (
            <div className="relative w-1/3 ">
              <AiOutlineSearch className="h-8 w-8 absolute p-1 box-border right-3 top-1/2 transform -translate-y-1/2" />
              <Input {...field} placeholder="Search By Name" />
            </div>
          )}
        />
        <div className="flex w-1/3 m-3 gap-3">
          Specialization:
          <Controller
            name="department"
            control={forms.control}
            render={({ field }) => (
              <div className="flex-[50%] w-200px">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="flex width-full bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((department) => (
                      <SelectItem
                        key={department.name}
                        value={department.id.toString()}
                      >
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </div>
        <Button type="submit" className="flex bg-c2 hover:bg-c1">
          Search
        </Button>
      </form>

      <p className="text-red-600 ml-4">
        {forms.formState.errors.name?.message}
      </p>
    </>
  );
};
export default SearchDoctor;
