import { z } from "zod";

export const MedSearchForm = z.object({
  searchText: z
    .string()
    .max(20, { message: "Search string length cannot exceed 20" }),
  filterBy: z.union([z.literal("brands"), z.literal("generics")]),
});

export const LoginCardForm = z.object({
  email: z
    .string().email({message: "Invalid Email"}),
  password: z.string().min(4, { message: "Minimum Password Length is 4" }),
  role: z.union([z.literal('patient'), z.literal('doctor'), z.literal('assistant'),z.literal('')]),
});

export type LoginCardFormType = z.infer<typeof LoginCardForm>