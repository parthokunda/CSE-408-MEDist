import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import {FontAwesomeIcon} from "react-icons/fa"

import { DoctorProfileInfo } from "@/models/Brand";
import { Button } from "@/components/ui/button";

import { Link } from "react-router-dom";

const DoctorDetailsCard: FC<{ doctor: DoctorProfileInfo }> = (props) => {
  return (
    <Card className="flex flex-col drop-shadow-lg overflow-hidden">
      <CardContent>
        <div className="flex">
          <div className="flex flex-col">
            <div className="flex">
              <div className="flex flex-col ml-6 ">
                <img
                  src={props.doctor.DoctorInfo.image||"https://www.w3schools.com/howto/img_avatar.png"}
                  alt="https://www.w3schools.com/howto/img_avatar.png"
                  className="mt-2 h-24 w-24"
                  placeholder="img_404"
                />
                <div className="text-c1  text-2xl flex justify-start font-bold gap-2">
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
            </div>
            <div className="flex">
            <div className="flex flex-col ml-6">
              <div className="text-c1 text-xl font-bold">
                Cost : {props.doctor.OnlineSchedule.visitFee} Taka
              </div>
              <div className="text-c1 text-xl font-bold">
                Contact : 01759881197
              </div>
              
            </div>
          </div>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
};
export default DoctorDetailsCard;
