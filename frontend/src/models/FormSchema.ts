import { z } from "zod";

export const MedSearchForm = z.object({
  searchText: z
    .string()
    .max(20, { message: "Search string length cannot exceed 20" }),
  filterBy: z.union([z.literal("brands"), z.literal("generics")]),
});

const roleValidator = z.union([
  z.literal("patient"),
  z.literal("doctor"),
  z.literal(""),
]);

export const LoginCardForm = z.object({
  email: z.string().email({ message: "Invalid Email" }),
  password: z.string().min(4, { message: "Minimum Password Length is 4" }),
  role: roleValidator,
});

export type LoginCardFormType = z.infer<typeof LoginCardForm>;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const DoctorAdditionalInfoForm = z.object({
  name:z.string().nonempty({message: "Image Error"}),
  gender: z.union([z.literal("male"), z.literal("female"), z.literal("other")]),
  dateOfBirth: z.union([z.string(), z.date()]),
  bmdcNumber: z
    .string()
    .max(20, { message: "BMDC number cannot exceed 20 characters" }),
  issueDate: z.union([z.string(), z.date()]),
  mobileNumber: z.string().nonempty({message: "Image Error"}),
  department: z.string().nonempty({message: "Image Error"}),
  degrees: z.string().nonempty({ message: "Degrees cannot be empty" }),
  image: z.string().nonempty({message: "Image Error"}),
});

export const PatientAdditionalInfoForm = z.object({
  name:z.string().nonempty(),
  gender: z.union([z.literal("male"), z.literal("female"), z.literal("other")]),
  dateOfBirth: z.union([z.string(), z.date()]),
  mobileNumber: z.string().nonempty(),
  height_feet: z.number(),
  height_inches: z.number(),
  weight: z.number(),
  bloodGroup: z.string().nonempty(),
  image: z.any(),
});

export const RegisterCardForm = z
  .object({
    email: z.string().email({ message: "Invalid Email" }),
    password: z.string().min(4, { message: "Minimum Password Length is 4" }),
    confirmPassword: z.string().min(4),
    role: roleValidator,
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword != password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });

export type RegisterCardFormType = z.infer<typeof RegisterCardForm>;

const daysOfWeekSchema = z.enum([
  "Friday",
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
]);

export const DoctorOnlineScheduleForm = z.object({
  days: z
    .object({
      day: daysOfWeekSchema,
      startTime: z.string().nonempty(),
      endTime: z.string().nonempty(),
      slot: z.string().nonempty(),
    })
    .array(),
  cost: z.string().nonempty(),
  contact: z.string().nonempty(),
});

export const DoctorSearchForm = z.object({
  name: z.string(),
  department: z.string(),
});

export type DoctorSearchFormType = z.infer<typeof DoctorSearchForm>

export const PatientSearchForm = z.object({
  name: z.string(),
});
