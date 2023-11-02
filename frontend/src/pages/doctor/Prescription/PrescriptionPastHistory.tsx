import { Textarea } from "@/components/ui/textarea";
import usePrescribedLeftStore from "@/hooks/usePrescribedLeftStore";
import { ChangeEvent, FC, useEffect } from "react";

const PrescriptionPastHistory: FC = () => {
  // const [pastHistory, setPastHistory] = useState<string>("");
  const pastHistory = usePrescribedLeftStore((state) => state.pastHistory);
  const setPastHistory = usePrescribedLeftStore((state) => state.changeHistory);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPastHistory(e.target.value);
  };

  // use this to pass all elements to the parent
  useEffect(() => {
    console.log(pastHistory);
  }, [pastHistory]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center pl-4 pt-2">
          <p className="text-c1 font-bold text-xl">Past History</p>
        </div>

        <div className="flex gap-2 mx-4 my-1 items-center">
          <Textarea
            className="rounded-lg h-36"
            onChange={handleChange}
            value={pastHistory}
          />
        </div>
      </div>
    </>
  );
};

export default PrescriptionPastHistory;
