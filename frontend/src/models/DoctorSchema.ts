import { UserGender } from "./UserInfo";

export interface SpecializationAttributes {
  id: number;
  name: string;
}
export type DoctorAttributes = {
  id: number;
  status: string;
  userID: number;

  // additional info
  image: string;
  name: string;
  email: string;
  phone: string;
  gendar: UserGender;
  dob: Date;
  bmdc: string;
  issueDate: Date;
  degrees: string[];

  specializationID: number;
  [key: string]:any;
}
export interface DoctorProfileInfo {
  DoctorInfo: DoctorAttributes;
  Specialization: SpecializationAttributes;
  OnlineSchedule: OnlineScheduleOverview;
}

export interface DoctorAdditionalInfo {
  DoctorInfo: Omit<
    DoctorAttributes,
    "userID" | "scheduleID" | "specializationID"
  >;
  Specialization: SpecializationAttributes | {};
}

export interface DoctorOverviewInfo {
  DoctorInfo: Omit<
    DoctorAttributes,
    "userID" | "scheduleID" | "specializationID" | "status" | "dob" | "phone"
  >; // exclude userID, scheduleID, specializationID

  Specialization: SpecializationAttributes;
}

export interface SearchDoctorInfo {
  Doctors: DoctorOverviewInfo[];
  totalCount: number;
}

export interface SingleDaySchedule {
  weekday: number;
  startTime: string;
  endTime: string;
  totalSlots: number;
}

export interface OnlineScheduleAttributes {
  id: number;
  weekday: number;
  weekname: string;
  startTime: string;
  endTime: string;
  totalSlots: number;
  remainingSlots: number;
  doctorID: number;
}

export interface OnlineScheduleOverview {
  visit_fee: number;
  schedules: OnlineScheduleOverviewInfo[];
}

export interface OnlineScheduleOverviewInfo
  extends Omit<
    OnlineScheduleAttributes,
    "doctorID" | "createdAt" | "updatedAt"
  > {}

export interface DoctorSearchAttributes {
  img: string;
  name: string;
  degree: string;
  department: string;
  bmdcNumber: string;
  cost: number;
  contact: string;
}

export interface DoctorPendingAttributes {
  appID: string;
  name: string;
  date: Date;
  meetLink: string;
}

export const daysOfWeek = [
  "Friday",
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
] as const;

export type WeekName = typeof daysOfWeek[number];