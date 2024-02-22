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
import brokerService, {
  BrokerServiceInterface,
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../utils/broker";
import log from "../utils/logger";
import { config } from "../config";

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

  // give schedule info to other services
  giveScheduleInfo(scheduleID: number): Promise<RPC_Response_Payload>;
}

class OnlineScheduleService implements OnlineScheduleServiceInterface {
  // broker service will be insatnced once and will be used throughout the application
  // even if we create multiple instances of this class

  private static brokerService: BrokerServiceInterface;

  constructor() {
    if (!OnlineScheduleService.brokerService) {
      OnlineScheduleService.brokerService = brokerService;

      brokerService.SUBSCRIBE_TO_EXCHANGE(
        config.TEMPORARAY_APPOINTMENT_DELETION_EXCHANGE,
        this.temporaryAppointmentDeletionObserver
      );

      brokerService.SUBSCRIBE_TO_EXCHANGE(
        config.APPOINTMENT_CREATION_EXCHANGE,
        this.AppointmentCreationObserver
      );
    }
  }

  private temporaryAppointmentDeletionObserver = async (
    payload: RPC_Request_Payload
  ): Promise<void> => {
    try {
      log.info(payload, "received info that an appointment has been deleted");
      const timeSlotID = payload.data["timeSlotID"];

      const schedule = await online_scheduleRepository.getOnlineScheduleInfo(
        timeSlotID
      );

      if (!schedule) {
        log.error("No schedule found with the given time slot id");
        return;
      }

      if (schedule.remainingSlots < schedule.totalSlots) {
        schedule.remainingSlots++;
        await schedule.save();
      }
    } catch (error) {
      log.error(error, "Error in temporary appointment deletion observer");
      return;
    }
  };

  private AppointmentCreationObserver = async (
    payload: RPC_Request_Payload
  ): Promise<void> => {
    try {
      log.info(payload, "received info that an appointment has been created");
      const timeSlotID = payload.data["timeSlotID"];

      const schedule = await online_scheduleRepository.getOnlineScheduleInfo(
        timeSlotID
      );

      if (!schedule) {
        log.error("No schedule found with the given time slot id");
        return;
      }

      if (schedule.remainingSlots > 0) {
        schedule.remainingSlots--;
        await schedule.save();
      }
    } catch (error) {
      log.error(error, "Error in appointment creation observer");
      return;
    }
  };

  // ----------------------- Give Schedule Info ----------------------- //
  async giveScheduleInfo(scheduleID: number): Promise<RPC_Response_Payload> {
    log.debug(scheduleID, "received schedule id");
    log.debug(typeof scheduleID, "received schedule id type");

    try {
      const schedule = await online_scheduleRepository.getOnlineScheduleInfo(
        scheduleID
      );

      return {
        status: "success",
        data: {
          id: schedule.id,
          doctorID: schedule.doctorID,

          weekday: schedule.weekday,
          startTime: schedule.startTime,
          endTime: schedule.endTime,

          totalSlots: schedule.totalSlots,
          remainingSlots: schedule.remainingSlots,
        },
      };
    } catch (error) {
      log.error(error, "Error in giving schedule info");

      return {
        status: "error",
        data: {},
      };
    }
  }

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

      //sort ascending order by weekday
      onlineSchedulesInfo.sort((a, b) => {
        return a.weekday - b.weekday;
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
