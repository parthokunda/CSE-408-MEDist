import {z} from "zod"

export const MedSearchForm = z.object({
    searchText: z
      .string()
      .max(20, { message: "Search string length cannot exceed 20" }),
    filterBy: z.union([z.literal("brands"), z.literal("generics")]),
  });

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