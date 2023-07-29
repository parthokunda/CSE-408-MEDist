import { Request, Response } from "express";
import {
  Search_All_Medicine_Params_Input,
  Search_All_Medicine_Queries_Input,
} from "schema/medicine.schema";

// internal imports
import dbService from "../database/services/service";
import log from "../utils/logger";

interface Medicine_Controller_Interface {
  search_all_medicines(
    req: Request<{}, {}, {}, Search_All_Medicine_Queries_Input>,
    res: Response
  ): Promise<void>;
}


class Medicine_Controller implements Medicine_Controller_Interface {
  async search_all_medicines(
    req: Request<
      Search_All_Medicine_Params_Input,
      {},
      {},
      Search_All_Medicine_Queries_Input
    >,
    res: Response
  ): Promise<void> {
    const filterBy = req.query.filterBy as string;
    const searchBy = req.query.searchBy as string;
    const pagination = req.query.pagination
      ? (req.query.pagination as number)
      : 5;
    const currentPage = req.params.currentPage
      ? (req.params.currentPage as number)
      : 1;

    log.info(
      `search_all_medicines called with filterBy: ${filterBy} and searchBy: ${searchBy} and pagination: ${pagination} and currentPage: ${currentPage}`
    );

    let results: any;

    if (filterBy === "brands")
      results = await dbService.brandService.getAllBrands(
        searchBy,
        pagination,
        currentPage
      );
    else if (filterBy === "generics")
      results = await dbService.genericService.getAllGenerics(
        searchBy,
        pagination,
        currentPage
      );
    else if (filterBy === "manufacturer")
      results = await dbService.manufacturerService.getAllManufacturers(
        searchBy,
        pagination,
        1
      );

    log.info(results, "results: ");

    res.status(200).json({
      results,
    });
  }
}

export default new Medicine_Controller();
