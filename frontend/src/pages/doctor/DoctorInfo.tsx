import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "../../components/ui/input";
import { FC, useEffect } from "react";
import { useState } from "react";
import { DoctorAdditionalInfoForm } from "@/models/FormSchema";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Divide } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const DoctorInfo: FC = () => {
  const forms = useForm<z.infer<typeof DoctorAdditionalInfoForm>>({
    defaultValues: {
      gender: "male",
      //   dateOfBirth: props.formValues.dateOfBirth,
      //   bmdcNumber: props.formValues.bmdcNumber,
      //   issueDate: props.formValues.issueDate,
      //   department: props.formValues.department,
      //   degree: props.formValues.degree,
    },
    resolver: zodResolver(DoctorAdditionalInfoForm),
  });

  const onSubmit: SubmitHandler<z.infer<typeof DoctorAdditionalInfoForm>> = (
    data
  ) => {
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
  const [show, setShow] = useState(false);
  const onEvan = () => {
    console.log("Evan");
  };
  return (
    <>
      <div className="text-black justify-center text-large font-bold ml-6">
        Additional Info
      </div>
      <form
        onSubmit={forms.handleSubmit(onSubmit)}
        className="flex flex-col w-screen justify-start gap-5 ml-6"
      >
        <div className="flex gap-3">
          Gender:
          <Controller
            name="gender"
            control={forms.control}
            render={({ field }) => (
              <RadioGroup
                defaultValue={field.value}
                onValueChange={field.onChange}
                className="flex flex-row gap-2  items-center"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <label htmlFor="option-one">Male</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <label htmlFor="option-two">Female</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <label htmlFor="option-three">Other</label>
                </div>
              </RadioGroup>
            )}
          />
        </div>
        <div className="flex gap-3">
          Date of Birth:
          <Controller
            name="dateOfBirth"
            control={forms.control}
            render={({ field }) => (
              <div className="">
                {show === false && (
                  <Button
                    type="button"
                    onClick={() => setShow(!show)}
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                )}
                {show === true && (
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    onDayClick={() => setShow(!show)}
                    //   onSelect=
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                )}

                {/* <CalendarIcon className="h-8 w-8" /> */}
              </div>
            )}
          />
        </div>
        <div className="flex gap-3">
          BMDC Number :
          <Controller
            name="bmdcNumber"
            control={forms.control}
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  placeholder="BMDC Number"
                  onChange={() => console.log(field)}
                />
              </div>
            )}
          />
        </div>
        <Button className="bg-c1 text-white hover:bg-c2 mt-4">Submit</Button>
      </form>
    </>
  );
};

export default DoctorInfo;
