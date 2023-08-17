// external imports
import { NextFunction, Request, Response } from "express";
import {} from "../utils/custom";

// service instance
import {
  doctorService,
  onlineScheduleService,
  specializationService,
} from "../service/service";
import {
  Create_Schedule_Body_Input,
  Search_Doctor_Params_Input,
  Search_Doctor_Query_Input,
  Update_Doctor_Info_Body_Input,
} from "../schema/doctor.schema";
import { searchQuery_and_Params } from "../database/repository/doctor.repository";

interface Doctor_Controller_Interface {
  //get Specialization list
  getSpecializationList(req: Request, res: Response, next: NextFunction);

  //get doctor's additional info
  getDoctorAdditionalInfo(req: Request, res: Response, next: NextFunction);

  //update doctor's additional info
  updateDoctorAdditionalInfo(req: Request, res: Response, next: NextFunction);

  //create online schedule
  createOnlineSchedule(
    req: Request<{}, {}, Create_Schedule_Body_Input>,
    res: Response,
    next: NextFunction
  );

  //update online schedule
  updateOnlineSchedule(
    req: Request<{}, {}, Create_Schedule_Body_Input>,
    res: Response,
    next: NextFunction
  );

  // get doctor's profile info
  getDoctorProfileInfo(req: Request, res: Response, next: NextFunction);
  getDoctorProfileInfo_givenID(req: Request, res: Response, next: NextFunction);

  // search doctor
  searchDoctor(req: Request, res: Response, next: NextFunction);
}

class Doctor_Controller implements Doctor_Controller_Interface {
  // ----------------------- Get Specialization List ----------------------- //
  async getSpecializationList(req: Request, res: Response, next: NextFunction) {
    try {
      const specializationList =
        await specializationService.getSpecializationList();

      res.status(200).json(specializationList);
    } catch (error) {
      next(error);
    }
  }

  // ----------------------- Get Doctor Additional Info ----------------------- //
  async getDoctorAdditionalInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const doctorID = req.user_identity?.id as number;

      const doctorInfo = await doctorService.getDoctorAdditionalInfo(doctorID);

      res.status(200).json(doctorInfo);
    } catch (error) {
      next(error);
    }
  }

  // ----------------------- Update Doctor Additional Info ----------------------- //
  async updateDoctorAdditionalInfo(
    req: Request<{}, {}, Update_Doctor_Info_Body_Input>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const doctorID = req.user_identity?.id as number;
      const email = req.user_identity?.email as string;

      const doctorInfo = {
        ...req.body,
        dob: new Date(req.body.dob),
        issueDate: new Date(req.body.issueDate),
        degrees: req.body.degrees.split(",").map((degree) => degree.trim()),
        email,
      };

      const updatedDoctor = await doctorService.updateDoctorAdditionalInfo(
        doctorID,
        doctorInfo
      );

      res.status(200).json(updatedDoctor);
    } catch (error) {
      next(error);
    }
  }

  // ----------------------- Create Online Schedule ----------------------- //
  async createOnlineSchedule(
    req: Request<{}, {}, Create_Schedule_Body_Input>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const doctorID = req.user_identity?.id as number;

      const schedule = req.body.schedule.map((daySchedule) => {
        return {
          weekday: daySchedule.weekday,
          startTime: daySchedule.startTime,
          endTime: daySchedule.endTime,
          totalSlots: daySchedule.totalSlots,
        };
      });
      const scheduleInfo = {
        visitFee: req.body.visitFee,
        schedule,
      };

      const onlineSchedule = await onlineScheduleService.createOnlineSchedule(
        doctorID,
        scheduleInfo
      );

      res.status(200).json(onlineSchedule);
    } catch (error) {
      next(error);
    }
  }

  // ----------------------- Update Online Schedule ----------------------- //
  async updateOnlineSchedule(
    req: Request<{}, {}, Create_Schedule_Body_Input>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const doctorID = req.user_identity?.id as number;

      const schedule = req.body.schedule.map((daySchedule) => {
        return {
          weekday: daySchedule.weekday,
          startTime: daySchedule.startTime,
          endTime: daySchedule.endTime,
          totalSlots: daySchedule.totalSlots,
        };
      });
      const scheduleInfo = {
        visitFee: req.body.visitFee,
        schedule,
      };

      const onlineSchedule = await onlineScheduleService.updateOnlineSchedule(
        doctorID,
        scheduleInfo
      );

      res.status(200).json(onlineSchedule);
    } catch (error) {
      next(error);
    }
  }

  // ----------------------- Get Doctor Profile Info----------------------- //
  async getDoctorProfileInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorID = req.user_identity?.id as number;

      const doctorProfileInfo = await doctorService.getDoctorProfileInfo(
        doctorID
      );

      res.status(200).json(doctorProfileInfo);
    } catch (error) {
      next(error);
    }
  }
  async getDoctorProfileInfo_givenID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const doctorID = Number(req.params.doctorID);

      const doctorProfileInfo = await doctorService.getDoctorProfileInfo(
        doctorID
      );

      res.status(200).json(doctorProfileInfo);
    } catch (error) {
      next(error);
    }
  }

  // ----------------------- Search Doctor ----------------------- //
  async searchDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const searchInfo: searchQuery_and_Params = {
        doctorName: req.query.name ? (req.query.name as string) : "",

        specializationID: req.query.specializationID
          ? Number(req.query.specializationID)
          : -1,

        pagination: req.query.pagination ? Number(req.query.pagination) : 5,

        currentPage: req.params.currentPage
          ? Number(req.params.currentPage)
          : 1,
      };

      const searchResult = await doctorService.searchDoctor(searchInfo);

      res.status(200).json(searchResult);
    } catch (error) {
      next(error);
    }
  }
}

export default new Doctor_Controller();
