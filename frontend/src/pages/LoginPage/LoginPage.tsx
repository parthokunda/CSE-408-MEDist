import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const LoginPage: FC = () => {
  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="flex flex-col items-center justify-center">
        <p className=" text-8xl font-bold text-c1 drop-shadow-xl py-2">MEDist</p>
        <p className="text-c1 text-2xl">Connecting Doctors and Patients</p>
        <p className="text-c1 text-2xl">Streamlining the whole process</p>
      </div>
      <div className=" flex items-center justify-center">
        <Tabs defaultValue="register" className="w-[400px]">
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
            <Card>
              <CardContent className="space-y-2 mt-2">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Email" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input type="password" placeholder="Password"></Input>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="loginAs">Login As</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="assistant">Assitant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-center">
                  <Button className="bg-c1 text-white hover:bg-c2 mt-4">
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card>
              <CardContent className="space-y-1 mt-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Name" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Email" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" placeholder="Password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <Input id="confirm_password" placeholder="Confirm Password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="SignupAs">Sign Up As</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="assistant">Assitant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-center">
                  <Button className="bg-c1 text-white hover:bg-c2 mt-4">
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
