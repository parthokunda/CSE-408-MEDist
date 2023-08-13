import { FC } from "react";
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
import { Button } from "@/components/ui/button";
import { LoginCardForm, LoginCardFormType } from "@/models/FormSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const postLogin = async (data: LoginCardFormType): Promise<{token:string}> => {
  const response = await axios.post(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/auth/login`,
    data
  );
  return response.data;
};

const LoginCard: FC = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["user"]);

  const loginForms = useForm<LoginCardFormType>({
    defaultValues: {
      email: "",
      password: "",
      role: "patient",
    },
    resolver: zodResolver(LoginCardForm),
  });

  const onLoginSubmit = (formData: LoginCardFormType): void => {
    mutate(formData);
  };

  const { isLoading, mutate } = useMutation({
    mutationKey: ["postLogin"],
    mutationFn: postLogin,
    onSuccess: (data) => {
      setCookie("user", { token: data.token, role: 'patient' }, {maxAge: import.meta.env.COOKIE_TIMEOUT});
      console.log(cookies.user);
      navigate("patient/");
    },
    onError: () => {
      console.log("error detected");
      setTimeout(() => {
        navigate("/");
      }, 1500);
      return <p>Error Loading Page. Reloading...</p>;
    },
  });

  return (
    <>
      <Card>
        <CardContent className="space-y-2 mt-2">
          <form onSubmit={loginForms.handleSubmit(onLoginSubmit)}>
            <Controller
              name="email"
              control={loginForms.control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input {...field} placeholder="Email" />
                  <p>{loginForms.formState.errors.email?.message}</p>
                </div>
              )}
            />
            <Controller
              name="password"
              control={loginForms.control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    {...field}
                    placeholder="Password"
                    type="password"
                  ></Input>
                  <p>{loginForms.formState.errors.password?.message}</p>
                </div>
              )}
            />

            <div className="space-y-1">
              <Label htmlFor="loginAs">Login As</Label>
              <Controller
                name="role"
                control={loginForms.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="assistant">Assistant</SelectItem>
                    </SelectContent>
                    <p>{loginForms.formState.errors.role?.message}</p>
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
                  disabled={!loginForms.formState.isValid}
                >
                  Submit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default LoginCard;
