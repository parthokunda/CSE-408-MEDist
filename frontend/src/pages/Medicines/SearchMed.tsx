import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "../../components/ui/input";
import { AiOutlineSearch } from "react-icons/ai";
import { useEffect } from "react";

const FormSchema = z.object({
  searchText: z
    .string()
    .max(20, { message: "Search string length cannot exceed 20" }),
  filterBy: z.union([z.literal("brands"), z.literal("generics")]),
});

export function SearchMed() {
  const forms = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      searchText: "",
      filterBy: "brands",
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
            <div className=" relative w-1/2 ">
              <AiOutlineSearch className="h-8 w-8  absolute p-1 box-border right-3 top-1/2 transform -translate-y-1/2" />
              <Input {...field} placeholder="Search" />
            </div>
          )}
        />
        <div className="flex  w-1/2 m-3 gap-3">
          Filter By:
          <Controller
            name="filterBy"
            control={forms.control}
            render={({ field }) => (
              <RadioGroup
                defaultValue={field.value}
                onValueChange={field.onChange}
                className="flex flex-row gap-2  items-center"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="brands" id="brands" />
                  <Label htmlFor="option-one">Brands</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="generics" id="generics" />
                  <Label htmlFor="generics">Generics</Label>
                </div>
              </RadioGroup>
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
