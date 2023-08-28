import {
  Card,
  CardContent
} from "@/components/ui/card";
import { FC } from "react";

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

import { Button } from "@/components/ui/button";
import { PendingAppointmentOverviewInfo } from "@/models/Appointment";


const DoctorPendingCard: FC<{ app: PendingAppointmentOverviewInfo }> = (props) => {
  // convert Date to date and time
  console.log(props.app);
  const date = new Date(props.app.startTime);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  var hr = hour.toString();
  if (hour < 10) hr = hour.toString().padStart(2, "0");
  const minute = date.getMinutes();
  var min = minute.toString();
  if (minute < 10) min = minute.toString().padStart(2, "0");
  const dateStr = `${day}/${month}/${year}`;
  const timeStr = `${hr}:${min}`;
  function isAvailable() {
    if (date < new Date()) return false;
    return true;
  }


  return (
    <div>
      <Card className="flex flex-col drop-shadow-lg overflow-hidden mx-3">
        <CardContent className="p-2 px-0">
          <div className="grid grid-cols-5 gap-4 align-middle">
            <div className="flex text-xl items-center justify-center">{props.app.id}</div>
            <div className="flex text-c1 text-xl font-bold items-center justify-center">
              {props.app.patientInfo?.name}
            </div>
            <div className="flex text-xl items-center justify-center">{dateStr}</div>
            <div className="flex text-xl items-center justify-center">{timeStr}</div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  disabled={!isAvailable()}
                  className="bg-c2 w-42 text-white rounded-lg hover:bg-c1 m-2"
                  onClick={() => {
                    navigator.clipboard.writeText(props.app.meetingLink ? props.app.meetingLink : "");
                    console.log("Link Copied");
                  }}
                >
                  Get Link
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-c4">
                <DialogHeader>
                    <DialogTitle>Link Copied to Clipboard</DialogTitle>
                    <DialogDescription>
                        Your Link is : <b className="text-c1">{props.app.meetingLink}</b>
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild>
                  <Button className="bg-c2 hover:bg-c1">OK</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default DoctorPendingCard;
