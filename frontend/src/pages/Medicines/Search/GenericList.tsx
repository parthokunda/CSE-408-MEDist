import { AllGenericInfo } from "@/models/Brand";
import { Generic } from "@/models/generic";
import { FC } from "react";

//render list of generics


const GenericList: FC<{ genericList: AllGenericInfo[] }> = (props) => {
  return (
    <div >
      {props.genericList.map((generic) => (
        <div >
          <div className="m-2 p-2 border border-c2 rounded-md whitespace-nowrap overflow-hidden">
            <div className="font-bold text-c1">{generic.Generic.name}</div>
            <div className="opacity-50">PlaceHolder Description</div>
          </div>
        </div>
      ))}
    </div>
  );
};


// list of generics


export default GenericList;
