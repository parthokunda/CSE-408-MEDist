import {
  TableCell,
  TableRow
} from "@/components/ui/table";
import { WeekName } from "@/models/DoctorSchema";
import { sendScheduleInfoType } from "@/pages/doctor/AddSchedule";
import { FC, useEffect, useState } from "react";
import { Input } from "./ui/input";


const ScheudulePerDayInput: FC<{weekName: WeekName, isChecked: boolean, removeHandler: (weekName: WeekName) => void, addHandler: (newScheduleData: sendScheduleInfoType) => void, startTime?: string, endTime?: string, slots?: number, setScheduleError: (weekName: string, isError: boolean) => void}> = (props) => {
  const [startTime, setStartTime] = useState<string>(props.startTime ? props.startTime : "00:00");
  const [endTime, setEndTime] = useState<string>(props.endTime ? props.endTime : "00:00");
  const [totalSlots, setTotalSlots] = useState<number>(props.slots ? props.slots : 0);
  const [isChecked, setIsChecked] = useState<boolean>(props.isChecked);
  const [isError, setIsError] = useState<boolean>(false);
  
  useEffect(() => {
    if((totalSlots === 0 || startTime > endTime) && isChecked) {setIsError(true);}
    else setIsError(false);
    if(isChecked && !(totalSlots === 0 || startTime > endTime)) props.addHandler({weekname: props.weekName, startTime: startTime, endTime: endTime, totalSlots: totalSlots});
    if(!isChecked || (totalSlots === 0 || startTime > endTime)) props.removeHandler(props.weekName);
  },[startTime, endTime, totalSlots, isChecked, setIsError]);

  useEffect(() => {
    props.setScheduleError(props.weekName, isError);
  }, [isError])
  
  return (
    <TableRow className="items-center">
      <TableCell>
        <input
          id="fri"
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 `}
        />
          </TableCell>
        <TableCell
          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          {props.weekName}
        </TableCell>
      <TableCell>
        <input className={`${isChecked && startTime>endTime ? "border-2 border-red-400" : ""}`}
          type="time"
          id="appt"
          name="appt"
          value={startTime ? startTime : ""}
          disabled={!isChecked}
          onChange={(e) => {
            setStartTime(e.target.value);
          }}
        />
      </TableCell>
      <TableCell>
        <input
          className={`${isChecked && startTime>endTime ? "border-2 border-red-400" : ""}`}
          type="time"
          id="appt"
          name="appt"
          value={endTime ? endTime : ""}
          disabled={!isChecked}
          onChange={(e) => {
            setEndTime(e.target.value);
          }}
        />
      </TableCell>
      <TableCell>
        <Input
          id="appt"
          name="appt"
          type="number"
          className={`${isChecked && totalSlots === 0 ? "border-2 border-red-400" : ""} w-42`}
          placeholder="Enter Slots"
          value={totalSlots}
          disabled={!isChecked}
          onChange={(e) => {
            setTotalSlots(e.target.valueAsNumber);
          }}
        />
      </TableCell>
    </TableRow>
  );
};

export default ScheudulePerDayInput;
