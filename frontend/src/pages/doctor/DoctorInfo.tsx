import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "../../components/ui/input";
import { FC, useEffect } from "react";
import { useState } from "react";
import { DoctorAdditionalInfoForm } from "@/models/FormSchema";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const DoctorInfo: FC = () => {
  const forms = useForm<z.infer<typeof DoctorAdditionalInfoForm>>({
    defaultValues: {
      gender: "male",
      dateOfBirth: new Date("2023-01-01"),
      bmdcNumber: "",
    },
    resolver: zodResolver(DoctorAdditionalInfoForm),
  });

  const onSubmit: SubmitHandler<z.infer<typeof DoctorAdditionalInfoForm>> = (
    data
  ) => {
    console.log(data);
  };
  const [show, setShow] = useState(false);
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
                className="flex gap-2 items-center"
              >
                <div className="flex items-center space-x-2 bg-#FFFFFF">
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
                    {...field}
                  />
                )}
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
                <Input {...field} placeholder="BMDC Number" />
              </div>
            )}
          />
        </div>
        <div className="flex gap-3">
          Issue Date:
          <Controller
          control={forms.control}
          name="issueDate"
          render={({field}) => (
            <div><Input type="date" {...field}/></div>
          )}/>
        </div>
        <Button type="submit" className="bg-c1 text-white hover:bg-c2 mt-4" disabled={!forms.formState.isValid}>
          Submit
        </Button>
      </form>
    </>
  );
};

export default DoctorInfo;
