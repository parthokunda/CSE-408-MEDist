import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import usePrescriptionFetchedInfoStore from "@/hooks/usePrescriptionFetchedInfoStore";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const PreviousPrescriptions: FC = () => {
  const navigate = useNavigate();

  const oldAppointments = usePrescriptionFetchedInfoStore(
    (state) => state.oldAppointments
  );

  return (
    <>
      {oldAppointments && oldAppointments.length <= 0 && (
        <div className="flex justify-center mt-6">
          <p className="font-bold text-c1">No Previous Appointments</p>
        </div>
      )}
      <div className="flex flex-grow flex-col mt-6 mx-2">
        {oldAppointments.map((item) => (
          <Card className="flex flex-grow mx-0" key={item.id}>
            <CardContent className="flex pt-6 flex-grow">
              <div className="flex items-center flex-grow justify-center gap-4">
                <p className="text-c1 font-bold">{item.id}</p>
                <p>{new Date(item.startTime).toLocaleDateString()}</p>
                <Button
                  onClick={() => navigate(`/doctor/prescription/${item.id}`)}
                  className="bg-c1"
                >
                  View
                </Button>
                <Button
                  className="bg-c1"
                  // onClick={() =>
                  //   navigate(`/doctor/prescription/${item.id}/download`)
                  // }
                >
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default PreviousPrescriptions;
