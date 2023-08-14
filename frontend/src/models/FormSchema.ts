import { z } from "zod";

export const MedSearchForm = z.object({
  searchText: z
    .string()
    .max(20, { message: "Search string length cannot exceed 20" }),
  filterBy: z.union([z.literal("brands"), z.literal("generics")]),
});

const roleValidator = z.union([z.literal("patient"), z.literal("doctor"), z.literal("")])

export const LoginCardForm = z.object({
  email: z.string().email({ message: "Invalid Email" }),
  password: z.string().min(4, { message: "Minimum Password Length is 4" }),
  role: roleValidator,
});

export type LoginCardFormType = z.infer<typeof LoginCardForm>

export const DoctorAdditionalInfoForm = z.object({
    gender: z.union([z.literal("male"),z.literal("female"),z.literal("other")]),
    dateOfBirth : z.date(),
    bmdcNumber: z.string().max(20, {message: "BMDC number cannot exceed 20 characters"}),
    issueDate: z.date(),
    department: z.string(),
    degree : z.string().array().max(5, {message: "Maximum 5 degrees can be added"}),
    
});

export const patientAdditionalInfoForm = z.object({
    gender : z.union([z.literal("male"),z.literal("female"),z.literal("other")]),
    dateOfBirth : z.date(),
    height : z.object({
        feet : z.number().int().min(0).max(10),
        inches : z.number().min(0).max(12)
    }),
    weight : z.number().min(0),
    bloodGroup : z.union([z.literal("A+"),z.literal("A-"),z.literal("B+"),z.literal("B-"),z.literal("AB+"),z.literal("AB-"),z.literal("O+"),z.literal("O-")]),
});

export const RegisterCardForm = z
  .object({
    name: z
      .string()
      .min(3, { message: "Minimum Name Length is 3" })
      .max(20, { message: "Maximum Name Length is 20" }),
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
