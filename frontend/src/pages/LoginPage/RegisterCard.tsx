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
import { RegisterCardForm, RegisterCardFormType } from "@/models/FormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import { LoginSignupToken } from "@/models/LoginSignUpSchema";

const postRegister = async (
  data: RegisterCardFormType
): Promise<LoginSignupToken> => {
  const response = await axios.post(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/auth/signup`,
    data
  );
  console.log(response.data);
  return response.data;
};

const RegisterCard: FC = () => {
  const [cookies, setCookie] = useCookies(["user"]);
  const navigate = useNavigate();
  const registerForms = useForm<RegisterCardFormType>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "patient",
    },
    resolver: zodResolver(RegisterCardForm),
  });

  const onRegisterSubmit = (formData: RegisterCardFormType) => {
    console.log(formData);
    mutate(formData);
  };

  const { isLoading, mutate } = useMutation({
    mutationKey: ["postRegister"],
    mutationFn: postRegister,
    onSuccess: (data) => {
      setCookie(
        "user",
        { token: data.token, role: data.role, profile_status: data.profile_status },
        {path: "/"}
      );
      console.log(cookies.user);
      navigate("/patient/");
    },
    onError: () => {
      console.log("error detected");
      setTimeout(() => {
        navigate("/");
      }, 15000);
      return <p>Error Loading Page. Reloading...</p>;
    },
  });

  return (
    <Card>
      <CardContent className="space-y-1 mt-2">
        <form onSubmit={registerForms.handleSubmit(onRegisterSubmit)} className="space-y-1">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Controller
              control={registerForms.control}
              name="email"
              render={({ field }) => <Input placeholder="Email" {...field} />}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Controller
              control={registerForms.control}
              name="password"
              render={({ field }) => (
                <Input placeholder="Password" type="password" {...field} />
              )}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Controller
              control={registerForms.control}
              name="confirmPassword"
              render={({ field }) => (
                <Input placeholder="Confirm Password" type="password" {...field} />
              )}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="SignupAs">Sign Up As</Label>
            <Controller
              control={registerForms.control}
              name="role"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="assistant">Assitant</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex justify-center">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <Button
                className="bg-c1 text-white hover:bg-c2 mt-4"
                type="submit"
                disabled={!registerForms.formState.isValid}
              >
                Submit
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterCard;
