export interface SpecializationAttributes {
  id: number;
  name: string;
}
export interface DoctorAttributes {
  id: number;
  status: string;
  userID: number;

  // additional info
  image: string;
  name: string;
  email: string;
  phone: string;
  gendar: string;
  dob: Date;
  bmdc: string;
  issueDate: Date;
  degrees: string[];

  specializationID: number;
  scheduleID: number;
}
export interface DoctorProfileInfo {
  DoctorInfo: DoctorAttributes;
  Specialization: SpecializationAttributes;
  OnlineSchedule: OnlineScheduleAttributes;
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
  visitFee: number;
  schedule: SingleDaySchedule[];
}

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