import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { BrandInfo } from "@/models/Brand";
import { Link } from "react-router-dom";

const MedCard: FC<{ medicine: BrandInfo }> = (props) => {
  // const navigate = useNavigate();
  return (
    <Card className="flex flex-col w-fit drop-shadow overflow-hidden">
      <CardHeader className="text-c1">
        <CardTitle className="flex flex-row items-center">
          <Link to={`/medicine/${props.medicine.Brand.id}`}>{props.medicine.Brand.name}</Link>
          <img
            src={props.medicine.DosageForm.img_url}
            className="ml-3 h-6 w-6"
            placeholder="img_404"
          />
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
