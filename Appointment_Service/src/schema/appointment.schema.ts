// external imports
import { object, string, union, TypeOf, number, date, any } from "zod";
import log from "../utils/logger";
import { WeekName } from "../database/models";

export interface Appointment_Schema_Interface {
  // booking online appointment
  Booking_Online_Appointment: object;

  // search pending appointments
  Search_Pending_Appointments: object;

  // confirm online appointment
  Confirm_Online_Appointment: object;
}

class Appointment_Schema implements Appointment_Schema_Interface {
  // ----------------- Booking Online Appointment ----------------- //
  Booking_Online_Appointment = object({
    params: object({
      // doctorID is mandatory
      scheduleID: union([string(), number()])
        .refine(
          (val) => {
            const num = Number(val);

            return !isNaN(num) && num > 0 && Number.isInteger(num);
          },
          {
            message: "scheduleID must be a positive integer",
          }
        )
        .transform((val) => {
          const num = Number(val);

          return num.toString();
        }),
    }), // end of params
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

  // ------------------ Confirm Online Appointment ------------------ //
  Confirm_Online_Appointment = object({
    params: object({
      appointmentID: union([string(), number()])
        .refine((val) => {
          // must be a positive integer
          const num = Number(val);
          return !isNaN(num) && num > 0 && Number.isInteger(num);
        })
        .transform((val) => {
          const num = Number(val);
          return num.toString();
        }),
    }),
  });
}

export default Appointment_Schema;

export type Booking_Online_Appointment_Params_Input = TypeOf<
  Appointment_Schema["Booking_Online_Appointment"]
>["params"];

export type Search_Pending_Appointments_Params_Input = TypeOf<
  Appointment_Schema["Search_Pending_Appointments"]
>["params"];

export type Search_Pending_Appointments_Queries_Input = TypeOf<
  Appointment_Schema["Search_Pending_Appointments"]
>["query"];

export type Confirm_Online_Appointment_Params_Input = TypeOf<
  Appointment_Schema["Confirm_Online_Appointment"]
>["params"];
