import { Input } from "@/components/ui/input";
import { FC, useEffect, useState } from "react";

const PrescriptionPastHistory: FC = () => {
  const [pastHistory, setPastHistory] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
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
          <Input
            className="rounded-lg"
            onChange={handleChange}
            value={pastHistory} 
          />
        </div>
      </div>
    </>
  );
};

export default PrescriptionPastHistory;
