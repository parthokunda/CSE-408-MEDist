import { BrandInfo } from "@/models/Brand";
import { FC } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useNavigate } from "react-router-dom";

const PrescribedMedInfo: FC<{ med: BrandInfo }> = (props) => {
  const navigate = useNavigate();
  return (
    <HoverCard>
      <HoverCardTrigger className="col-span-5 px-2 pl-1">
        <div className="flex text-c1 font-bold" onClick={() => navigate(`/medicine/${props.med.Brand.id}`)}>
          <img
            src={props.med.DosageForm.img_url}
            className="ml-1 h-4 w-4 mt-1"
            placeholder="img_404"
          />
          <p className="pl-3">{props.med.Brand.name}</p>
          <p className="pl-6">{props.med.Brand.strength}</p>
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex flex-col">
          <div onClick={() => navigate(`/generic/${props.med.Generic.id}`)}><p className="text-c1 font-bold">Generics:</p> {props.med.Generic.name}</div>
          <div onClick={() => navigate(`/manufacturer/${props.med.Manufacturer.id}`)}><p className="text-c1 font-bold">Manufacturer: </p> {props.med.Manufacturer.name}</div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default PrescribedMedInfo;
