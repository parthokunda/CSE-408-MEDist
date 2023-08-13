// external imports
import { object, string, union, TypeOf, number, date, any } from "zod";
import {
  PatientBloodGroup,
  PatientGendar,
} from "../database/models/Patient.model";

// internal imports

export interface Patient_Schema_Interface {
  //patient update info
  Update_Patient_Info: object;
}

class PatientSchema implements Patient_Schema_Interface {
  // ------------------------- Update Patient Info Schema -------------------------
  Update_Patient_Info = object({
    body: object({
      name: string({
        required_error: "Name is required",
      }),

      phone: string({
        required_error: "Phone is required",
      }),

      gendar: string({
        required_error: "Gendar is required",
      }).refine(
        (val) => Object.values(PatientGendar).includes(val as PatientGendar),
        {
          message: `Gendar must be one of ${Object.values(PatientGendar).join(
            ", "
          )}`,
        }
      ),

      // age must be <= 100
      dob: date({
        required_error: "Date of birth is required",
      }).refine(
        (val) => {
          const today = new Date();
          const age = today.getFullYear() - val.getFullYear();
          return age <= 100;
        },
        {
          message: "Age must be <= 100",
        }
      ),

      address: string({
        required_error: "Address is required",
      }),

      bloodGroup: string({
        required_error: "Blood group is required",
      }).refine(
        (val) =>
          Object.values(PatientBloodGroup).includes(val as PatientBloodGroup),
        {
          message: `Blood group must be one of ${Object.values(
            PatientBloodGroup
          ).join(", ")}`,
        }
      ),

      // can be number or string (number in string), can be empty
      height: union([number(), string()])
        .transform((val) => Number(val))
        .optional(),

      weight: union([number(), string()])
        .transform((val) => Number(val))
        .optional(),

      //image is an url
      image: string().url().optional(),
    }),
  });
}

export default new PatientSchema();

export type Update_Patient_Info_Body_Input = TypeOf<
  PatientSchema["Update_Patient_Info"]
>["body"];
