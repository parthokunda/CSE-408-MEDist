// external imports
import { NextFunction, Request, Response } from "express";
import {} from "../utils/custom";

//internal imports
import patientService from "../services/patient.service";
import { Update_Patient_Info_Body_Input } from "../schema/patient.schema";
import createHttpError from "http-errors";

interface Patient_Controller_Interface {
  //get profile / patient additional info
  getPatientAdditionalInfo(req: Request, res: Response, next: NextFunction);

  //update patient additional info
  updatePatientAdditionalInfo(
    req: Request<{}, {}, Update_Patient_Info_Body_Input>,
    res: Response,
    next: NextFunction
  );
}

class Patient_Controller implements Patient_Controller_Interface {
  // ----------------------Get Patient Additional Info -------------------------- //
  async getPatientAdditionalInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const patientID = req.user_identity?.id as number;

      const patientInfo = await patientService.getPatientInfo(patientID);

      res.status(200).json(patientInfo);
    } catch (error) {
      next(error);
    }
  }

  // ---------------------------Update Patient Additional Info --------------------------------- //
  async updatePatientAdditionalInfo(
    req: Request<{}, {}, Update_Patient_Info_Body_Input>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const patientID = req.user_identity?.id as number;
      const patientInfo = {
        ...req.body,
        dob: new Date(req.body.dob),
      };

      const updatedPatient = await patientService.updatePatientInfo(
        patientID,
        patientInfo
      );

      res.status(200).json(updatedPatient);
    } catch (error) {
      next(error);
    }
  }
}

export default new Patient_Controller();
