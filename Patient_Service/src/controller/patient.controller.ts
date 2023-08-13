// external imports
import { NextFunction, Request, Response } from "express";
import {} from "../utils/custom"

//internal imports
import patientService from "../services/patient.service";
import { Update_Patient_Info_Body_Input } from "../schema/patient.schema";

interface Patient_Controller_Interface {
  //update patient info
  updatePatientInfo(
    req: Request<{}, {}, Update_Patient_Info_Body_Input>,
    res: Response,
    next: NextFunction
  );
}

class Patient_Controller implements Patient_Controller_Interface {
  // ----------------------------------------- Update Patient Info ------------------------------------------ //
  async updatePatientInfo(
    req: Request<{}, {}, Update_Patient_Info_Body_Input>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const patientID = req.user_identity?.id as number;
      const newPatientInfo = req.body;

      const updatedPatient = await patientService.updatePatientInfo(
        patientID,
        newPatientInfo
      );

      res.status(200).json(updatedPatient);
    } catch (error) {
      next(error);
    }
  }
}

export default new Patient_Controller();
