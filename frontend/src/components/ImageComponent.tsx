import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { FC } from "react";
import { Controller } from "react-hook-form";

const ImageComponent: FC<{selectedFile: File | null, imageURL: string | null, formControl: any, handleFileInput: Function}> = (props) => {
  return (
    <div className="flex flex-col justify-center items-center gap-3 ">
      <p className="text-lg font-bold">Profile Picture</p>
      {props.selectedFile && (
        <Avatar className="w-[250px] h-[250px]">
          <AvatarImage src={URL.createObjectURL(props.selectedFile)} />
          <AvatarFallback>Loading</AvatarFallback>
        </Avatar>
      )}
      {!props.selectedFile && props.imageURL && (
        <Avatar className="w-[250px] h-[250px]">
          <AvatarImage src={props.imageURL} />
          <AvatarFallback>Loading</AvatarFallback>
        </Avatar>
      )}
      <Controller
        name="image"
        control={props.formControl}
        render={({ field }) => (
          <div className="flex flex-col">
            <Input
              type="file"
              ref={field.ref}
              name={field.name}
              onBlur={field.onBlur}
              onChange={(e) => {
                props.handleFileInput(e);
              }}
            />
          </div>
        )}
      />
    </div>
  );
};

export default ImageComponent;
