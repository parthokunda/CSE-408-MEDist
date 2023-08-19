// external imports
import { object, string, union, TypeOf, number, date, any } from "zod";

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
    }),

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
          // must be a valid time format string
          return !isNaN(Date.parse(val));
        },
        {
          message: "startTime must be a valid time format string (HH:MM)",
        }
      ),

      endTime: string({
        required_error: "endTime is required",
      }).refine(
        (val) => {
          // must be a valid time format string
          return !isNaN(Date.parse(val));
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
    }),
  });
}

export default new Appointment_Schema();

export type Booking_Online_Appointment_Params_Input = TypeOf<
  Appointment_Schema["Booking_Online_Appointment"]
>["params"];

export type Booking_Online_Appointment_Body_Input = TypeOf<
  Appointment_Schema["Booking_Online_Appointment"]
>["body"];
