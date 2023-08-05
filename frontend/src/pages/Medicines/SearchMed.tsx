import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { AiOutlineSearch } from "react-icons/ai";
import { useEffect } from "react";

const FormSchema = z.object({
  searchText: z
    .string()
    .max(20, { message: "Search string length cannot exceed 20" }),
  filterByBrand: z.boolean().default(false),
  filterByGeneric: z.boolean().default(false),
});

export function SearchMed() {
  const forms = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      searchText: "",
      filterByBrand: false,
      filterByGeneric: false,
    },
    resolver: zodResolver(FormSchema),
  });
  // console.log("🚀 ~ file: test.tsx:18 ~ TestForm ~ register:", register)
  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = (data) => {
    console.log(data);
  };

  // console.log(forms.watch("filterByBrand"))
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
        className="flex w-screen justify-start gap-5 items-center"
      >
        <Controller
          name="searchText"
          control={forms.control}
          render={({ field }) => (
            <div className=" relative w-1/2 m-3">
              <AiOutlineSearch className="h-8 w-8  absolute p-1 box-border right-3 top-1/2 transform -translate-y-1/2" />
              <Input {...field} placeholder="Search" />
            </div>
          )}
        />
        <div className="flex w-1/2 m-3 gap-3">
          Filter By:
          <Controller
            name="filterByBrand"
            control={forms.control}
            render={({ field }) => (
              <div className="flex gap-2  items-center">
                <Checkbox
                  className=""
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label>Brand</label>
              </div>
            )}
          />
          <Controller
            name="filterByGeneric"
            control={forms.control}
            render={({ field }) => (
              <div className="flex gap-2 items-center">
                <Checkbox
                  className=""
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label htmlFor="">Generic</label>
              </div>
            )}
          />
        </div>
      </form>
      <p className="text-red-600 ml-4">
        {forms.formState.errors.searchText?.message}
      </p>
    </>
  );
}

export default SearchMed;