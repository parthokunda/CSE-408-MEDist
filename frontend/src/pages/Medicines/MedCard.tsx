import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TbMedicineSyrup } from "react-icons/tb";
import { BrandInfo } from "@/models/Brand";

const MedCard: FC<{ medicine: BrandInfo }> = (props) => {
  return (
    <Card className="flex flex-col w-fit drop-shadow">
      <CardHeader className="text-c1">
        <CardTitle className="flex flex-row items-center">
          {props.medicine.Brand.name}
          <img src={props.medicine.DosageForm.img_url} className="ml-3 h-6 w-6" placeholder="img_404"/>
          {/* <TbMedicineSyrup className="mx-3" /> */}
        </CardTitle>
        <CardDescription>{props.medicine.Brand.strength}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{props.medicine.Generic.name}</p>
        <p className="text-c1">{props.medicine.Manufacturer.name}</p>
      </CardContent>
    </Card>
  );
};

// TODO: FlexBox overflow hoile atkano



export default MedCard;
