import { FC, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DoctorPendingAttributes } from "@/models/Brand";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";

const DoctorPendingCard: FC<{ doctor: DoctorPendingAttributes }> = (props) => {
  // convert Date to date and time
  const date = props.doctor.date;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  var hr = hour.toString();
  if (hour < 10) hr = hour.toString().padStart(2, "0");
  const minute = date.getMinutes();
  var min = minute.toString();
  if (minute < 10) min = minute.toString().padStart(2, "0");
  const sec = date.getSeconds();
  const dateStr = `${day}/${month}/${year}`;
  const timeStr = `${hr}:${min}`;
  var availability = false;
  function isAvailable() {
    if (props.doctor.date < new Date()) availability = true;
    else availability = false;
    return availability;
  }
  const [modalOpen, setModalOpen] = useState(false);

  function DialogDemo() {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value="Pedro Duarte" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" value="@peduarte" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div>
      <Card className="flex flex-col drop-shadow-lg overflow-hidden">
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div className="flex mt-3 text-xl">{props.doctor.appID}</div>
            <div className="flex mt-3 text-c1 text-xl font-bold">
              {props.doctor.name}
            </div>
            <div className="flex mt-3 text-xl">{dateStr}</div>
            <div className="flex mt-3 text-xl">{timeStr}</div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  disabled={!isAvailable()}
                  className="bg-c2 w-42 text-white rounded-lg hover:bg-c1 mt-5"
                  onClick={() => {
                    navigator.clipboard.writeText(props.doctor.meetLink);
                    console.log("Link Copied");
                    setModalOpen(true);
                  }}
                >
                  Get Link
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-c4">
                <DialogHeader>
                    <DialogTitle>Link Copied to Clipboard</DialogTitle>
                    <DialogDescription>
                        Your Link is : <b className="text-c1">{props.doctor.meetLink}</b>
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild>
                  <Button className="bg-c2 hover:bg-c1">Ok</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* <Button
              disabled={!isAvailable()}
              className="bg-c2 w-42 text-white rounded-lg hover:bg-c1 mt-5"
              onClick={() => {
                navigator.clipboard.writeText(props.doctor.meetLink);
                console.log("Link Copied");
                setModalOpen(true);
              }}
            >
              Get Link
            </Button> */}
          </div>
        </CardContent>
      </Card>
      {/* {
        modalOpen && (
        DialogDemo())
      } */}
    </div>
  );
};
export default DoctorPendingCard;
