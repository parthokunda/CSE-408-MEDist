import { PatientAdditionalInfoForm } from "@/models/FormSchema";
import { UpdatedPatientAttributes } from "@/models/UserInfo";
import axios from "axios";
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../../components/ui/input";
import { FIREBASE_CONFIG } from "@/lib/firebaseConfig";
import { useMutation } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import ImageComponent from "../../components/ImageComponent";

const bloodGroups = [
  { key: 1, value: "A+" },
  { key: 2, value: "A-" },
  { key: 3, value: "B+" },
  { key: 4, value: "B-" },
  { key: 5, value: "O+" },
  { key: 6, value: "O-" },
  { key: 7, value: "AB+" },
  { key: 8, value: "AB-" },
];

const uploadImage = async (selectedFile: File | null) => {
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
    const downloadURL = await getDownloadURL(uploadTask.ref);
    return downloadURL;
  }
};

const infoSubmitHandler = async (
  data: z.infer<typeof PatientAdditionalInfoForm>,
  userToken: string,
  imageFile: File | null
): Promise<string> => {
  data.image = (await uploadImage(imageFile)) as string;

  const patientData = {
    name: data.name,
    phone: data.mobileNumber,
    gendar: data.gender,
    dob: data.dateOfBirth,
    address: "BUET",
    bloodGroup: data.bloodGroup,
    height: {
      feet: data.height_feet,
      inches: data.height_inches,
    },
    weight: data.weight,
    image: data.image,
  };

  await axios.put(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/patient/additional-info`,
    patientData,
    {
      headers: {
        Authorization: `Bearer ${userToken}`, // Replace with your actual token
        "Content-Type": "application/json",
      },
    }
  );
  return data.image;
};

const PatientInfoForm: FC<{
  patientInfo: UpdatedPatientAttributes;
  userToken: string;
}> = (props) => {
  initializeApp(FIREBASE_CONFIG);

  const forms = useForm<z.infer<typeof PatientAdditionalInfoForm>>({
    defaultValues: {
      name: props.patientInfo.name ? props.patientInfo.name : "",
      gender: props.patientInfo.gendar ? props.patientInfo.gendar : "other",
      dateOfBirth: props.patientInfo.dob ? props.patientInfo.dob : "",
      mobileNumber: props.patientInfo.phone
        ? props.patientInfo.phone
        : "",
      height_feet: props.patientInfo.height.feet ? props.patientInfo.height.feet: undefined,
      height_inches: props.patientInfo.height.inches ?props.patientInfo.height.inches:undefined,
      weight: props.patientInfo.weight ? props.patientInfo.weight : undefined,
      bloodGroup: props.patientInfo.bloodGroup
        ? props.patientInfo.bloodGroup
        : undefined,
      image: props.patientInfo.image ? props.patientInfo.image : undefined,
    },
    // resolver: zodResolver(PatientAdditionalInfoForm),
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  const onSubmit = async (data: z.infer<typeof PatientAdditionalInfoForm>) => {
    mutateProfile(data);
  };

  const {mutate: mutateProfile, isLoading: isSubmittingProfile} = useMutation({
    mutationKey: ["submitProfileInfo"],
    mutationFn: (data: z.infer<typeof PatientAdditionalInfoForm>) => infoSubmitHandler(data, props.userToken, selectedFile),
  })

  if(isSubmittingProfile){
    return <div className="flex justify-center"><LoadingSpinner/></div>
  }

  return (
    <>
      <div className="text-black text-3xl text-large text-center font-bold my-5">
        Additional Info
      </div>
      <form
        onSubmit={forms.handleSubmit(onSubmit)}
        className="flex flex-col w-screen justify-start mx-5"
      >
        <div className="grid grid-cols-2">
          <div className="flex-[50%] flex flex-col gap-5">
            <div className="grid grid-cols-2 w-[50%]">
              Name:
              <Controller
                control={forms.control}
                name="name"
                render={({ field }) => (
                  <div>
                    <Input {...field} />
                  </div>
                )}
              />
            </div>
            <div className="grid grid-cols-2 w-[50%]">
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
            <div className="grid grid-cols-2 w-[50%]">
              Date of Birth:
              <Controller
                control={forms.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <div>
                    <Input
                      type="date"
                      {...field}
                      value={field.value.toString().substring(0, 10)}
                    />
                  </div>
                )}
              />
            </div>
            <div className="grid grid-cols-2 w-[50%]">
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
            <div className="grid grid-cols-3 w-[75%]">
              Height:
              <Controller
                name="height_feet"
                control={forms.control}
                render={({ field }) => (
                  <div className="flex items-center gap-3">
                    <Input {...field} placeholder="Height in feet" />
                    <p>Ft</p>
                    <p>{forms.formState.errors.height_feet?.message}</p>
                  </div>
                )}
              />
              <Controller
                name="height_inches"
                control={forms.control}
                render={({ field }) => (
                  <div className="flex items-center gap-3">
                    <Input {...field} placeholder="Height in inches" />
                    <p>Inches</p>
                    <p>{forms.formState.errors.height_inches?.message}</p>
                  </div>
                )}
              />
              {/* <div></div> */}
            </div>
            <div className="grid grid-cols-2 w-[50%]">
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
            <div className="grid grid-cols-2 w-[50%] ">
              Blood Group:
              <div className="bg-white">
                <Controller
                  name="bloodGroup"
                  control={forms.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
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
                  )}
                />
              </div>
            </div>
          </div>
          <ImageComponent selectedFile={selectedFile} imageURL={props.patientInfo.image} formControl={forms.control} handleFileInput={handleFileInput}/>
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

export default PatientInfoForm;
