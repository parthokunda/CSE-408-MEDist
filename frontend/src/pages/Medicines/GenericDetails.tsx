import { BrandDescription } from "@/models/Brand";
import { Generic } from "@/models/generic";
import { FC } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

//TODO: available brands er list
const MedCard: FC<{ medicine: BrandDescription }> = (props) => {
    return (
      <Card className="flex flex-col w-fit drop-shadow m-4">
        <CardHeader className="text-c1">
          <CardTitle className="flex flex-row items-center">
            {props.medicine.Brand.name}
            <img src={props.medicine.DosageForm.img_url} className="ml-3 h-6 w-6"/>
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

//show details of a generic
const GenericSingleBox: FC<{ boxHeader: string; boxText: string }> = (
  props
) => {
  return (
    <div className="my-2">
      <div className="bg-c3 text-xl text-c1 py-1 mx rounded-md">
        <b className="ml-3">{props.boxHeader}</b>
      </div>
      <p className="ml-3 mt-1 break-normal whitespace-pre-wrap">
        {props.boxText}
      </p>
    </div>
  );
};

const GenericDetails: FC<{ generic: Generic }> = (props) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col padding-10px my-3 ml-3">
        <div className="flex items-center font-bold text-2xl text-c1">
          {props.generic.name}
        </div>
        <GenericSingleBox
          boxHeader="Indications"
          boxText={props.generic.indications}
        />
        <GenericSingleBox
          boxHeader="Pharmacology"
          boxText={props.generic.pharmacology}
        />
        <GenericSingleBox
          boxHeader="Dosage and Administration"
          boxText={props.generic.dosageAdministration}
        />
        <GenericSingleBox
          boxHeader="Interaction"
          boxText={props.generic.interaction}
        />
        <GenericSingleBox
          boxHeader="Contraindiction"
          boxText={props.generic.contraindiction}
        />
        <GenericSingleBox
          boxHeader="Side Effects"
          boxText={props.generic.sideEffects}
        />
        <GenericSingleBox
          boxHeader="Overdose Effects"
          boxText={props.generic.overDoseEffect}
        />
        <GenericSingleBox
          boxHeader="Storage Condition"
          boxText={props.generic.storageCondition}
        />
      </div>
      <div>
        <h1>Available Brands</h1>
        <div className="flex flex-wrap">

            /
            {props.generic.availableBrands.map((brand) => (
                <MedCard medicine={brand} />
                    
            })}
      </div>
    </div>
  );
};

export default GenericDetails;
