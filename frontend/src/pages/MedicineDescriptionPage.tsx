import { FC } from "react";
import { Description } from "@/models/description";
import { TbMedicineSyrup } from "react-icons/tb";
import SearchMed from "./Medicines/SearchMed";
// import "./styles.css";

const MedCard: FC<{medicine:Description}> = (props) => {
    return (
        <div >
        <div className="flex flex-row items-center font-bold text-2xl text-c1 mx-6">
            <TbMedicineSyrup className="" /> 
            {props.medicine.name} 
        </div>
        <div className="mx-6 opacity-50">
            {props.medicine.dosage.type}
        </div>
        <div className="mx-6">
            {props.medicine.generic}
        </div>
        <div className="mx-6">
            {props.medicine.strength}
        </div>
        <div className="mx-6 opacity-50">
            {props.medicine.manufacturer}
        </div>
        <div className="mx-6">
            Unit price : {props.medicine.price}
        </div>
        <div className="bg-c3 text-xl text-c1 py-1 mx">
            <b className="mx-6">Indications</b>
            
        </div>
        <div className="mx-6">
            {props.medicine.indications}
        </div>
        <div className="bg-c3 text-xl text-c1 py-1">
            <b className="mx-6">Pharmacology</b>
        </div>
        <div className="mx-6">
            {props.medicine.pharmacology}
        </div>
        <div className="bg-c3 text-xl text-c1 py-1">
            <b className="mx-6">Dosage and Administration</b>
        </div>
        <div className="mx-6">
            {props.medicine.dosageAdministration}
        </div>
        <div className="bg-c3 text-xl text-c1 py-1">
            <b className="mx-6">Interaction</b>
        </div>
        <div className="mx-6">
            {props.medicine.interaction}
        </div>
        <div className="bg-c3 text-xl text-c1 py-1">
            <b className="mx-6">Contraindiction</b>
        </div>
        <div className="mx-6">
            {props.medicine.contraindiction}
        </div>
        <div className="bg-c3 text-xl text-c1 py-1">
            <b className="mx-6">Side Effects</b>
        </div>
        <div className="mx-6">
            {props.medicine.sideEffects}
        </div>
        <div className="bg-c3 text-xl text-c1 py-1">
            <b className="mx-6">Overdose Effects</b>
        </div>
        <div className="mx-6">
            {props.medicine.overDoseEffect}
        </div>
        <div className="bg-c3 text-xl text-c1 py-1">
            <b className="mx-6">Storage Condition</b>
        </div>
        <div className="mx-6">
            {props.medicine.storageCondition}
        </div>
        </div>
    );
}

const MedicineDescription : Description = {
    id: 1,
    name: "Napa",
    strength: "500mg",
    generic: "Paracetamol",
    manufacturer: "Beximco Pharama",
    dosage: {type: "Suppository", icon: "dummy"},
    price: "10 taka",
    indications: "hekkidasdasdasfjasjfnasfjnasfnkasnnasfknasjnfasnjnknfsanfksanfasfnasjf",
    pharmacology: "hekkidasdasdasfjasjfnasfjnasfnkasnnasfknasjnfasnjnknfsanfksanfasfnasjf\ndasdasfasdfasfasfa",
    dosageAdministration : "hfsdhffjkdsfjkejkfsfhsdfsjdfjlksdfklsdflksdjfklsdfksdfk",
    interaction : "hekkidasdasdasfjasjfnasfjnasfnkasnnasfknasjnfasnjnknfsanfksanfasfnasjf",
    contraindiction : "dsfdsfdshfsdfsdfjsdhfsdhfshdfdshjsfdfdsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssshfsdjfjsdfhhhfdjjjjjjjjjjjjjjjjjjjjjjj",
    sideEffects: "hekkidasdasdasfjasjfnasfjnasfnkasnnasfknasjnfasnjnknfsanfksanfasfnasjf",
    overDoseEffect : "dasdasfafafafafa",
    storageCondition : "keep in a safe and dry place \n always keep medicines out of reach of children",
}

const MedicineDescriptionPage: FC = () => {
    return <div className="py-3">
        <p className="flex justify-center font-bold text-2xl">Medicine info</p>
        <SearchMed/>
        <MedCard medicine={MedicineDescription}/>
    </div>;
}

export default MedicineDescriptionPage;