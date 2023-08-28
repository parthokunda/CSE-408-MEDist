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
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useCookies } from "react-cookie";
import { DoctorOnlineScheduleForm } from "@/models/FormSchema";

export const AddSchedule: FC = () => {
  const forms = useForm<z.infer<typeof DoctorOnlineScheduleForm>>({
    defaultValues: {},
    resolver: zodResolver(DoctorOnlineScheduleForm),
  });

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

  const [size, setSize] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_DB_URL}:${
            import.meta.env.VITE_DB_PORT
          }/api/doctor/profile-info`,
          {
            headers: {
              Authorization: `Bearer ${cookies.user.token}`, // Replace with your actual token
            },
          }
        );
        console.log(
          "🚀 ~ file: AddSchedule.tsx:71 ~ fetchData ~ response:",
          response.data
        );
        setSize(response.data.OnlineSchedule.schedules.length);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    console.log(size);
  }, [size]);

  const [cookies] = useCookies(["user"]);
  const onSubmit: () => void = async () => {
    const values = {
      visitFee: Number(cost),
      schedule: [
        Saturday
          ? {
              weekday: 0,
              startTime: SatStart,
              endTime: SatEnd,
              totalSlots: Number(SatSlots),
            }
          : {},
        Sunday
          ? {
              weekday: 1,
              startTime: SunStart,
              endTime: SunEnd,
              totalSlots: Number(SunSlots),
            }
          : {},
        Monday
          ? {
              weekday: 2,
              startTime: MonStart,
              endTime: MonEnd,
              totalSlots: Number(MonSlots),
            }
          : {},
        Tuesday
          ? {
              weekday: 3,
              startTime: TueStart,
              endTime: TueEnd,
              totalSlots: Number(TueSlots),
            }
          : {},
        Wednesday
          ? {
              weekday: 4,
              startTime: WedStart,
              endTime: WedEnd,
              totalSlots: Number(WedSlots),
            }
          : {},
        Thursday
          ? {
              weekday: 5,
              startTime: ThuStart,
              endTime: ThuEnd,
              totalSlots: Number(ThuSlots),
            }
          : {},
        Friday
          ? {
              weekday: 6,
              startTime: FriStart,
              endTime: FriEnd,
              totalSlots: Number(FriSlots),
            }
          : {},
      ],
    };
    console.log(values.schedule);
    if (size === 0) {
      const response = await axios.post(
        `${import.meta.env.VITE_DB_URL}:${
          import.meta.env.VITE_DB_PORT
        }/api/doctor/online-visit`,
        values,
        {
          headers: {
            Authorization: `Bearer ${cookies.user.token}`, // Replace with your actual token
            "Content-Type": "application/json",
          },
        }
      );
      console.log("🚀 ~ file: AddSchedule.tsx:163 ~ constonSubmit: ~ response:", response.data)
    } else {
      const response = await axios.put(
        `${import.meta.env.VITE_DB_URL}:${
          import.meta.env.VITE_DB_PORT
        }/api/doctor/online-visit`,
        values,
        {
          headers: {
            Authorization: `Bearer ${cookies.user.token}`, // Replace with your actual token
            "Content-Type": "application/json",
          },
        }
      );
      console.log("🚀 ~ file: AddSchedule.tsx:176 ~ constonSubmit: ~ response:", response.data)
    }
    // console.log(values);
    // console.log(response.data);
  };

  return (
    <>
      <div className="flex text-c1 text-large font-bold justify-center mt-6">
        Edit Online Clinic
      </div>

      <div className="flex flex-col ml-6 mt-5 gap-5">
        <div className="flex gap-3">
          Contact Number :
          <Input
            type="text"
            className="flex w-42"
            placeholder={contact}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          Cost :
          <Input
            type="text"
            className="flex w-42"
            placeholder={cost}
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-[60%] flex flex-col ml-6 mt-5 gap-5">
        Edit Schedule
        <div className="grid grid-cols-4 gap-4">
          <div>
            <input
              id="sat"
              type="checkbox"
              checked={Saturday}
              onChange={() => setSaturday(!Saturday)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="sat"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Sat
            </label>
          </div>
          <div>
            <label htmlFor="appt">Choose start time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={SatStart}
              disabled={!Saturday}
              onChange={(e) => {
                setSatStart(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="appt">Choose End time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={SatEnd}
              disabled={!Saturday}
              onChange={(e) => {
                setSatEnd(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              id="appt"
              name="appt"
              className="w-42"
              placeholder="Enter Slots"
              value={SatSlots}
              disabled={!Saturday}
              onChange={(e) => {
                setSatSlots(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              id="sun"
              type="checkbox"
              checked={Sunday}
              onChange={() => setSunday(!Sunday)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="sun"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Sun
            </label>
          </div>
          <div>
            <label htmlFor="appt">Choose start time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={SunStart}
              disabled={!Sunday}
              onChange={(e) => {
                setSunStart(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="appt">Choose End time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={SunEnd}
              disabled={!Sunday}
              onChange={(e) => {
                setSunEnd(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              id="appt"
              name="appt"
              className="w-42"
              placeholder="Enter Slots"
              value={SunSlots}
              disabled={!Sunday}
              onChange={(e) => {
                setSunSlots(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              id="mon"
              type="checkbox"
              checked={Monday}
              onChange={() => setMonday(!Monday)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="mon"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Mon
            </label>
          </div>
          <div>
            <label htmlFor="appt">Choose start time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={MonStart}
              disabled={!Monday}
              onChange={(e) => {
                setMonStart(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="appt">Choose End time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={MonEnd}
              disabled={!Monday}
              onChange={(e) => {
                setMonEnd(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              id="appt"
              name="appt"
              className="w-42"
              placeholder="Enter Slots"
              value={MonSlots}
              disabled={!Monday}
              onChange={(e) => {
                setMonSlots(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              id="tue"
              type="checkbox"
              checked={Tuesday}
              onChange={() => setTuesday(!Tuesday)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="tue"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Tue
            </label>
          </div>
          <div>
            <label htmlFor="appt">Choose start time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={TueStart}
              disabled={!Tuesday}
              onChange={(e) => {
                setTueStart(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="appt">Choose End time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={TueEnd}
              disabled={!Tuesday}
              onChange={(e) => {
                setTueEnd(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              id="appt"
              name="appt"
              className="w-42"
              placeholder="Enter Slots"
              value={TueSlots}
              disabled={!Tuesday}
              onChange={(e) => {
                setTueSlots(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              id="wed"
              type="checkbox"
              checked={Wednesday}
              onChange={() => setWednesday(!Wednesday)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="wed"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Wed
            </label>
          </div>
          <div>
            <label htmlFor="appt">Choose start time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={WedStart}
              disabled={!Wednesday}
              onChange={(e) => {
                setWedStart(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="appt">Choose End time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={WedEnd}
              disabled={!Wednesday}
              onChange={(e) => {
                setWedEnd(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              id="appt"
              name="appt"
              className="w-42"
              placeholder="Enter Slots"
              value={WedSlots}
              disabled={!Wednesday}
              onChange={(e) => {
                setWedSlots(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              id="thu"
              type="checkbox"
              checked={Thursday}
              onChange={() => setThursday(!Thursday)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="thu"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Thu
            </label>
          </div>
          <div>
            <label htmlFor="appt">Choose start time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={ThuStart}
              disabled={!Thursday}
              onChange={(e) => {
                setThuStart(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="appt">Choose End time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={ThuEnd}
              disabled={!Thursday}
              onChange={(e) => {
                setThuEnd(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              id="appt"
              name="appt"
              className="w-42"
              placeholder="Enter Slots"
              value={ThuSlots}
              disabled={!Thursday}
              onChange={(e) => {
                setThuSlots(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              id="fri"
              type="checkbox"
              checked={Friday}
              onChange={() => setFriday(!Friday)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="fri"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Fri
            </label>
          </div>
          <div>
            <label htmlFor="appt">Choose start time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={FriStart}
              disabled={!Friday}
              onChange={(e) => {
                setFriStart(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="appt">Choose End time:</label>
            <input
              type="time"
              id="appt"
              name="appt"
              value={FriEnd}
              disabled={!Friday}
              onChange={(e) => {
                setFriEnd(e.target.value);
              }}
            />
          </div>
          <div>
            <Input
              id="appt"
              name="appt"
              className="w-42"
              placeholder="Enter Slots"
              value={FriSlots}
              disabled={!Friday}
              onChange={(e) => {
                setFriSlots(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      {/* button */}
      <div className="flex justify-center mt-5">
        <Button
          className="flex bg-c2 justify-center w-42 h-10 text-white rounded-lg hover:bg-c1"
          onClick={() => onSubmit()}
        >
          Save
        </Button>
      </div>
    </>
  );
};
export default AddSchedule;
