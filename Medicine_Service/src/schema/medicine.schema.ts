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
        .optional()
        .transform((val) => (val ? val.toLowerCase() : "brands")) // if filterBy is empty, default to "brands"
        .refine(
          (val) => !val || filterQueries_options.includes(val), // Check if the transformed value is one of the options
          {
            message: `filterBy may be empty or must be one of ${filterQueries_options.join(
              ", "
            )}`,
          }
        ),

      // searchBy is optional, but if it is not empty, it will be transformed to lowercase
      searchBy: string()
        .transform((val) => val.toLowerCase())
        .optional(),

      pagination: union([number(), string()])
        .optional()
        .transform((val) => (val ? Number(val) : 5)),
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

  // get_generic_info
  get_generic_info_Schema = object({
    params: object({
      genericId: union([number(), string()]).transform((val) => Number(val)),
    }),
  });

  // get_generic_info_v2
  get_generic_info_Schema_v2 = object({
    params: object({
      genericId: union([number(), string()]).transform((val) => Number(val)),
      currentPage: union([number(), string()]).transform((val) => Number(val)),
    }),

    query: object({
      pagination: union([number(), string()])
        .optional()
        .transform((val) => (val ? Number(val) : 5)),
    }).optional(),
  });

  // get_manufacturer_info
  get_manufacturer_info_Schema = object({
    params: object({
      manufacturerId: union([number(), string()]).transform((val) =>
        Number(val)
      ),
    }),
  });

  // get_manufacturer_info_v2
  get_manufacturer_info_v2_Schema = object({
    params: object({
      manufacturerId: union([number(), string()]).transform((val) =>
        Number(val)
      ),
      currentPage: union([number(), string()]).transform((val) => Number(val)),
    }),

    query: object({
      pagination: union([number(), string()])
        .optional()
        .transform((val) => (val ? Number(val) : 5)),
    }).optional(),
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

export type Get_Generic_Info_Params_Input = TypeOf<
  Medicine_Schema["get_generic_info_Schema"]
>["params"];

export type Get_Manufacturer_Info_Params_Input = TypeOf<
  Medicine_Schema["get_manufacturer_info_Schema"]
>["params"];

export type Get_Manufacturer_Info_v2_Params_Input = TypeOf<
  Medicine_Schema["get_manufacturer_info_v2_Schema"]
>["params"];

export type Get_Manufacturer_Info_v2_Queries_Input = TypeOf<
  Medicine_Schema["get_manufacturer_info_v2_Schema"]
>["query"];

export type Get_Generic_Info_Params_Input_v2 = TypeOf<
  Medicine_Schema["get_generic_info_Schema_v2"]
>["params"];

export type Get_Generic_Info_Queries_Input_v2 = TypeOf<
  Medicine_Schema["get_generic_info_Schema_v2"]
>["query"];
