// external imports
import { object, string, union, TypeOf, number, date, any } from "zod";
import log from "../utils/logger";

export interface Prescription_Schema_Interface {
  // generate prescription header
  Generate_Prescription_Header: object;

  // create prescription
  Create_Prescription: object;
}

class Prescription_Schema implements Prescription_Schema_Interface {
  // ----------------- Generate Prescription Header ----------------- //
  Generate_Prescription_Header = object({
    params: object({
      appointmentID: union([string(), number()]).transform((val) => {
        const num = Number(val);

        return num.toString();
      }),
    }), // end of params
  }); // end of Generate_Prescription_Header

  // ----------------- Create Prescription ----------------- //
  Create_Prescription = object({
    params: object({
      appointmentID: union([string(), number()])
        .refine(
          (val) => {
            const num = Number(val);

            return !isNaN(num) && num > 0 && Number.isInteger(num);
          },
          {
            message: "appointmentID must be a positive integer",
          }
        )
        .transform((val) => {
          const num = Number(val);

          return num.toString();
        }),
    }), // end of params

    body: object({
      symptoms: string().array().min(1, "symptoms must have atleast 1 item"),
      diagnosis: string().array().min(1, "diagnosis must have atleast 1 item"),
      advices: string().array().min(1, "advices must have atleast 1 item"),
      followUpDate: date().nullable().optional(),
      otherNotes: string().array().optional(),

      medicines: object({
        medicineID: number()
          .positive()
          .refine((val) => {
            return Number.isInteger(val);
          }, "medicineID must be an positive integer"),

        dosage: string({
          required_error: "dosage is required",
        }),

        when: string({
          required_error: "when is required",
        }),

        duration: number({
          required_error: "duration is required",
        })
          .positive()
          .refine((val) => {
            return Number.isInteger(val);
          }, "duration must be an positive integer"),
      })
        .array()
        .min(1, "medicines must have atleast 1 item"),
    }),
  }); // end of Create_Prescription
}

export default new Prescription_Schema();

export type Create_Prescription_Params_Input = TypeOf<
  Prescription_Schema["Create_Prescription"]
>["params"];

export type Create_Prescription_Body_Input = TypeOf<
  Prescription_Schema["Create_Prescription"]
>["body"];
