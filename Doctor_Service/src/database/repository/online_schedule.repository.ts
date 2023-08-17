//import model
import createHttpError from "http-errors";

// internal import
import { OnlineScheduleAttributes } from "../models/Online_Schedule.model";

//import model
import { Doctor, OnlineSchedule } from "../models";

export interface Online_Schedule_Repository_Interface {
  // create online schedule
  createOnlineSchedule(
    doctorID: number,
    schedule: Partial<OnlineSchedule>
  ): Promise<OnlineSchedule>;

  // update online schedule
  updateOnlineSchedule(
    doctorID: number,
    schedule: Partial<OnlineSchedule>
  ): Promise<OnlineSchedule>;
}

class Online_Schedule_Repository
  implements Online_Schedule_Repository_Interface
{
  // ----------------------- Create Online Schedule ----------------------- //
  async createOnlineSchedule(
    doctorID: number,
    scheduleInfo: Partial<OnlineSchedule>
  ): Promise<OnlineSchedule> {
    try {
      const doctor = await Doctor.findByPk(doctorID);
      if (!doctor) throw new createHttpError.NotFound("Doctor not found");

      const onlineSchedule = await OnlineSchedule.create(scheduleInfo);

      if (!onlineSchedule)
        throw new createHttpError.InternalServerError(
          "Error in creating online schedule"
        );

      await doctor.setOnlineSchedule(onlineSchedule);
      await onlineSchedule.setDoctor(doctor);

      return onlineSchedule;
    } catch (error) {
      throw createHttpError.InternalServerError(error.message);
    }
  }

  // ----------------------- Update Online Schedule ----------------------- //
  async updateOnlineSchedule(
    doctorID: number,
    scheduleInfo: Partial<OnlineSchedule>
  ): Promise<OnlineSchedule> {
    try {
      const doctor = await Doctor.findByPk(doctorID);
      if (!doctor) throw new createHttpError.NotFound("Doctor not found");

      const onlineSchedule = await doctor.getOnlineSchedule();
      if (!onlineSchedule)
        throw new createHttpError.NotFound("Online schedule not found");

      const updatedOnlineSchedule = await onlineSchedule.update(scheduleInfo);

      if (!updatedOnlineSchedule)
        throw new createHttpError.InternalServerError(
          "Error in updating online schedule"
        );

      return updatedOnlineSchedule;
    } catch (error) {
      throw createHttpError.InternalServerError(error.message);
    }
  }
}
export default new Online_Schedule_Repository();
