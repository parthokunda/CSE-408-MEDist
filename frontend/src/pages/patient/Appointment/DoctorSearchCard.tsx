import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { FC } from "react";

import { Button } from "@/components/ui/button";
import { DoctorOverviewInfo } from "@/models/Brand";

import avatar from '@/assets/img_avatar.png';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const DoctorSearchCard: FC<{ doctor: DoctorOverviewInfo }> = (props) => {
  return (
    <Card className="flex flex-col drop-shadow-lg overflow-hidden mx-3">
      <CardContent className="flex items-center justify-center py-3">
          <div className="flex w-3/4 items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={props.doctor.DoctorInfo.image || avatar} alt="avatarImage"/>
              </Avatar>
              <div className="flex flex-col ml-6">
                <div className="text-c1  text-2xl flex justify-start font-bold gap-2">
                  {props.doctor.DoctorInfo.name}
                </div>
                <div className="text-c2 text-md flex justify-start">
                  {props.doctor.DoctorInfo.degrees.join(", ")}
                </div>
                <div className="text-c2 text-md flex justify-start">
                  {props.doctor.Specialization.name}
                </div>
                <div className="text-c2 text-md flex justify-start">
                  BMDC : {props.doctor.DoctorInfo.bmdc}
                </div>
              </div>
          </div>
          <div className="flex flex-col flex-[20%] items-center">
              <Button className="bg-c2 text-white rounded-lg hover:bg-c1">
                <Link to={`/patient/bookAppointment/${props.doctor.DoctorInfo.id}`}>
                  Book An Appointment
                </Link>
              </Button>
          </div>
      </CardContent>
    </Card>
  );
};

export default DoctorSearchCard;
