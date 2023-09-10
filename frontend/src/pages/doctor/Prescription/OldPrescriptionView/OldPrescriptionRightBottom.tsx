import useOldPrescriptionStore from "@/hooks/useOldPrescriptionStore";
import { FC } from "react";

const OldPrescriptionRightBottom : FC = () => {
    const advices = useOldPrescriptionStore(state => state.advices);
    const tests = useOldPrescriptionStore(state => state.tests);
    const meetAfter = useOldPrescriptionStore(state => state.meetAfter);

    return <div className="flex flex-col w-full">
    <div className="grid grid-cols-2">
    <div className="flex-grow">
      <p className="text-xl text-c1 font-semibold">Advices</p>
      <ul className="ml-2">
        {advices.map((item, index) => (
          <div className="flex items-center" key={index}>
            <p className="">{item}</p>
          </div>
        ))}
      </ul>
    </div>
    <div className="flex-grow">
        <p className="text-xl text-c1 font-semibold">Tests</p>
        <ul className="ml-2">
          {tests.map((item, index) => (
            <div className="flex items-center" key={index}>
              <p className="">{item}</p>
            </div>
          ))}
        </ul>
      </div>
    </div>
    <div><div className="text-c1 flex mt-8 items-center gap-2">
      <p>Meet After {meetAfter} days</p>
    </div></div>
    </div>
};

export default OldPrescriptionRightBottom;