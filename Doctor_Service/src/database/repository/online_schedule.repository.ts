//import model
import createHttpError from "http-errors";

// internal import
import { OnlineScheduleAttributes } from "../models/Online_Schedule.model";

//import model
import { Doctor, OnlineSchedule } from "../models";

export interface Online_Schedule_Repository_Interface {
  // create online schedule
  createOnlineSchedules(
    doctorID: number,
    schedules: Partial<OnlineSchedule>[]
  ): Promise<OnlineSchedule[]>;

  // update online schedule
  updateOnlineSchedules(
    doctorID: number,
    schedules: Partial<OnlineSchedule>[]
  ): Promise<OnlineSchedule[]>;
}

class Online_Schedule_Repository
  implements Online_Schedule_Repository_Interface
{
  // ----------------------- Create Online Schedule ----------------------- //
  async createOnlineSchedules(
    doctorID: number,
    schedules: Partial<OnlineSchedule>[]
  ): Promise<OnlineSchedule[]> {
    try {
      const doctor = await Doctor.findByPk(doctorID);
      if (!doctor) throw new createHttpError.NotFound("Doctor not found");

      const createdSchedules = await OnlineSchedule.bulkCreate(schedules);

      if (!createdSchedules)
        throw new createHttpError.InternalServerError(
          "Error in creating online schedules"
        );

      for (const schedule of createdSchedules) {
        await doctor.addOnlineSchedule(schedule);
        await schedule.setDoctor(doctor);
      }

      return createdSchedules;
    } catch (error) {
      throw createHttpError.InternalServerError(error.message);
    }
  }

  // ----------------------- Update Online Schedule ----------------------- //
  async updateOnlineSchedules(
    doctorID: number,
    schedules: Partial<OnlineSchedule>[]
  ): Promise<OnlineSchedule[]> {
    try {
      const doctor = await Doctor.findByPk(doctorID);
      if (!doctor) throw new createHttpError.NotFound("Doctor not found");

      const onlineSchedule = await doctor.getOnlineSchedules();
      if (!onlineSchedule)
        throw new createHttpError.NotFound("Online schedule not found");

      // check which schedule is to be updated
      //and which is to be created
      //and which is to be deleted

      for (const requestedSchedule of schedules) {
        const schedule = onlineSchedule.find(
          (schedule) => schedule.weekname === requestedSchedule.weekname
        );

        if (schedule) {
          // update schedule
          await schedule.update(requestedSchedule);
          await schedule.save();
        } else {
          // create schedule
          const newCreatedSchedule = await OnlineSchedule.create(
            requestedSchedule
          );
          await doctor.addOnlineSchedule(newCreatedSchedule);
          await newCreatedSchedule.setDoctor(doctor);
        }
      }

      // uptill new schedule is created
      // now delete the schedule which is not requested
      const added_and_updated_schedule = await doctor.getOnlineSchedules();
      if (!added_and_updated_schedule)
        throw new createHttpError.NotFound(
          "Online schedule not found - after update"
        );

      //extra schedule which is not requested to be deleted
      const extraSchedule = added_and_updated_schedule.filter(
        (schedule) =>
          !schedules.find(
            (requestedSchedule) =>
              requestedSchedule.weekname === schedule.weekname
          )
      );

      for (const schedule of extraSchedule) {
        await schedule.destroy();
      }

      return await doctor.getOnlineSchedules();
    } catch (error) {
      throw createHttpError.InternalServerError(error.message);
    }
  }
}
export default new Online_Schedule_Repository();
