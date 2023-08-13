import { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginCard from "./LoginCard";
import RegisterCard from "./RegisterCard";

export const LoginPage: FC = () => {
  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="flex flex-col items-center justify-center">
        <p className=" text-8xl font-bold text-c1 drop-shadow-xl py-2">MEDist</p>
        <p className="text-c1 text-2xl">Connecting Doctors and Patients</p>
        <p className="text-c1 text-2xl">Streamlining the whole process</p>
      </div>
      <div className=" flex items-center justify-center">
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger
              value="login"
              className="text-c1 text-lg data-[state=active]:text-c1 data-[state=inactive]:text-[#B6C698]"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="text-c1 text-lg data-[state=active]:text-c1 data-[state=inactive]:text-[#B6C698]"
            >
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginCard />
          </TabsContent>
          <TabsContent value="register">
            <RegisterCard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
