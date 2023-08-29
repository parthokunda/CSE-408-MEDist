import ScheudulePerDayInput from "@/components/SchedulePerDayInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  OnlineScheduleOverview,
  OnlineScheduleOverviewInfo,
  WeekName,
  daysOfWeek,
} from "@/models/DoctorSchema";
import { DoctorOnlineScheduleForm } from "@/models/FormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import * as z from "zod";

export type sendScheduleInfoType = {
  weekname: string;
  startTime: string;
  endTime: string;
  totalSlots: number;
};

const getStartTime = (
  weekDay: number,
  scheduleData: OnlineScheduleOverviewInfo[]
) => {
  const foundObject = scheduleData.find(scheduleObj => scheduleObj.weekday === weekDay);
  if(foundObject){
    return foundObject.startTime;
  }
  return undefined;
};

const getEndTime = (
  weekDay: number,
  scheduleData: OnlineScheduleOverviewInfo[]
) => {
  const foundObject = scheduleData.find(scheduleObj => scheduleObj.weekday === weekDay);
  if(foundObject){
    return foundObject.endTime;
  }
  return undefined;
};

const doesExist = (
  weekDay: number,
  scheduleData: OnlineScheduleOverviewInfo[]
): boolean => {
  const exist = scheduleData.some(item => item.weekday === weekDay);
  return exist;
};

const getSlot = (
  weekDay: number,
  scheduleData: OnlineScheduleOverviewInfo[]
) => {
  const foundObject = scheduleData.find(scheduleObj => scheduleObj.weekday === weekDay);
  if(foundObject){
    return foundObject.totalSlots;
  }
  return undefined;
};

export const AddSchedule: FC<{ scheduleData: OnlineScheduleOverview }> = (
  props
) => {
  const [cost, setCost] = useState<number>(props.scheduleData.visit_fee);
  useEffect(() => {
    console.log("🚀 ~ file: AddSchedule.tsx:77 ~ cost:", cost)
    
  },[cost]);

  let allSchedules = props.scheduleData.schedules.map(
    ({ weekname, startTime, endTime, totalSlots }) => ({
      weekname,
      startTime,
      endTime,
      totalSlots,
    })
  );

  const rmeoveScheduleData = (weekName: WeekName) => {
    allSchedules = allSchedules.filter((scheduleObj) => scheduleObj.weekname !== weekName);
  }

  const addScheduleData = (newScheduleData: sendScheduleInfoType) => {
    allSchedules = allSchedules.filter((scheduleObj) => scheduleObj.weekname !== newScheduleData.weekname);
    allSchedules.push(newScheduleData);
    console.log(allSchedules);
  };

  const forms = useForm<z.infer<typeof DoctorOnlineScheduleForm>>({
    defaultValues: {},
    resolver: zodResolver(DoctorOnlineScheduleForm),
  });

  const [cookies] = useCookies(["user"]);
  const onSubmit: () => void = async () => {
    const dataToSubmit  = {
      visitFee: 500,
      schedule: allSchedules,
    }
    console.log("🚀 ~ file: AddSchedule.tsx:105 ~ constonSubmit: ~ dataToSubmit:", dataToSubmit)
    
    if (props.scheduleData.schedules.length === 0 && !props.scheduleData.visit_fee) {
      console.log("POSTING");
      const response = await axios.post(
        `${import.meta.env.VITE_DB_URL}:${
          import.meta.env.VITE_DB_PORT
        }/api/doctor/online-visit`,
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${cookies.user.token}`, // Replace with your actual token
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        "🚀 ~ file: AddSchedule.tsx:163 ~ post: ~ response:",
        response.data
      );
    } else {
      const response = await axios.put(
        `${import.meta.env.VITE_DB_URL}:${
          import.meta.env.VITE_DB_PORT
        }/api/doctor/online-visit`,
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${cookies.user.token}`, // Replace with your actual token
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        "🚀 ~ file: AddSchedule.tsx:176 ~ put: ~ response:",
        response.data
      );
    }
  };

  return (
    <>
      <div className="flex text-c1 text-large font-bold justify-center mt-6">
        Edit Online Clinic
      </div>

      <div className="flex flex-col ml-6 mt-5 gap-5">
        <div className="flex gap-3">
          Cost :
          <Input
            type="number"
            className="flex w-42"
            value={cost}
            onChange={(e) => setCost(e.target.valueAsNumber)}
          />
        </div>
      </div>

      <div className="flex-[60%] flex flex-col ml-6 mt-5 gap-5">
        Edit Schedule
        {daysOfWeek.map((weekDay: WeekName, id: number) => (
          <ScheudulePerDayInput
            weekName={weekDay}
            key={weekDay}
            isChecked={doesExist(id, props.scheduleData.schedules)}
            startTime={getStartTime(id, props.scheduleData.schedules)}
            endTime={getEndTime(id, props.scheduleData.schedules)}
            slots={getSlot(id, props.scheduleData.schedules)}
            addHandler={addScheduleData}
            removeHandler={rmeoveScheduleData}
          />
        ))
        }
      </div>

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
