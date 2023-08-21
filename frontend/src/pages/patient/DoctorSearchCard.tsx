import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import {FontAwesomeIcon} from "react-icons/fa"

import { DoctorOverviewInfo } from "@/models/Brand";
import { Button } from "@/components/ui/button";

import { Link } from "react-router-dom";

const DoctorSearchCard: FC<{ doctor: DoctorOverviewInfo }> = (props) => {
  return (
    <Card className="flex flex-col drop-shadow-lg overflow-hidden">
      <CardContent>
        <div className="flex">
          <div className="flex flex-[80%]">
            <div className="flex">
              <img
                src={props.doctor.DoctorInfo.image||"https://www.w3schools.com/howto/img_avatar.png"}
                alt="https://www.w3schools.com/howto/img_avatar.png"
                className="mt-2 h-24 w-24"
                placeholder="img_404"
              />
              <div className="flex flex-col ml-6 ">
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
          </div>
          <div className="flex flex-[20%]">
            <div className="flex flex-col">
              {/* <div className="text-c1 text-xl font-bold">
                Cost : {props.doctor.cost} Taka
              </div>
              <div className="text-c1 text-xl font-bold">
                Contact : {props.doctor.contact}
              </div> */}
              <Button className="bg-c2 w-42 text-white rounded-lg hover:bg-c1 mt-5">
                <Link to={`/patient/bookAppointment/${props.doctor.DoctorInfo.id}`}>
                  Book An Appointment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default DoctorSearchCard;
