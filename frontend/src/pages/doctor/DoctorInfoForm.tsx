import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../../components/ui/input";

import { Button } from "@/components/ui/button";
import { DoctorAdditionalInfoForm } from "@/models/FormSchema";

import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DoctorAdditionalInfo,
  DoctorAttributes,
  SpecializationAttributes,
} from "@/models/DoctorSchema";
import { useCookies } from "react-cookie";
import { FIREBASE_CONFIG } from "@/lib/firebaseConfig";
import { useMutation } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/customUI/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import ImageComponent from "../../components/ImageComponent";

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

const submitProfileInfo = async (
  data: z.infer<typeof DoctorAdditionalInfoForm>,
  userToken: string,
  imageFile: File | null
): Promise<DoctorAdditionalInfo> => {
  data.image = (await uploadImage(imageFile)) as string;
  const profileData = {
    name: data.name,
    phone: data.mobileNumber,
    gendar: data.gender,
    dob: data.dateOfBirth,
    bmdc: data.bmdcNumber,
    issueDate: data.issueDate,
    degrees: data.degrees,
    specializationID: 2,
    image: data.image,
  };

  const respone = await axios.put(
    `${import.meta.env.VITE_DB_URL}:${
      import.meta.env.VITE_DB_PORT
    }/api/doctor/additional-info`,
    profileData,
    {
      headers: {
        Authorization: `Bearer ${userToken}`, // Replace with your actual token
        "Content-Type": "application/json",
      },
    }
  );
  console.log("🚀 ~ file: DoctorInfoForm.tsx:65 ~ respone:", respone.data);
  return respone.data;
};

export const DoctorInfoForm: FC<{
  doctorInfo: DoctorAttributes,
  specialization: SpecializationAttributes,
  userToken: string,
}> = (props) => {
  initializeApp(FIREBASE_CONFIG);
  const [cookies] = useCookies(["user"]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [specializations, setSpecializations] = useState<
    SpecializationAttributes[]
  >([]);
  const [fetchSpecializationsError, setFetchSpecializationError] = useState<boolean>(false);
  const navigate = useNavigate();

  const forms = useForm<z.infer<typeof DoctorAdditionalInfoForm>>({
    defaultValues: {
      name: props.doctorInfo.name,
      gender: props.doctorInfo.gendar,
      dateOfBirth: props.doctorInfo.dob,
      department: props.specialization.name,
      bmdcNumber: props.doctorInfo.bmdc,
      issueDate: props.doctorInfo.issueDate,
      mobileNumber: props.doctorInfo.phone,
      degrees: props.doctorInfo.degrees.join(", "),
      image: props.doctorInfo.image ? props.doctorInfo.image : undefined,
    },
    // resolver: zodResolver(DoctorAdditionalInfoForm),
  });

  useEffect(() => {
    async function fetchSpecializations() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_DB_URL}:${
            import.meta.env.VITE_DB_PORT
          }/api/doctor/specialization-list`,
          {
            headers: {
              Authorization: `Bearer ${cookies.user.token}`, // Replace with your actual token
            },
          }
        );
        setSpecializations(response.data);
        console.log(response.data);
      } catch (error) {
        setFetchSpecializationError(true);
      }
    }

    fetchSpecializations();
  }, []);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  const onSubmit: SubmitHandler<
    z.infer<typeof DoctorAdditionalInfoForm>
  > = async (data) => {
    mutateProfile(data);
  };

  const { mutate: mutateProfile, isLoading: isSubmittingProfile, isError: isSubmittingProfileError } = useMutation(
    {
      mutationKey: ["submitDoctorProfileInfo"],
      mutationFn: (data: z.infer<typeof DoctorAdditionalInfoForm>) =>
        submitProfileInfo(data, props.userToken, selectedFile),
    }
  );

  if(fetchSpecializationsError){
    setTimeout(() => {
        navigate("/");
    }, 1500)
    return <p className="flex justify-center text-3xl mt-12">Error Fetching Specializtion list. Reloading.</p>
  }

  if (isSubmittingProfile) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if(isSubmittingProfileError){
    setTimeout(() => {
        navigate("/");
    }, 1500)
    return <p className="flex justify-center text-3xl mt-12">Error Submitting Info. Logging Out.</p>
  }

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
        <div className="grid grid-cols-2">
          <div className="flex-[50%] flex flex-col gap-5">
            <div className="grid grid-cols-2 w-[50%]">
              Name :
              <Controller
                name="name"
                control={forms.control}
                render={({ field }) => (
                  <div>
                    <Input {...field} placeholder="name" />
                    <p>{forms.formState.errors.name?.message}</p>
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
              Department:
              <Controller
                name="department"
                control={forms.control}
                render={({ field }) => (
                  <div className="flex-[50%] flex-col">
                    <Select
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="flex width-2 bg-white">
                        <SelectValue placeholder={field.value}/>
                      </SelectTrigger>
                      <SelectContent>
                        {specializations.map(
                          (department: SpecializationAttributes) => (
                            <SelectItem
                              key={department.name}
                              value={department.id.toString()}
                            >
                              {department.name.toString()}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                      <p>{forms.formState.errors.department?.message}</p>
                    </Select>
                  </div>
                )}
              />
            </div>
            <div className="grid grid-cols-2 w-[50%]">
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
            <div className="grid grid-cols-2 w-[50%]">
              Issue Date :
              <Controller
                control={forms.control}
                name="issueDate"
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
              Mobile Number :
              <Controller
                name="mobileNumber"
                control={forms.control}
                render={({ field }) => (
                  <div>
                    <Input {...field} placeholder="Mobile Number" />
                    <p>{forms.formState.errors.mobileNumber?.message}</p>
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-2 w-[50%]">
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
          <ImageComponent selectedFile={selectedFile} imageURL={props.doctorInfo.image} formControl={forms.control} handleFileInput={handleFileInput}/>
          {/* <div className="flex flex-col justify-center items-center gap-3 ">
            <p className="text-lg font-bold">Profile Picture</p>
            {selectedFile && (
              <Avatar className="w-[250px] h-[250px]">
                <AvatarImage src={URL.createObjectURL(selectedFile)} />
                <AvatarFallback>Loading</AvatarFallback>
              </Avatar>
            )}
            {!selectedFile && props.doctorInfo.image && (
              <Avatar className="w-[250px] h-[250px]">
                <AvatarImage src={props.doctorInfo.image} />
                <AvatarFallback>Loading</AvatarFallback>
              </Avatar>
            )}
            <Controller
              name="image"
              control={forms.control}
              render={({ field }) => (
                <div className="flex flex-col">
                  <Input
                    type="file"
                    ref={field.ref}
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={(e) => {
                      handleFileInput(e);
                    }}
                  />
                </div>
              )}
            />
          </div> */}
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

export default DoctorInfoForm;
