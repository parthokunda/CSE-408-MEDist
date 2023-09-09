import { Patient_or_Doctor_Info } from "./Brand";

export enum AppointmentType {
  ONLINE = "online",
  PHYSICAL = "physical",
}

export enum AppointmentStatus {
  PENDING = "pending",
  PRESCRIBED = "prescribed",
  RATED = "rated",
  COMPLETED = "completed",
  TEMPORARY = "temporary",
}

export interface PendingAppointmentOverviewInfo {
  id: number;
  type: AppointmentType;

  patientInfo: Patient_or_Doctor_Info | null;

  doctorInfo: Patient_or_Doctor_Info | null;

  startTime: Date;
  endTime: Date;

  status: AppointmentStatus;

  meetingLink: string | null;
}

export type RequestAppointmentInfo = {
  message: string;
  appointment: PendingAppointmentOverviewInfo;
};

export type ConfirmAppointmentResponseInfo = {
  id: number;
  type: AppointmentType;

  patientInfo: Patient_or_Doctor_Info | null;

  doctorInfo: Patient_or_Doctor_Info | null;

  startTime: Date;
  endTime: Date;

  status: AppointmentStatus;

  meetingLink: string | null;
};

export type ConfirmAppointmentResponse = {
  message: string;
  appointment: ConfirmAppointmentResponseInfo;
};

export type RejectAppointmentRespone = {
  message: string;
};

export interface GetPendingAppointments {
  appointments: PendingAppointmentOverviewInfo[];
  totalCount: number;
}
