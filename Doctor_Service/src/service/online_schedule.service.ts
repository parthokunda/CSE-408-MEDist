// external imports
import createHttpError from "http-errors";

//import model
import { Doctor, OnlineSchedule } from "../database/models";
import { OnlineScheduleAttributes } from "../database/models/Online_Schedule.model";
import { Create_Schedule_Body_Input } from "../schema/doctor.schema";

//import repository instance
import { online_scheduleRepository } from "../database/repository";

export interface OnlineScheduleServiceInterface {
  //create online schedule
  createOnlineSchedule(
    doctorID: number,
    schedule: Create_Schedule_Body_Input
  ): Promise<OnlineScheduleAttributes>;

  //update online schedule
  updateOnlineSchedule(
    doctorID: number,
    schedule: Create_Schedule_Body_Input
  ): Promise<OnlineScheduleAttributes>;
}

class OnlineScheduleService implements OnlineScheduleServiceInterface {
  // ----------------------- Create Online Schedule ----------------------- //
  async createOnlineSchedule(
    doctorID: number,
    scheduleInfo: Create_Schedule_Body_Input
  ): Promise<OnlineScheduleAttributes> {
    try {
      const onlineSchedule =
        await online_scheduleRepository.createOnlineSchedule(
          doctorID,
          scheduleInfo
        );

      return onlineSchedule;
    } catch (error) {
      throw error;
    }
  }

  // ----------------------- Update Online Schedule ----------------------- //
  async updateOnlineSchedule(
    doctorID: number,
    scheduleInfo: Create_Schedule_Body_Input
  ): Promise<OnlineScheduleAttributes> {
    try {
      const onlineSchedule =
        await online_scheduleRepository.updateOnlineSchedule(
          doctorID,
          scheduleInfo
        );

      return onlineSchedule;
    } catch (error) {
      throw error;
    }
  }
}

export default new OnlineScheduleService();
