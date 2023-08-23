// external imports
import createHttpError from "http-errors";

//import model
import { DoctorOnlineScheduleInfo, OnlineSchedule } from "../database/models";
import {
  OnlineScheduleAttributes,
  OnlineScheduleInfo_Excluded_Properties,
  OnlineSchedule_Excluded_Properties,
  WeekName,
} from "../database/models/Online_Schedule.model";

//import repository instance
import {
  doctorRepository,
  online_scheduleRepository,
} from "../database/repository";
import { DoctorProfileInfo, OnlineScheduleOverview } from "../database/models";
import doctorService from "./doctor.service";
import { excludeProperties } from "../utils/necessary_functions";

export interface OnlineScheduleServiceInterface {
  //create online schedule
  createOnlineSchedule(
    doctorID: number,
    scheduleInfos: Partial<OnlineSchedule>[]
  ): Promise<DoctorProfileInfo>;

  //update online schedule
  updateOnlineSchedule(
    doctorID: number,
    scheduleInfos: Partial<OnlineSchedule>[]
  ): Promise<DoctorProfileInfo>;

  // get online schedule
  getOnlineSchedule(doctorID: number): Promise<DoctorOnlineScheduleInfo>;
}

class OnlineScheduleService implements OnlineScheduleServiceInterface {
  // ----------------------- Create Online Schedule ----------------------- //
  async createOnlineSchedule(
    doctorID: number,
    scheduleInfos: Partial<OnlineSchedule>[]
  ): Promise<DoctorProfileInfo> {
    try {
      for (const schedule of scheduleInfos) {
        schedule.doctorID = doctorID;
        if (schedule.id) delete schedule.id;
      }

      const onlineSchedules =
        await online_scheduleRepository.createOnlineSchedules(
          doctorID,
          scheduleInfos
        );

      if (!onlineSchedules)
        throw createHttpError(
          500,
          "Internal Server Error - Error in creating online schedules"
        );

      return doctorService.getDoctorProfileInfo(doctorID);
    } catch (error) {
      throw error;
    }
  }

  // ----------------------- Update Online Schedule ----------------------- //
  async updateOnlineSchedule(
    doctorID: number,
    scheduleInfos: Partial<OnlineSchedule>[]
  ): Promise<DoctorProfileInfo> {
    try {
      for (const schedule of scheduleInfos) {
        schedule.doctorID = doctorID;

        if (schedule.id) delete schedule.id;
      }

      const onlineSchedules =
        await online_scheduleRepository.updateOnlineSchedules(
          doctorID,
          scheduleInfos
        );

      if (!onlineSchedules)
        throw createHttpError(
          500,
          "Internal Server Error - Error in updating online schedules"
        );

      return doctorService.getDoctorProfileInfo(doctorID);
    } catch (error) {
      throw error;
    }
  }

  // ----------------------- Get Online Schedule ----------------------- //
  async getOnlineSchedule(doctorID: number): Promise<DoctorOnlineScheduleInfo> {
    try {
      const doctor = await doctorRepository.getDoctorInfo(doctorID);

      if (!doctor)
        throw createHttpError(
          404,
          "Not Found - Doctor not found with the given id"
        );

      const onlineSchedules = await doctor.getOnlineSchedules();

      const onlineSchedulesInfo = onlineSchedules.map((schedule) => {
        return excludeProperties(
          schedule.dataValues,
          OnlineScheduleInfo_Excluded_Properties
        );
      });

      return {
        visit_fee: doctor.online_visit_fee,
        schedules: onlineSchedulesInfo,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new OnlineScheduleService();
