// external imports
import { NextFunction, Request, Response } from "express";
import {} from "../utils/custom";

//internal imports
import patientService from "../services/patient.service";
import { Update_Patient_Info_Body_Input } from "../schema/patient.schema";
import createHttpError from "http-errors";

interface Patient_Controller_Interface {
  //get patient profile info / profile info
  getPatientProfileInfo(req: Request, res: Response, next: NextFunction);

  //get patient additional info
  getPatientAdditionalInfo(req: Request, res: Response, next: NextFunction);

  //update patient additional info
  updatePatientAdditionalInfo(
    req: Request<{}, {}, Update_Patient_Info_Body_Input>,
    res: Response,
    next: NextFunction
  );
}

class Patient_Controller implements Patient_Controller_Interface {
  // ----------------------Get Patient Profile Info -------------------------- //
  async getPatientProfileInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const patientID = req.user_identity?.id as number;

      const patientInfo = await patientService.getPatientInfo(patientID);

      res.status(200).json(patientInfo);
    } catch (error) {
      next(error);
    }
  }

  // ----------------------Get Patient Additional Info -------------------------- //
  async getPatientAdditionalInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const patientID = req.user_identity?.id as number;

      const patientInfo = await patientService.getPatientAdditionalInfo(
        patientID
      );

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
      const email = req.user_identity?.email as string;

      //construct height as number if it is not empty
      if (req.body.height) {
        // make feet number as integer part and inches number as decimal part
        const feet =
          typeof req.body.height.feet === "string"
            ? parseInt(req.body.height.feet)
            : (req.body.height.feet as number);

        let inches = req.body.height.inches as number;

        //make inches to decimal
        inches = inches / 100;
        req.body.height = feet + inches;
      }

      const patientInfo = {
        ...req.body,
        dob: new Date(req.body.dob),
        email,
      };

      const updatedPatient = await patientService.updatePatientAdditionalInfo(
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
