import { BrandInfo } from "@/models/Brand";
import { FC } from "react";

const PrescribedMedInfo : FC<{med: BrandInfo}> = (props) => {
  return <p className="col-span-5 px-2 pl-1 flex text-c1 font-bold">
  <img
    src={props.med.DosageForm.img_url}
    className="ml-1 h-4 w-4 mt-1"
    placeholder="img_404"
  />
  <p className="pl-3">
    {props.med.Brand.name}
  </p>
  <p className="pl-6">
    {props.med.Brand.strength}
  </p>
</p>
};

export default PrescribedMedInfo;