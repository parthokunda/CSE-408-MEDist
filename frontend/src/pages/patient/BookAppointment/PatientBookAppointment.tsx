import { FC, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import DoctorDetailsCard from "./DoctorDetailsCard";

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


import axios from "axios";
import { useCookies } from "react-cookie";

import {
  DoctorProfileInfo,
  SingleDaySchedule
} from "@/models/DoctorSchema";

export const BookAppointment: FC = () => {
  const { doctorID } = useParams();
  console.log(doctorID);
  const [cookies] = useCookies(["user"]);
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
    "Friday",
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
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
  const doctor = {
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
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [totalslot, setSlot] = useState(0);
  const [payed, setPayed] = useState(false);
  const onCall = (obj: FormValues) => {
    setFormValues(obj);
    console.log(obj);
  };
  const [singleDay, setSingleDay] = useState<SingleDaySchedule>();
  // console.log(cookies.user.token);
  // const [weekdays, setWeekdays] = useState<SingleDaySchedule[]>
  // var doctordetails: DoctorProfileInfo;
  const [doctordetails, setDoctorDetails] = useState<DoctorProfileInfo>();
  useEffect(() => {
    async function fetchData() {
      try {
        axios
          .get(
            `${import.meta.env.VITE_DB_URL}:${
              import.meta.env.VITE_DB_PORT
            }/api/doctor/profile-info/${doctorID}`,
            {
              headers: {
                Authorization: `Bearer ${cookies.user.token}`, // Replace with your actual token
              },
            }
          )
          .then((response) => {
            console.log("🚀 ~ file: PatientBookAppointment.tsx:133 ~ .then ~ response:", response.data)
            setDoctorDetails(response.data);
            // setDayIndex()
          });
        // setSize(response.data.OnlineSchedule.schedule.length);
        // setContact(response.data.doctorInfo.phone);
        // setDoctorDetails(response.data);
        // console.log(doctordetails);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  const OnSubmit: () => void = () => {
    setPayed(true);
    console.log(dayIndex);
    console.log("day is", singleDay);
    const val={
      weekday : singleDay?.weekday,
      startTime : singleDay?.startTime,
      endTime : singleDay?.endTime,
      totalSlots : singleDay?.totalSlots,
    }
    console.log(val);
    const msg = axios.post(
      `${import.meta.env.VITE_DB_URL}:${
        import.meta.env.VITE_DB_PORT
      }/api/appointment/book-online-appointment/${doctorID}`,
      val,
      {
        headers: {
          Authorization: `Bearer ${cookies.user.token}`, // Replace with your actual token
          "Content-Type": "application/json",
        },
      }
    );
  };
  // console.log(doctordetails?.OnlineSchedule.schedule);
  // onCall(values);
  return (
    <>
      <div className="flex text-c1 text-large font-bold justify-center mt-6">
        Book Appointment
      </div>
      <div className="flex">
        <div className="w-1/4">
          {doctordetails && <DoctorDetailsCard doctor={doctordetails!} />}
        </div>
        {doctordetails && doctordetails.OnlineSchedule.schedule && (
          <div className="flex-[60%] flex-col">
            {/* {doctordetails?.OnlineSchedule.schedule.map((day) => {
              return (
                // <RadioGroup
                //   onValueChange={() => {
                //     setDayIndex(index);
                //   }}
                // >
                <div>
                   
                    <div className="grid grid-cols-4 ml-4 mt-4 gap-4">
                      <div>
                        <input
                          type="radio"
                          className="h-6 w-6 text-green-600 border-gray-300 focus:ring-green-400"
                          name="day"
                          id={day.weekday.toString()}
                          
                          onChange={() => {
                            setDayIndex(day.weekday);
                            setSingleDay(day);
                          }}
                        />
                        <label htmlFor={day.weekday.toString()}>{days[day.weekday]}</label>
                      </div>
                      <div>
                        Start Time: <b>{day.startTime}</b>
                      </div>
                      <div>
                        End Time: <b>{day.endTime}</b>
                      </div>
                      <div>
                        Slot: <b>{day.totalSlots}</b>
                      </div>
                    </div>
                  
                </div>
              );
            })} */}

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
        )}
      </div>
    </>
  );
};

export default BookAppointment;
