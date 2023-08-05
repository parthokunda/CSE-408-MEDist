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
    <Card className="flex flex-col w-fit drop-shadow m-4">
      <CardHeader className="text-c1">
        <CardTitle className="flex flex-row items-center">
          {props.medicine.Brand.name}
          {/* <TbMedicineSyrup className="mx-3" /> */}
          <img src={props.medicine.DosageForm.img_url} className="mx-3 h-6 w-6"/>
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

export const MedCardLoading: FC = () => {
  return (
    <div
      className="inline-block my-10 h-12 w-12 animate-spin rounded-full border-4 border-solid border-c1 border-r-transparent align-[-0.125em] text-success motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    />
  );
};

export default MedCard;
