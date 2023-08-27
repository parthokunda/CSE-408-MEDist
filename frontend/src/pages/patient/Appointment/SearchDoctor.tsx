import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/lib/useDebounce";
import { SpecializationAttributes } from "@/models/DoctorSchema";
import { DoctorSearchForm, DoctorSearchFormType } from "@/models/FormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineSearch } from "react-icons/ai";


const fetchSpecializations = async (
  userToken: string
): Promise<SpecializationAttributes[]> => {
  console.log("fetching", userToken);
  const response = await axios.get(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/doctor/specialization-list`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`, // Replace with your actual token
      },
    }
  );
  console.log(response.data);
  return response.data;
};

const SearchDoctor: FC<{onUpdate:Function}> = (props) => {
  const [cookies] = useCookies(["user"]);
  const [searchTerm, setSearchTerm] = useState<DoctorSearchFormType>({name:"", department:""});
  const debouncedSearchTerm = useDebounce<DoctorSearchFormType>(searchTerm, 500);

  const {
    data: specializationList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["fetchSpecializationList"],
    queryFn: () => fetchSpecializations(cookies.user.token),
  });

  const onSubmit = (data: DoctorSearchFormType) => {
    setSearchTerm(data);
  };

  const forms = useForm<DoctorSearchFormType>({
    defaultValues: {
      name: "",
      department: "",
    },
    resolver: zodResolver(DoctorSearchForm),
  });

  useEffect(() => {
    const subscription = forms.watch(() => forms.handleSubmit(onSubmit)());
    return () => {subscription.unsubscribe()};
  },[forms.watch, forms.handleSubmit]);

  useEffect(() => {
    // console.log(debouncedSearchTerm);
    props.onUpdate(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <>
      <form
        className="flex ml-3 gap-5 items-center"
        onChange={forms.handleSubmit(onSubmit)}
      >
        <p>Name:</p>
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
        <p className="ml-3">Specialization:</p>
        <Controller
          name="department"
          control={forms.control}
          render={({ field }) => (
            <div className="w-1/4">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="flex width-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-56">
                    {isError && <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500">Error fetching list.</div>}
                    {isLoading && <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"><LoadingSpinner /></div>}
                    {specializationList &&
                      specializationList.map((department) => (
                        <div key={department.id}>
                          <SelectItem
                            value={department.id.toString()}
                          >
                            {department.name}
                          </SelectItem>

                          <Separator className="my-1" />
                        </div>
                      ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </form>
    </>
  );
};

export default SearchDoctor;
