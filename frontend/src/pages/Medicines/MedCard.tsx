import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {TbMedicineSyrup} from 'react-icons/tb';

const MedCard: FC = () => {
  return <>
    <Card className="flex flex-col w-1/6">
        <CardHeader className="text-c1">
            <CardTitle className="flex flex-row items-center">
                MedA
                <TbMedicineSyrup className="mx-3"/>
            </CardTitle>
            <CardDescription>100mg</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Thiamine Hydrochloride</p>
            // TODO: FlexBox overflow hoile atkano
            <p className="text-c1">ACME Lab. Ltd.</p>
        </CardContent>
    </Card>
  </>;
};


export default MedCard;