import usePrescribedStore from "@/hooks/usePrescribedStore";
import { FC } from "react";
import { MdCancel } from "react-icons/md";

const PrescribedMeds: FC = () => {
  const medList = usePrescribedStore((state) => state.medList);
  const removeMed = usePrescribedStore((state) => state.removeMed);
  return (
    <>
      {medList.map((med, index) => (
        <div className="grid grid-cols-12 mt-2" key={index}>
          <p className="col-span-5 px-2 pl-1">{med.name}</p>
          <p className="col-span-3 pl-1">{`${+med.dosage.morning}+${+med.dosage.day}+${+med.dosage.night}`}</p>
          <p className="col-span-2 pl-1">
            {med.when === "after" ? "After" : "Before"}
          </p>
          <p className="col-span-1 pl-1">{+med.duration}</p>
          <p className="col-span-1 flex items-center justify-center">
            <MdCancel
              onClick={() => {
                removeMed(med);
              }}
            />
          </p>
        </div>
      ))}
    </>
  );
};

export default PrescribedMeds;
