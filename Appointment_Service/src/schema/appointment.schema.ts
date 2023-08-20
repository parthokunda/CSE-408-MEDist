// external imports
import { object, string, union, TypeOf, number, date, any } from "zod";
import log from "../utils/logger";

export interface Appointment_Schema_Interface {
  // booking online appointment
  Booking_Online_Appointment: object;
}

class Appointment_Schema implements Appointment_Schema_Interface {
  // ----------------- Booking Online Appointment ----------------- //
  Booking_Online_Appointment = object({
    params: object({
      // doctorID is mandatory
      doctorID: union([
        string({
          required_error: "doctorID is required",
        }).refine(
          (val) => {
            // must be a number
            return !isNaN(Number(val)) && Number(val) > 0;
          },
          {
            message: "doctorID must be a valid number string",
          }
        ),
        number({
          required_error: "doctorID is required",
        }).refine(
          (val) => {
            // must be a number
            return !isNaN(val) && val > 0;
          },
          {
            message: "doctorID must be a valid number",
          }
        ),
      ]),
    }), // end of params

    // body attributes
    body: object({
      weekday: number({
        required_error: "weekday is required",
      }).refine(
        (val) => {
          // must be a number 0 <= val <= 6 and integer
          return !isNaN(val) && val >= 0 && val <= 6 && Number.isInteger(val);
        },
        {
          message:
            "weekday must be in range 0 <= val <= 6. where 0 is Friday, 6 is Thursday",
        }
      ),

      startTime: string({
        required_error: "startTime is required",
      }).refine(
        (val) => {
          // must be a valid time format string (HH:MM )
          // check string format
          const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          return timeRegex.test(val);
        },
        {
          message: "startTime must be a valid time format string (HH:MM)",
        }
      ),

      endTime: string({
        required_error: "endTime is required",
      }).refine(
        (val) => {
          // must be a valid time format string (HH:MM )
          // check string format
          const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          return timeRegex.test(val);
        },
        {
          message: "endTime must be a valid time format string (HH:MM)",
        }
      ),

      totalSlots: number({
        required_error: "totalSlots is required",
      }).refine((val) => {
        // must be a positive integer
        return !isNaN(val) && val > 0 && Number.isInteger(val);
      }),
    }), // end of body
  });

  // ------------------ Search Pending Appointments ------------------ //
  Search_Pending_Appointments = object({
    params: object({
      currentPage: union([number(), string()]).refine(
        (val) => {
          // must be a positive integer
          const num = Number(val);
          return !isNaN(num) && num > 0 && Number.isInteger(num);
        },
        {
          message: "currentPage must be a positive integer",
        }
      ),
    }),

    query: object({
      type: string().optional(),

      pagination: union([number(), string()])
        .refine(
          (val) => {
            // must be a positive integer
            const num = Number(val);

            return !isNaN(num) && num > 0 && Number.isInteger(num);
          },
          {
            message: "pagination must be a positive integer",
          }
        )
        .optional(),

      searchByName: string().optional(),

      fromDate: union([
        date(),
        string().refine((val) => {
          // check date time format
          const dateTimeRegex =
            /^(?:(?:\d{4}-\d{2}-\d{2})|(?:\d{2}:\d{2}(?::\d{2})?)|(?:\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2})?))$/;
          return dateTimeRegex.test(val);
        }),
      ]).optional(),

      toDate: union([
        date(),
        string().refine((val) => {
          // check date time format
          const dateTimeRegex =
            /^(?:(?:\d{4}-\d{2}-\d{2})|(?:\d{2}:\d{2}(?::\d{2})?)|(?:\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2})?))$/;
          return dateTimeRegex.test(val);
        }),
      ]).optional(),
    }).optional(),
  });
}

export default new Appointment_Schema();

export type Booking_Online_Appointment_Params_Input = TypeOf<
  Appointment_Schema["Booking_Online_Appointment"]
>["params"];

export type Booking_Online_Appointment_Body_Input = TypeOf<
  Appointment_Schema["Booking_Online_Appointment"]
>["body"];

export type Search_Pending_Appointments_Params_Input = TypeOf<
  Appointment_Schema["Search_Pending_Appointments"]
>["params"];

export type Search_Pending_Appointments_Queries_Input = TypeOf<
  Appointment_Schema["Search_Pending_Appointments"]
>["query"];
