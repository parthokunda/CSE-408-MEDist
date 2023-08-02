import { FC } from "react";
import { BrandDescription } from "@/models/BrandDescription";
import { TbMedicineSyrup } from "react-icons/tb";
import SearchMed from "./SearchMed";
// import "./styles.css";

const MedCardSingleBox: FC<{ boxHeader: string; boxText: string }> = (
  props
) => {
  return (
    <div className="my-2">
      <div className="bg-c3 text-xl text-c1 py-1 mx rounded-md">
        <b className="ml-3">{props.boxHeader}</b>
      </div>
      <p className="ml-3 mt-1">{props.boxText}</p>
    </div>
  );
};

const MedCard: FC<{ medicine: BrandDescription }> = (props) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col my-3 ml-3">
        <div className="flex items-center font-bold text-2xl text-c1">
          <TbMedicineSyrup />
          {props.medicine.name}
        </div>
        <p className="opacity-50">{props.medicine.dosage.type}</p>
        <p>{props.medicine.generic}</p>
        <p>{props.medicine.strength}</p>
        <p className=" opacity-50">{props.medicine.manufacturer}</p>
        <p>Unit price : {props.medicine.price}</p>
      </div>

      <MedCardSingleBox boxHeader="Indications" boxText={props.medicine.indications} />
      <MedCardSingleBox boxHeader="Pharmacology" boxText={props.medicine.pharmacology} />


      <div className="bg-c3 text-xl text-c1 py-1">
        <b className="ml-3">Pharmacology</b>
      </div>
      <div>{props.medicine.pharmacology}</div>
      <div className="bg-c3 text-xl text-c1 py-1">
        <b className="ml-3">Dosage and Administration</b>
      </div>
      <div>{props.medicine.dosageAdministration}</div>
      <div className="bg-c3 text-xl text-c1 py-1">
        <b>Interaction</b>
      </div>
      <div>{props.medicine.interaction}</div>
      <div className="bg-c3 text-xl text-c1 py-1">
        <b>Contraindiction</b>
      </div>
      <div>{props.medicine.contraindiction}</div>
      <div className="bg-c3 text-xl text-c1 py-1">
        <b>Side Effects</b>
      </div>
      <div>{props.medicine.sideEffects}</div>
      <div className="bg-c3 text-xl text-c1 py-1">
        <b>Overdose Effects</b>
      </div>
      <div>{props.medicine.overDoseEffect}</div>
      <div className="bg-c3 text-xl text-c1 py-1">
        <b>Storage Condition</b>
      </div>
      <div>{props.medicine.storageCondition}</div>
    </div>
  );
};

const MedicineDescription: BrandDescription = {
  id: 1,
  name: "Napa",
  strength: "500mg",
  generic: "Paracetamol",
  manufacturer: "Beximco Pharama",
  dosage: { type: "Suppository", icon: "dummy" },
  price: "10 taka",
  indications:
    "hekkidasdasdasfjasjfnasfjnasfnkasnnasfknasjnfasnjnknfsanfksanfasfnasjf",
  pharmacology:
    "hekkidasdasdasfjasjfnasfjnasfnkasnnasfknasjnfasnjnknfsanfksanfasfnasjf\ndasdasfasdfasfasfa",
  dosageAdministration:
    "hfsdhffjkdsfjkejkfsfhsdfsjdfjlksdfklsdflksdjfklsdfksdfk",
  interaction:
    "hekkidasdasdasfjasjfnasfjnasfnkasnnasfknasjnfasnjnknfsanfksanfasfnasjf",
  contraindiction:
    "dsfdsfdshfsdfsdfjsdhfsdhfshdfdshjsfdfdsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssshfsdjfjsdfhhhfdjjjjjjjjjjjjjjjjjjjjjjj",
  sideEffects:
    "hekkidasdasdasfjasjfnasfjnasfnkasnnasfknasjnfasnjnknfsanfksanfasfnasjf",
  overDoseEffect: "dasdasfafafafafa",
  storageCondition:
    "keep in a safe and dry place \n always keep medicines out of reach of children",
};

const MedicineDescriptionPage: FC = () => {
  return (
    <div className="py-3 mx-3">
      <p className="flex justify-center font-bold text-2xl">Medicine info</p>
      <SearchMed />
      <MedCard medicine={MedicineDescription} />
    </div>
  );
};

export default MedicineDescriptionPage;
