import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import usePrescribeBottomStore from "@/hooks/usePrescribedBottomStore";
import usePrescribedLeftStore from "@/hooks/usePrescribedLeftStore";
import usePrescribedStore from "@/hooks/usePrescribedStore";
import { POSTCreatePrescriptionBody } from "@/models/Prescriptions";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FC } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams, } from "react-router-dom";

const PrescriptionButtons: FC = () => {
  const { prescriptionId } = useParams();
  const [cookies] = useCookies(["user"]);
  const leftStore = usePrescribedLeftStore();
  const medStore = usePrescribedStore();
  const bottomStore = usePrescribeBottomStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  

  const postCreatePrescription = async (input: {
    data: POSTCreatePrescriptionBody;
    authToken: string;
    appID: number;
  }): Promise<boolean> => {
    console.log("saving prescripiton", input.data);
    const res=await axios.post(
      `${import.meta.env.VITE_DB_URL}:${
        import.meta.env.VITE_DB_PORT
      }/api/appointment/prescription/create-prescription/${input.appID}`,
      input.data,
      {
        headers: {
          Authorization: `Bearer ${input.authToken}`, // Replace with your actual token
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res.data);
    toast({
      title: "Submitted",
      description: "Prescription Submitted",
      action: (
        <ToastAction altText="abcd" onClick={() => navigate(0)}>OK</ToastAction>
      ),
    })
    return true;
  };

  const { mutate } = useMutation({
    mutationKey: ["createPrescription"],
    mutationFn: postCreatePrescription,
  });

  if (!prescriptionId) return <>Invalid Prescription ID</>;

  const onSavePrescription = () => {
    const medicineDataForPost = medStore.medList
      .map((item) => {
        if (item.brandInfo)
          return {
            medicineID: item.brandInfo.Brand.id,
            dosage: (+item.dosage.morning +
              "+" +
              +item.dosage.day +
              "+" +
              +item.dosage.night) as string,
            duration: item.duration as number,
            when: item.when as string,
          };
      })
      .filter((item) => item !== undefined);

    const data = {
      medicines: medicineDataForPost,
      symptoms: leftStore.symptoms,
      diagnosis: leftStore.diagnosis,
      advices: bottomStore.advices,
      past_history: [leftStore.pastHistory],
      meetAfter: bottomStore.meetAfter,
      test: bottomStore.tests,
    };
    console.log(data);
    mutate({
      data: data,
      authToken: cookies.user.token,
      appID: +prescriptionId,
    });
  };

  const onDiscardPrescription = () => {
    leftStore.reset();
    medStore.reset();
    bottomStore.reset();
    navigate(-1);
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
      <Toaster/>
    </div>
  );
};

export default PrescriptionButtons;
