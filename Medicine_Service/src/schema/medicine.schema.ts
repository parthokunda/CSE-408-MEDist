//external imports
import { object, string, union, TypeOf, number } from "zod";

interface Medicine_Schema_Interface {
  search_All_Medicine_Schema: object;
  get_medicine_info_Schema: object;
}

const filterQueries_options = ["brands", "generics", "manufacturer"];

class Medicine_Schema implements Medicine_Schema_Interface {
  // search_All_Medicine_Schema
  search_All_Medicine_Schema = object({
    query: object({
      filterBy: string()
        .default("brands")
        .transform((val) => val.toLowerCase()) // Transform the value to lowercase
        .refine(
          (val) => filterQueries_options.includes(val), // Check if the transformed value is one of the options
          {
            message: `filterBy may be empty, if not it must be one of ${filterQueries_options.join(
              ", "
            )}`,
          }
        ),

      // searchBy is optional, but if it is not empty, it will be transformed to lowercase
      searchBy: string()
        .transform((val) => val.toLowerCase())
        .optional(),

      pagination: union([number(), string()])
        .default(5)
        .transform((val) => Number(val)),
    }),

    params: object({
      currentPage: union([number(), string()])
        .default(1)
        .transform((val) => Number(val)),
    }).optional(),
  });

  // get_medicine_info
  get_medicine_info_Schema = object({
    params: object({
      medicineId: union([number(), string()]).transform((val) => Number(val)),
    }),
  });
}

export default new Medicine_Schema();

export type Search_All_Medicine_Queries_Input = TypeOf<
  Medicine_Schema["search_All_Medicine_Schema"]
>["query"];

export type Search_All_Medicine_Params_Input = TypeOf<
  Medicine_Schema["search_All_Medicine_Schema"]
>["params"];

export type Get_Medicine_Info_Params_Input = TypeOf<
  Medicine_Schema["get_medicine_info_Schema"]
>["params"];
