import { Button } from "@/components/ui/button";
import usePrescribeBottomStore from "@/hooks/usePrescribedBottomStore";
import usePrescribedLeftStore from "@/hooks/usePrescribedLeftStore";
import usePrescribedStore from "@/hooks/usePrescribedStore";
import { APICreatePrescriptionSchema } from "@/models/Prescriptions";
import { FC } from "react";

const PrescriptionButtons: FC = () => {
  const leftStore = usePrescribedLeftStore();
  const medStore = usePrescribedStore();
  const bottomStore = usePrescribeBottomStore();

  const onSavePrescription = () => {
    const data: APICreatePrescriptionSchema = {
      medicines: medStore.medList.map((item) => {
        if(item.brandInfo){
            return {
                medicineID: item.brandInfo?.Brand.id,
                dosage: item.when,
                duration: item.duration,
                when:
                  +item.dosage.morning +
                  "+" +
                  +item.dosage.day +
                  "+" +
                  +item.dosage.night,
              };
        }
      }),
      symptoms: leftStore.symptoms,
      diagnosis: leftStore.diagnosis,
      advices: bottomStore.advices,
      //! followUpDate and PastHistory add later
    };
    console.log(data);
  };
  const onDiscardPrescription = () => {
    leftStore.reset();
    medStore.reset();
    bottomStore.reset();
    //? navigate back
  };
  return (
    <div className="flex w-full mt-4 justify-around">
      <Button className="bg-c1 h-12 w-28" onClick={onSavePrescription}>
        Save
      </Button>
      <Button
        className="bg-[#9B9289] h-12 w-28"
        onClick={onDiscardPrescription}
      >
        Discard
      </Button>
    </div>
  );
};

export default PrescriptionButtons;
