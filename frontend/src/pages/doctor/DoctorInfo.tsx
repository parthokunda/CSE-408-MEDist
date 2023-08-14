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

import { DoctorAdditionalInfoForm } from "@/models/FormSchema";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// import { initializeApp } from "firebase/app";
// import {
//   getStorage,
//   ref,
//   getDownloadURL,
//   uploadBytesResumable,
// } from "firebase/storage";

export const DoctorInfo: FC = () => {
  const forms = useForm<z.infer<typeof DoctorAdditionalInfoForm>>({
    defaultValues: {
      gender: "male",
      // dateOfBirth: "",
      // bmdcNumber: "",
      // issueDate: "",
      department: "",
    },
    resolver: zodResolver(DoctorAdditionalInfoForm),
  });
  const onSubmit: SubmitHandler<z.infer<typeof DoctorAdditionalInfoForm>> = (
    data
  ) => {
    console.log(data);
  };
  // const { register,handleSubmit,reset, control} = forms;
  // const [show, setShow] = useState(false);
  // const { fields, append, remove } = useFieldArray({
  //   name: 'degrees',
  //   control
  // });
  const departments = [
    { key: 1, value: "Medicine" },
    { key: 2, value: "Surgery" },
    { key: 3, value: "Gynae" },
    { key: 4, value: "Orthopedic" },
    { key: 5, value: "Cardiology" },
    { key: 6, value: "Neurology" },
    { key: 7, value: "ENT" },
    { key: 8, value: "Eye" },
    { key: 9, value: "Child" },
    { key: 10, value: "Skin" },
    { key: 11, value: "Psychiatry" },
    { key: 12, value: "Physical Medicine" },
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
  // const app = initializeApp(FIREBASE_CONFIG);
  // const file = req.file;
  // const userID = req.user_identity.id;

  //     const dateTime = new Date();

  //     // create a reference to the storage bucket location
  //     const storageRef = ref(
  //       storage,
  //       `profile_pictures/${userID}${file.originalname}`
  //     );

  //     // define metadata
  //     const metadata = {
  //       contentType: file.mimetype,
  //     };

  //     // upload the file
  //     const uploadTask = await uploadBytesResumable(
  //       storageRef,
  //       file.buffer,
  //       metadata
  //     );

  //     // get the download url
  //     const downloadURL = await getDownloadURL(uploadTask.ref);

  //     req.body.image = downloadURL;
  //     next();

  //! another test
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  const handleImage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(selectedFile);
  };
  // if(selectedFile){
  //   console.log((selectedFile))
  // };
  // console.log(forms.getValues("image"));
  return (
    <>
      <div className="text-black text-large justify-center text-large mt-5 font-bold gap-5 ml-6">
        Additional Info
      </div>
      <form
        onSubmit={forms.handleSubmit(onSubmit)}
        className="flex flex-col w-screen justify-start gap-5 ml-6"
      >
        {" "}
        <div className="flex">
          <div className="flex-[50%] flex flex-col gap-5">
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
              BMDC Number :
              <Controller
                name="bmdcNumber"
                control={forms.control}
                render={({ field }) => (
                  <div>
                    <Input {...field} placeholder="BMDC Number" />
                    <p>{forms.formState.errors.bmdcNumber?.message}</p>
                  </div>
                )}
              />
            </div>
            <div className="flex gap-3">
              Issue Date :
              <Controller
                control={forms.control}
                name="issueDate"
                render={({ field }) => (
                  <div>
                    <Input type="date" {...field} />
                  </div>
                )}
              />
            </div>
            <div className="flex-[50%] width-10 gap-3">
              Department:
              <Controller
                name="department"
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
                        {departments.map((department) => (
                          <SelectItem
                            key={department.key}
                            value={department.value}
                          >
                            {department.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                      <p>{forms.formState.errors.department?.message}</p>
                    </Select>
                  </div>
                )}
              />
            </div>

            <div className="flex gap-3">
              {/* add degrees */}
              Degrees:
              <Controller
                name="degrees"
                control={forms.control}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      placeholder="Please enter all your degrees"
                    />
                    <p>{forms.formState.errors.degrees?.message}</p>
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
                      onChange(e.target.files?.[0]);
                      handleFileInput(e);
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

export default DoctorInfo;
