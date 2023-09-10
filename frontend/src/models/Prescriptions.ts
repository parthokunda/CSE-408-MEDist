import { AppointmentStatus } from "./Appointment";
import { BrandInfo, DosageFormAttributes, GenericAttributes, ManufacturerAttributes } from "./Brand";

export type PrescribedMedType = {
  name: string;
  when: "before" | "after";
  dosage: {
    morning: number;
    day: number;
    night: number;
  };
  duration: number;
  brandInfo: BrandInfo | undefined;
};

export type PrescribedMedStoreType = {
  medList: PrescribedMedType[];
  addMed: (med: PrescribedMedType) => void;
  removeMed: (med: PrescribedMedType) => void;
  reset: () => void;
};

export type APICreatePrescriptionSchema = {
  symptoms: string[];
  diagnosis: string[];
  advices: string[];
  medicines: {
    medicineID: number;
    dosage: "before" | "after";
    when: string;
    duration: number;
  }[];
  followUpDate?: Date | null | undefined;
  otherNotes?: string[] | undefined;
};

export type DoctorPortion = {
  DoctorInfo: {
    id: number;
    name: string;
    email: string;
    image: string;

    phone: string;
    degrees: string[];
  };
  Specialization: {
    id: number;
    name: string;
  };
};
export type PatientPortion = {
  id: number;
  name: string;
  email: string;
  image: string;

  phone: string;
  gendar: string;
  age: number;
  bloodGroup: string;
  height: {
    feet: number;
    inches: number;
  };
  weight: number;
};

export type AppointmentPortion = {
  id: number;
  type: string;
  time: Date;
  status: AppointmentStatus;
};

export enum AppointmentType {
  ONLINE = "online",
  PHYSICAL = "physical",
}
export interface Patient_or_Doctor_Info {
  id: number;
  name: string;
  email: string;
}

export type OlderAppointmentOverviewInfo = {
  id: number;
  type: AppointmentType;
  patientInfo: Patient_or_Doctor_Info | null;
  doctorInfo: Patient_or_Doctor_Info | null;
  startTime: Date;
  endTime: Date;
};

export type GETPrescriptionHeaderResponse = {
  DoctorPortionInfo: DoctorPortion;
  PatientPortionInfo: PatientPortion;
  AppointmentPortionInfo: AppointmentPortion;
  OldAppointments: OlderAppointmentOverviewInfo[];
  SharedAppointments: OlderAppointmentOverviewInfo[];
};


export type POSTCreatePrescriptionBody = {
  symptoms: string[];
  diagnosis: string[];
  advices: string[];
  medicines: {
      medicineID: number;
      dosage: string;
      when: string;
      duration: number;
  }[];
  meetAfter?: number | undefined;
  otherNotes?: string[] | undefined;
  past_history?: string[] | undefined;
}

export interface PrescriptionAttributes {
  id: number;
  symptoms: string[];
  diagnosis: string[];
  advices: string[];
  followUpDate: Date;
  meetAfter: number;
  otherNotes: string[];
  past_history: string[];
}

export interface GETPrescriptionResponse
{
  Header: GETPrescriptionHeaderResponse;
  Medicines?: PrescriptionBrandInfo[];
  id?: number;
  symptoms?: string[];
  diagnosis?: string[];
  advices?: string[];
  followUpDate?: Date;
  meetAfter?: number;
  otherNotes?: string[];
  past_history?: string[];
  test?: string[],
  downloadLink?: string,
}

export interface PrescriptionBrandInfo {
  Brand: {
    id: number;
    name: string;
    strength: string;
  };
  DosageForm: DosageFormAttributes;
  Generic: GenericAttributes;
  Manufacturer: ManufacturerAttributes;

  dosage: string;
  when: string;
  duration: number;
}