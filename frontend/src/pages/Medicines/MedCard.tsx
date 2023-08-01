import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TbMedicineSyrup } from "react-icons/tb";
import { Brand } from "@/models/Brand";

const MedCard: FC<{medicine:Brand}> = (props) => {
  return (
    <Card className="flex flex-col w-fit drop-shadow m-4">
      <CardHeader className="text-c1">
        <CardTitle className="flex flex-row items-center">
          {props.medicine.name}
          <TbMedicineSyrup className="mx-3" />
        </CardTitle>
        <CardDescription>{props.medicine.strength}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{props.medicine.generic}</p>
        <p className="text-c1">{props.medicine.manufacturer}</p>
      </CardContent>
    </Card>
  );
};

// TODO: FlexBox overflow hoile atkano

export default MedCard;
