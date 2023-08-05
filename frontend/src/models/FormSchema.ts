import {z} from "zod"

export const MedSearchForm = z.object({
    searchText: z
      .string()
      .max(20, { message: "Search string length cannot exceed 20" }),
    filterBy: z.union([z.literal("brands"), z.literal("generics")]),
  });