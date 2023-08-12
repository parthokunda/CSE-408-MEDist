import { z } from "zod";

export const MedSearchForm = z.object({
  searchText: z
    .string()
    .max(20, { message: "Search string length cannot exceed 20" }),
  filterBy: z.union([z.literal("brands"), z.literal("generics")]),
});

export const LoginCardForm = z.object({
  name: z
    .string()
    .max(20, { message: "Name maximum length 20" })
    .min(1, { message: "Please Enter Your Name" }),
  password: z.string().min(4, { message: "Minimum Password Length is 4" }),
  loginAs: z.union([z.literal('patient'), z.literal('doctor'), z.literal('assistant')]),
});

export type LoginCardFormType = z.infer<typeof LoginCardForm>