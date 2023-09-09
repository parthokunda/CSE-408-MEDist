import { Input } from "@/components/ui/input";
import usePrescribedLeftStore from "@/hooks/usePrescribedLeftStore";
import { FC, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { MdCancel } from "react-icons/md";

const PrescriptionSymptoms: FC = () => {
  const symptomsList = usePrescribedLeftStore((state) => state.symptoms);
  const addSymptom = usePrescribedLeftStore((state) => state.addSymptom);
  const removeSymptom = usePrescribedLeftStore((state) => state.removeSymptom);

  const [inputString, setInputString] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInputString(e.target.value);
  };

  const addString = () => {
    if (inputString.length > 0) addSymptom(inputString);
    setInputString("");
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputString.length > 0) {
      addSymptom(inputString);
      setInputString("");
    }
  };

  const removeString = (str: string) => {
    removeSymptom(str);
  };

  // use this to pass all elements to the parent
  useEffect(() => {
    console.log(symptomsList);
  }, [symptomsList]);
  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center pl-4 pt-2">
          <p className="text-c1 font-bold text-xl">Symptoms</p>
          <p className="pl-2">(max 5)</p>
        </div>

        {symptomsList.map((item, index) => (
          <div className="flex items-center" key={index}>
            <p className="mx-4 text-lg">{item}</p>
            <MdCancel onClick={() => removeString(item)} />
          </div>
        ))}

        {symptomsList.length < 5 && (
          <div className="flex gap-2 mx-4 my-1 items-center">
            <Input
              className="rounded-lg"
              onChange={handleChange}
              value={inputString}
              onKeyDown={handleEnter}
            />
            <AiOutlinePlus onClick={addString} />
          </div>
        )}
      </div>
    </>
  );
};

export default PrescriptionSymptoms;
