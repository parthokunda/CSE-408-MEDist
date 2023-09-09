import { Input } from "@/components/ui/input";
import usePrescribeBottomStore from "@/hooks/usePrescribedBottomStore";
import { FC, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { MdCancel } from "react-icons/md";

const PrescriptionAdvices: FC = () => {
  const advices = usePrescribeBottomStore((state) => state.advices);
  const addAdvice = usePrescribeBottomStore(state => state.addAdvice);
  const removeAdvice = usePrescribeBottomStore((state) => state.removeAdvice);
  const [inputString, setInputString] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInputString(e.target.value);
  };

  const addString = () => {
    if (inputString.length > 0) addAdvice(inputString);
    setInputString("");
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputString.length > 0) {
      addAdvice(inputString);
      setInputString("");
    }
  };

  return (
    <div className="flex-grow">
      <p className="text-xl text-c1 font-semibold">Advices</p>
      <ul className="ml-2">
        {advices.map((item, index) => (
          <div className="flex items-center" key={index}>
            <p className="">{item}</p>
            <MdCancel onClick={() => removeAdvice(item)} />
          </div>
        ))}
      </ul>
      {advices.length < 5 && (
        <div className="flex gap-2 my-2 items-center mr-6">
          <Input
            className="rounded-lg h-8"
            onChange={handleChange}
            value={inputString}
            onKeyDown={handleEnter}
          />
          <AiOutlinePlus onClick={addString} />
        </div>
      )}
    </div>
  );
};

export default PrescriptionAdvices;
