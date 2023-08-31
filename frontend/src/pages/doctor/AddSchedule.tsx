import ScheudulePerDayInput from "@/components/SchedulePerDayInput";
import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import {
  OnlineScheduleOverview,
  OnlineScheduleOverviewInfo,
  WeekName,
  daysOfWeek,
} from "@/models/DoctorSchema";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

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
  const foundObject = scheduleData.find(
    (scheduleObj) => scheduleObj.weekday === weekDay
  );
  if (foundObject) {
    return foundObject.startTime;
  }
  return undefined;
};

const getEndTime = (
  weekDay: number,
  scheduleData: OnlineScheduleOverviewInfo[]
) => {
  const foundObject = scheduleData.find(
    (scheduleObj) => scheduleObj.weekday === weekDay
  );
  if (foundObject) {
    return foundObject.endTime;
  }
  return undefined;
};

const doesExist = (
  weekDay: number,
  scheduleData: OnlineScheduleOverviewInfo[]
): boolean => {
  const exist = scheduleData.some((item) => item.weekday === weekDay);
  return exist;
};

const getSlot = (
  weekDay: number,
  scheduleData: OnlineScheduleOverviewInfo[]
) => {
  const foundObject = scheduleData.find(
    (scheduleObj) => scheduleObj.weekday === weekDay
  );
  if (foundObject) {
    return foundObject.totalSlots;
  }
  return undefined;
};

export const AddSchedule: FC<{ scheduleData: OnlineScheduleOverview }> = (
  props
) => {
  const [cost, setCost] = useState<number>(props.scheduleData.visit_fee);
  const [scheduleErrors, setScheduleErrors] = useState<string[]>([]);
  const { toast } = useToast();
  const [allSchedules, setAllSchedules] = useState(props.scheduleData.schedules.map(
    ({ weekname, startTime, endTime, totalSlots }) => ({
      weekname,
      startTime,
      endTime,
      totalSlots,
    })
  ));

  const updateScheduleError = (weekName : string, isError: boolean) => {
    if(isError) setScheduleErrors( prevState => {
      if(!prevState.includes(weekName))  { prevState.push(weekName); return prevState;}
      else return prevState;
    });
    if(!isError){
      setScheduleErrors( prevState => {
        if(prevState.includes(weekName)) return prevState.filter(item => item !== weekName);
        else return prevState;
      })
    }
  }

  useEffect(() => {
    console.log(scheduleErrors, "errors in schedule");
  }, [scheduleErrors]);

  useEffect(() => {
    console.log("allSchedules ", allSchedules);
  },[allSchedules]);

  const rmeoveScheduleData = (weekName: WeekName) => {
    setAllSchedules(prevSchedules => {
      return prevSchedules.filter(scheduleObj => scheduleObj.weekname !== weekName);
    })
  };

  const addScheduleData = (newScheduleData: sendScheduleInfoType) => {
    setAllSchedules(prevSchedules => {
      prevSchedules = prevSchedules.filter(
        (scheduleObj) => scheduleObj.weekname !== newScheduleData.weekname
      );
      prevSchedules.push(newScheduleData);
      return prevSchedules;
    });
  };

  const [cookies] = useCookies(["user"]);
  const onSubmit: () => void = async () => {
    const dataToSubmit = {
      visitFee: cost,
      schedule: allSchedules,
    };
    console.log("🚀 ~ file: AddSchedule.tsx:132 ~ constonSubmit: ~ dataToSubmit:", dataToSubmit)

    if (
      props.scheduleData.schedules.length === 0 &&
      !props.scheduleData.visit_fee
    ) {
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
    toast({
      title: "Submitted",
      description: "Schedule Submitted",
      action: (
        <ToastAction altText="Goto schedule to undo">OK</ToastAction>
      ),
    })
    
  };

  return (
    <>
      <p className="flex text-c1 text-3xl font-bold justify-center mt-6">
        Edit Online Clinic
      </p>

      <div className="flex flex-col m-6 gap-5">
        <div className="flex gap-3 items-center">
          Cost :
          <Input
            type="number"
            className="flex w-42"
            value={cost}
            onChange={(e) => setCost(e.target.valueAsNumber)}
          />
        </div>
      </div>

      <div className="flex flex-col m-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Week Day</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Total Slot</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
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
                setScheduleError={updateScheduleError}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center mt-5">
        <Button
          className="flex bg-c2 justify-center w-42 h-10 text-white rounded-lg hover:bg-c1"
          onClick={() => {
            if(scheduleErrors.length === 0) onSubmit();
            else {
              console.log("error should see toast");
              toast({
                title: "Error on Form",
                description: "StartTime should be less than EndTime and TotalSlots > 0",
                action: (
                  <ToastAction altText="Goto schedule to undo">OK</ToastAction>
                ),
              })
            }
          }}
        >
          Save
        </Button>
      </div>
      <Toaster/>
    </>
  );
};
export default AddSchedule;
