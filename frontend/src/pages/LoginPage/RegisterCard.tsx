import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FC } from "react";

const RegisterCard: FC = () => {
  return (
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
          <Button className="bg-c1 text-white hover:bg-c2 mt-4">Submit</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterCard;
