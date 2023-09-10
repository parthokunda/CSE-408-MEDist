import { FC } from "react";
// import SearchDoctor from "./SearchDoctor";
// import DoctorSearchCards from "./DoctorSearchCards";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import DoctorPendingAppList from "./DoctorPendingAppList";
import DoctorPreviousAppList from "./DoctorPreviousAppList";

const DoctorAppointments: FC = (props) => {
  return (
    <div className="flex items-center justify-center">
      <Tabs defaultValue="pending"  id="hi" className="flex flex-col items-center">
        <TabsList className="flex justify-center w-fit bg-white border-gray-200 gap-6 my-6">
          <TabsTrigger
            value="previous"
            className="inline-block p-4 border-b-2 border-transparent rounded-t-lg data-[state=active]:text-c1 data-[state=active]:text-c1 data-[state=active]:font-bold"
          >
            Previous Appointments
          </TabsTrigger>
          <TabsTrigger
            className="inline-block p-4 border-b-2 border-transparent rounded-t-lg data-[state=active]:text-c1 data-[state=active]:font-bold"
            value="pending"
          >
            Pending Appointments
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <DoctorPendingAppList />
        </TabsContent>
        <TabsContent value="previous">
          <DoctorPreviousAppList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorAppointments;
