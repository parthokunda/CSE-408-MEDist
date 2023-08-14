// external imports
import { NextFunction, Request, Response } from "express";
import {} from "../utils/custom";

//internal imports
import patientService from "../services/patient.service";
import { Update_Patient_Info_Body_Input } from "../schema/patient.schema";
import createHttpError from "http-errors";

interface Patient_Controller_Interface {
  //get profile / patient info
  getPatientInfo(req: Request, res: Response, next: NextFunction);


  //upload image
  uploadImage(req: Request, res: Response, next: NextFunction);

  
  
  //update patient info
  updatePatientInfo(
    req: Request<{}, {}, Update_Patient_Info_Body_Input>,
    res: Response,
    next: NextFunction
  );
}

class Patient_Controller implements Patient_Controller_Interface {
  // ----------------------------------------- Get Patient Info ------------------------------------------ //
  async getPatientInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const patientID = req.user_identity?.id as number;

      const patientInfo = await patientService.getPatientInfo(patientID);

      res.status(200).json(patientInfo);
    } catch (error) {
      next(error);
    }
  }

  // ----------------------------------------- Upload Image ------------------------------------------ //
  async uploadImage(req: Request, res: Response, next: NextFunction) {
    if (req.body.imageUrl) {
      res.status(200).json({
        message : "Image uploaded successfully",
        imageUrl: req.body.imageUrl,
      });
    }
    else {
      throw createHttpError.InternalServerError("Error getting image url");
    }

  }

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
