import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "../../components/ui/input";
import { FC, useEffect } from "react";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PatientAdditionalInfoForm } from "@/models/FormSchema";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCookies } from "react-cookie";

import axios from "axios";

import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

export const PatientInfo: FC = () => {
  const [cookies] = useCookies(["user"]);
  const forms = useForm<z.infer<typeof PatientAdditionalInfoForm>>({
    defaultValues: {
      gender: "male",
      // dateOfBirth: "",
      // bmdcNumber: "",
      // issueDate: "",
      //   department: "",
    },
    resolver: zodResolver(PatientAdditionalInfoForm),
  });

  //   control
  // });
  const bloodGroups = [
    { key: 1, value: "A+" },
    { key: 2, value: "A-" },
    { key: 3, value: "B+" },
    { key: 4, value: "B-" },
    { key: 5, value: "O+" },
    { key: 6, value: "o-" },
    { key: 7, value: "AB+" },
    { key: 8, value: "AB-" },
  ];

  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCHZ4fFHB6mG2e1QfU8njqeZnbhmRnO9Go",
    authDomain: "medist-photos-8c6bf.firebaseapp.com",
    projectId: "medist-photos-8c6bf",
    storageBucket: "medist-photos-8c6bf.appspot.com",
    messagingSenderId: "488575338890",
    appId: "1:488575338890:web:af4e96b6e455fcf9296073",
    measurementId: "G-QB6RHMBMMK",
  };
  const app = initializeApp(FIREBASE_CONFIG);


  //! another test
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };
  var downloadURL = "";
  const uploadFile = async () => {
    if (selectedFile) {
      const storage = getStorage();
      const storageRef = ref(storage, "profile_pictures/" + selectedFile.name);
      const metadata = {
        contentType: selectedFile.type,
      };
      const uploadTask = await uploadBytesResumable(
        storageRef,
        selectedFile,
        metadata
      );
      downloadURL = await getDownloadURL(uploadTask.ref);
      console.log(downloadURL);
      return downloadURL;
    }
  };
  const handleImage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(selectedFile);
  };
  // force image upload before full submission
  const onSubmit: SubmitHandler<z.infer<typeof PatientAdditionalInfoForm>> = async (
    data
  ) => {
    uploadFile().then(async (url)=> {
      data.image = url as string;
      const patientData = {
        "name": data.name,
        "phone": data.mobileNumber,
        "gendar": data.gender,
        "dob": data.dateOfBirth,
        "address": "BUET",
        "bloodGroup": data.bloodGroup,
        "height": Number(data.height_feet+"."+data.height_inches),
        "weight": data.weight,
        "image": data.image,
      }
      const response =await axios.put(
        `${import.meta.env.VITE_DB_URL}:${
          import.meta.env.VITE_DB_PORT
        }/api/patient/additional-info`,patientData,
        {
          headers: {
            Authorization: `Bearer ${cookies.user.token}`, // Replace with your actual token
            'Content-Type': 'application/json'
          },
        }
      );
      // console.log(data);

    });

    console.log("here");

  };
  return (
    <>
      <div className="text-black text-large justify-center text-large mt-5 font-bold gap-5 ml-6">
        Additional Info
      </div>
      <form
        onSubmit={forms.handleSubmit(onSubmit)}
        className="flex flex-col w-screen justify-start gap-5 ml-6"
      >
        <div className="flex">
          <div className="flex-[50%] flex flex-col gap-5">
          <div className="flex gap-3">
              Name:
              <Controller
                control={forms.control}
                name="name"
                render={({ field }) => (
                  <div>
                    <Input {...field} placeholder="Name" />
                  </div>
                )}
              />
            </div>
            <div className="flex gap-3">
              Gender:
              <Controller
                name="gender"
                control={forms.control}
                render={({ field }) => (
                  <RadioGroup
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-2 items-center"
                  >
                    <div className="flex items-center space-x-2 bg-#FFFFFF">
                      <RadioGroupItem value="male" id="male" />
                      <label htmlFor="option-one">Male</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <label htmlFor="option-two">Female</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <label htmlFor="option-three">Other</label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
            <div className="flex gap-3">
              Date of Birth:
              <Controller
                control={forms.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <div>
                    <Input type="date" {...field} />
                  </div>
                )}
              />
            </div>
            <div className="flex gap-3">
              Mobile Number:
              <Controller
                control={forms.control}
                name="mobileNumber"
                render={({ field }) => (
                  <div>
                    <Input {...field} placeholder="Mobile Number" />
                  </div>
                )}
              />
            </div>
            <div className="flex gap-3">
              Height:
              <Controller
                name="height_feet"
                control={forms.control}
                render={({ field }) => (
                  <div>
                    <Input {...field} placeholder="Height in feet" />
                    Ft
                    <p>{forms.formState.errors.height_feet?.message}</p>
                  </div>
                )}
              />
              <Controller
                name="height_inches"
                control={forms.control}
                render={({ field }) => (
                  <div>
                    <Input {...field} placeholder="Height in inches" />
                    Inches
                    <p>{forms.formState.errors.height_inches?.message}</p>
                  </div>
                )}
              />
            </div>
            <div className="flex gap-3">
              Weight:
              <Controller
                control={forms.control}
                name="weight"
                render={({ field }) => (
                  <div>
                    <Input {...field} placeholder="Weight in Kg" />
                  </div>
                )}
              />
            </div>
            <div className="flex-[50%] width-10 gap-3">
              Blood Group:
              <Controller
                name="bloodGroup"
                control={forms.control}
                render={({ field }) => (
                  <div className="flex-[50%]  w-[200px] flex-col">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="flex width-2 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((department) => (
                          <SelectItem
                            key={department.key}
                            value={department.value}
                          >
                            {department.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                      <p>{forms.formState.errors.bloodGroup?.message}</p>
                    </Select>
                  </div>
                )}
              />
            </div>
          </div>
          <div className="flex-[30%] flex flex-col ml- gap-5">
            <Controller
              name="image"
              control={forms.control}
              render={({ field: { ref, name, onBlur, onChange } }) => (
                <div className="flex flex-col">
                  <Label htmlFor="profilePicture">Profile Picture</Label>
                  <Input
                    type="file"
                    ref={ref}
                    name={name}
                    onBlur={onBlur}
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      handleFileInput(e);
                      onChange(downloadURL);
                    }}
                  />
                  {selectedFile && (
                    // src={URL.createObjectURL(selectedFile)};
                    <img
                      className="w-[250px] h-[250px]"
                      src={URL.createObjectURL(selectedFile)}
                      alt="img"
                    />
                  )}
                </div>
              )}
            />
          </div>
        </div>
        <Button
          type="submit"
          className="bg-c1 w-36 mx-auto text-white hover:bg-c2 mt-4"
          disabled={!forms.formState.isValid}
        >
          Submit
        </Button>
      </form>
    </>
  );
};

export default PatientInfo;
