import { FC } from "react";

const PrescriptionPatientInfo: FC = () => {
  return (
    <div className="flex w-full h-full items-center font-bold text-c1 text-xl">
      <p className="flex-grow pl-4">Name: Partho Kunda</p>
      <p className="flex-grow text-center">Blood: O+</p>
      <p className="flex-grow text-center">Age: 24</p>
      <p className="flex-grow text-center">Height: 5'5"</p>
      <p className="flex-grow text-center">Weight: 70kg</p>
    </div>
  );
};

export default PrescriptionPatientInfo;
