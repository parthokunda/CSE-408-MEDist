import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "../../components/ui/input";
import { FC, useEffect } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import DoctorDetailsCard  from "./doctorDetailsCard";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

import { set } from "date-fns";

export const BookAppointment: FC = () => {
  const [Saturday, setSaturday] = useState(false);
  const [Sunday, setSunday] = useState(false);
  const [Monday, setMonday] = useState(false);
  const [Tuesday, setTuesday] = useState(false);
  const [Wednesday, setWednesday] = useState(false);
  const [Thursday, setThursday] = useState(false);
  const [Friday, setFriday] = useState(false);
  const [SatStart, setSatStart] = useState("00:00:00");
  const [SatEnd, setSatEnd] = useState("");
  const [SunStart, setSunStart] = useState("00:00");
  const [SunEnd, setSunEnd] = useState("");
  const [MonStart, setMonStart] = useState("");
  const [MonEnd, setMonEnd] = useState("");
  const [TueStart, setTueStart] = useState("");
  const [TueEnd, setTueEnd] = useState("");
  const [WedStart, setWedStart] = useState("");
  const [WedEnd, setWedEnd] = useState("");
  const [ThuStart, setThuStart] = useState("");
  const [ThuEnd, setThuEnd] = useState("");
  const [FriStart, setFriStart] = useState("");
  const [FriEnd, setFriEnd] = useState("");
  const [SatSlots, setSatSlots] = useState("");
  const [SunSlots, setSunSlots] = useState("");
  const [MonSlots, setMonSlots] = useState("");
  const [TueSlots, setTueSlots] = useState("");
  const [WedSlots, setWedSlots] = useState("");
  const [ThuSlots, setThuSlots] = useState("");
  const [FriSlots, setFriSlots] = useState("");
  const [contact, setContact] = useState("");
  const [cost, setCost] = useState("");

  const days = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  type FormValues = {
    contact: string;
    cost: string;
    days: {
      startTime?: string;
      endTime?: string;
      slot?: string;
    }[];
  };
  const doctor={
    img: "https://www.w3schools.com/howto/img_avatar.png",
    name: "Dr. John Doe",
    degree: "MBBS, FCPS, FRCS",
    department: "ENT",
    bmdcNumber: "123456",
    cost: 500,
    contact: "01712345678",
  };
  const values = {
    contact: "01759881197",
    cost: "500",
    days: [
      { startTime: "12:00", endTime: "14:30", slot: "5" },
      {},
      { startTime: "11:00", endTime: "13:30", slot: "6" },
      {},
      {},
      {},
      {},
    ],
  };
  const [formValues, setFormValues] = useState<FormValues>(values);
  const [dayIndex, setDayIndex] = useState(8);
  const [payed, setPayed] = useState(false);
  const onCall = (obj: FormValues) => {
    setFormValues(obj);
    console.log(obj);
  };
  const OnSubmit: () => void = () => {
    // <Dialog>
    //   <DialogTrigger asChild>
    //     <Button
    //       className="bg-c2 w-42 text-white rounded-lg hover:bg-c1"
    //       onClick={() => {
    //         OnSubmit();
    //       }}
    //       disabled={dayIndex === 8}
    //     >
    //       Book Now
    //     </Button>
    //   </DialogTrigger>
    //   <DialogContent className="sm:max-w-[425px] bg-c4">
    //     <DialogHeader>
    //       <DialogTitle>Payment Completed</DialogTitle>
    //       <DialogDescription>
    //         Your appointment is on : <b className="text-c1">{days[dayIndex]}</b>
    //       </DialogDescription>
    //     </DialogHeader>

    //     <DialogFooter>
    //       <DialogClose asChild>
    //         <Button className="bg-c2 hover:bg-c1">Ok</Button>
    //       </DialogClose>
    //     </DialogFooter>
    //   </DialogContent>
    // </Dialog>
    setPayed(true);
    console.log(dayIndex);
  };
  // onCall(values);
  return (
    <>
      <div className="flex text-c1 text-large font-bold justify-center mt-6">
        Book Appointment
      </div>
      <div className="flex">
        <div className="flex-[10%] flex-col">
          {/* <div className="flex flex-col ml-6 mt-5 gap-5">
            <div className="flex gap-3">
              <div className="flex gap-3">
                Contact Number :
                <div className="flex font-bold text-black">
                  {formValues.contact}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col ml-6 mt-5 gap-5">
            <div className="flex gap-3">
              <div className="flex gap-3">
                Cost :
                <div className="flex font-bold text-black">
                  {formValues.cost}
                </div>
              </div>
            </div>
          </div> */}
          <DoctorDetailsCard doctor={doctor}/>
        </div>
        <div className="flex-[60%] flex-col">
          {formValues.days.map((day, index) => {
            return (
              // <RadioGroup
              //   onValueChange={() => {
              //     setDayIndex(index);
              //   }}
              // >
              <div>
                {Object.keys(day).length !== 0 && (
                  <div className="grid grid-cols-4 ml-4 mt-4 gap-4">
                    <div>
                      <input
                        type="radio"
                        className="h-6 w-6 text-green-600 border-gray-300 focus:ring-green-400"
                        name="day"
                        id={index.toString()}
                        onChange={() => {
                          setDayIndex(index);
                        }}
                      />
                      <label htmlFor={index.toString()}>{days[index]}</label>
                    </div>
                    <div>
                      Start Time: <b>{day.startTime}</b>
                    </div>
                    <div>
                      End Time: <b>{day.endTime}</b>
                    </div>
                    <div>
                      Slot: <b>{day.slot}</b>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

<div className="flex justify-center mt-5">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="bg-c2 w-42 text-white rounded-lg hover:bg-c1"
              onClick={() => {
                OnSubmit();
              }}
              disabled={dayIndex === 8}
            >
              Book Now
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-c4">
            <DialogHeader>
              <DialogTitle>Payment Completed</DialogTitle>
              <DialogDescription>
                Your appointment is on :{" "}
                <b className="text-c1">{days[dayIndex]}</b>
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button className="bg-c2 hover:bg-c1">Ok</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

        </div>
      </div>

      
    </>
  );
};

export default BookAppointment;
