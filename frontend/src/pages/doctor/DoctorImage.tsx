import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { typeToFlattenedError, z } from "zod";
import FormData from "form-data";
import axios from "axios";

const DoctorImageForm = z.object({
  image: z
    .any()
    .refine((files) => files?.size <= 500000, "Max Image Size is 5MB.")
    .refine((file) => {
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file?.type
      ),
        "Only .jpg, .jpeg, .png and .webp formats are supported.";
    }),
});

type DoctorImageFormType = z.infer<typeof DoctorImageForm>;

const DoctorImage: FC = () => {
  const imageForm = useForm();

  const submitHandler = async (formData) => {
    console.log(formData);
    let data = new FormData();
    data.append("image", formData.iamge);
    console.log("🚀 ~ file: DoctorImage.tsx:29 ~ submitHandler ~ data:", data);
    const response = await axios.post("http://localhost:3003/demo-file-upload/", data, {
      headers: {
        accept: "application/json",
        "Accept-Language": "en-US,en;q=0.8",
        "Content-Type": `multipart/form-data;`,
      },
    });
    console.log(response);
  };

  return (
    <>
      <form onSubmit={imageForm.handleSubmit(submitHandler)}>
        <Controller
          name="image"
          control={imageForm.control}
          render={({ field }) => <Input type="file" {...field} />}
        />
        <Button type="submit">Submit</Button>
      </form>
    </>
  );
};

export default DoctorImage;
