import { FC, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { OnlineScheduleOverviewInfo, WeekName } from "@/models/DoctorSchema";
import { sendScheduleInfoType } from "@/pages/doctor/AddSchedule";

const ScheudulePerDayInput: FC<{weekName: WeekName, isChecked: boolean, removeHandler: (weekName: WeekName) => void, addHandler: (newScheduleData: sendScheduleInfoType) => void, startTime?: string, endTime?: string, slots?: number}> = (props) => {
  const [startTime, setStartTime] = useState<string>(props.startTime ? props.startTime : "00:00");
  const [endTime, setEndTime] = useState<string>(props.endTime ? props.endTime : "00:00");
  const [totalSlots, setTotalSlots] = useState<number>(props.slots ? props.slots : 0);
  const [isChecked, setIsChecked] = useState<boolean>(props.isChecked);
  
  useEffect(() => {
    if(isChecked) props.addHandler({weekname: props.weekName, startTime: startTime, endTime: endTime, totalSlots: totalSlots});
    if(!isChecked) props.removeHandler(props.weekName);
  },[startTime, endTime, totalSlots, isChecked]);
  
  return (
    <div className="grid grid-cols-4 gap-4">
      <div>
        <input
          id="fri"
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="fri"
          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          {props.weekName}
        </label>
      </div>
      <div>
        <label htmlFor="appt">Choose start time:</label>
        <input
          type="time"
          id="appt"
          name="appt"
          value={startTime ? startTime : ""}
          disabled={!isChecked}
          onChange={(e) => {
            setStartTime(e.target.value);
          }}
        />
      </div>
      <div>
        <label htmlFor="appt">Choose End time:</label>
        <input
          type="time"
          id="appt"
          name="appt"
          value={endTime ? endTime : ""}
          disabled={!isChecked}
          onChange={(e) => {
            setEndTime(e.target.value);
          }}
        />
      </div>
      <div>
        <Input
          id="appt"
          name="appt"
          type="number"
          className="w-42"
          placeholder="Enter Slots"
          value={totalSlots}
          disabled={!isChecked}
          onChange={(e) => {
            setTotalSlots(e.target.valueAsNumber);
          }}
        />
      </div>
    </div>
  );
};

export default ScheudulePerDayInput;
