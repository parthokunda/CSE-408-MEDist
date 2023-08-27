import { Card, CardContent } from "@/components/ui/card";
import { FC } from "react";
// import {FontAwesomeIcon} from "react-icons/fa"

import { DoctorProfileInfo } from "@/models/DoctorSchema";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import avatar from "@/assets/img_avatar.png";

const DoctorDetailsCard: FC<{ doctor: DoctorProfileInfo }> = (props) => {
  return (
    <Card className="flex flex-col drop-shadow-lg overflow-hidden justify-center items-center pt-6">
      <CardContent className="flex flex-col items-center">
        <div className="flex flex-col m-3 items-center">
          <Avatar className="h-24 w-24 mb-3">
            <AvatarImage
              src={props.doctor.DoctorInfo.image || avatar}
              alt="avatarImage"
            />
          </Avatar>
          <div className="text-c1 text-2xl flex justify-start font-bold gap-2">
            {props.doctor.DoctorInfo.name}
          </div>
          <div className="text-c2 text-xl flex justify-start">
            {props.doctor.DoctorInfo.degrees.join(", ")}
          </div>
          <div className="text-c2 text-xl flex justify-start">
            {props.doctor.Specialization.name}
          </div>
          <div className="text-c2 text-xl flex justify-start">
            BMDC : {props.doctor.DoctorInfo.bmdc}
          </div>
        </div>
        <div className="text-c1 text-xl font-bold mt-6">
          Cost : {props.doctor.OnlineSchedule.visitFee} Taka
        </div>
        <div className="text-c1 text-xl font-bold">Contact : 01759881197</div>
      </CardContent>
    </Card>
  );
};
export default DoctorDetailsCard;
