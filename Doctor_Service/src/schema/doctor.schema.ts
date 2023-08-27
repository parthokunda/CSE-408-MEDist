// external imports
import { object, string, union, TypeOf, number, date, any } from "zod";

// internal imports
import { DoctorStatus, DoctorGendar } from "../database/models/Doctor.model";
import log from "../utils/logger";

export interface Doctor_Schema_Interface {
  //doctor update info
  Update_Doctor_Info: object;

  //create online schedule
  Create_Schedule: object;

  //search doctor
  Search_Doctor: object;
}

class DoctorSchema implements Doctor_Schema_Interface {
  // ------------------------- Update Doctor Info Schema -------------------------
  Update_Doctor_Info = object({
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
        (val) => Object.values(DoctorGendar).includes(val as DoctorGendar),
        {
          message: `Gendar must be one of ${Object.values(DoctorGendar).join(
            ", "
          )}`,
        }
      ),

      dob: string({
        required_error: "Date of birth is required",
      }).refine(
        (val) => {
          const today = new Date();
          const date = new Date(val);
          const age = today.getFullYear() - date.getFullYear();
          return age <= 80;
        },
        {
          message: "Age must be <= 80",
        }
      ),

      bmdc: string({
        required_error: "BMDC is required",
      }),

      issueDate: string({
        required_error: "Issue date is required",
      }).refine(
        (val) => {
          const today = new Date();
          const date = new Date(val);
          return date <= today;
        },
        {
          message: "Issue date must be <= today",
        }
      ),

      degrees: string({
        required_error: "Degrees is required",
      }),

      specializationID: number({
        required_error: "Specialization is required",
      }),

      image: string().optional(),
    }),
  });

  // ------------------------- Add Schedule Schema -------------------------
  Create_Schedule = object({
    body: object({
      visitFee: number({
        required_error: "Visit fee is required",
      }),

      schedule : any({
        required_error: "Schedule is required",
      })

      // shedule is an array of objects which may be empty object or with the following structure
      // {
      //   weekname: number
      //   startTime: string
      //   endTime: string
      //   totalSlots: number
      // }

      schedule: any({
        required_error: "Schedule is required",
      }).refine(
        (val) => {
          //if (!Array.isArray(val)) return false;

    //         // check schedule has the following structure or not
    //         if (
    //           !(
    //             schedule.weekday &&
    //             schedule.startTime &&
    //             schedule.endTime &&
    //             schedule.totalSlots
    //           )
    //         )
    //           return false;
    //       }

            // check schedule has the following structure or not
            if (
              !(
                schedule.weekname &&
                schedule.startTime &&
                schedule.endTime &&
                schedule.totalSlots
              )
            )
              return false;
          }

          return true;
        },
        {
          message: `Schedule must be an array of objects
            in which an object may be empty {} or with the following structure:
            {
              weekday: number,
              startTime: string,
              endTime: string,
              totalSlots: number
            }`,
        }
      ),
    }),
  });

  // ------------------------- Search Doctor Schema -------------------------
  Search_Doctor = object({
    query: object({
      name: string().optional(),
      specializationID: union([number(), string()]).optional(),
      pagination: union([number(), string()])
        .refine(
          (val) => {
            if (!val) return true;

            const num = Number(val);
            return num && Number.isInteger(num) && num > 0;
          },
          {
            message: "Pagination must be a positive integer",
          }
        )
        .optional(),
    }),

    params: object({
      currentPage: union([number(), string()])
        .default(1)
        .refine(
          (val) => {
            const num = Number(val);
            return num && Number.isInteger(num) && num > 0;
          },
          {
            message: "Current page is required and must be a positive integer",
          }
        ),
    }),
  });
}

export default new DoctorSchema();

export type Update_Doctor_Info_Body_Input = TypeOf<
  DoctorSchema["Update_Doctor_Info"]
>["body"];

export type Create_Schedule_Body_Input = TypeOf<
  DoctorSchema["Create_Schedule"]
>["body"];

export type Search_Doctor_Query_Input = TypeOf<
  DoctorSchema["Search_Doctor"]
>["query"];

export type Search_Doctor_Params_Input = TypeOf<
  DoctorSchema["Search_Doctor"]
>["params"];
