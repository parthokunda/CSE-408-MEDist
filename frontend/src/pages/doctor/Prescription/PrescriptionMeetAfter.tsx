import { Input } from "@/components/ui/input";
import usePrescribeBottomStore from "@/hooks/usePrescribedBottomStore";
import { FC } from "react";

const PrescriptionMeetAfter: FC = () => {
  const meetAfter = usePrescribeBottomStore((state) => state.meetAfter);
  const setMeetAfter = usePrescribeBottomStore((state) => state.setMeetAfter);
  return (
    <div className="text-c1 flex mt-8 items-center gap-2">
      <p>Meet After</p>
      <Input
        type="number"
        className="h-8 w-16"
        onChange={(e) => setMeetAfter(+e.target.value)}
        value={meetAfter}
      />
      <p>days</p>
    </div>
  );
};

export default PrescriptionMeetAfter;
