import {
  AppointmentPortion,
  DoctorPortion,
  GETPrescriptionHeaderResponse,
  OlderAppointmentOverviewInfo,
  PatientPortion,
} from "@/models/Prescriptions";
import { create } from "zustand";

export type PrescriptionFetchedInfoType = {
  patientInfo: PatientPortion | null;
  doctorInfo: DoctorPortion | null;
  appointmentInfo: AppointmentPortion | null;
  oldAppointments: OlderAppointmentOverviewInfo[];
  setPatientInfo: (patientInfo: PatientPortion) => void;
  setDoctorInfo: (doctorInfo: DoctorPortion) => void;
  setAppointmentInfo: (appInfo: AppointmentPortion) => void;
  setOldAppointments: (oldApps: OlderAppointmentOverviewInfo[]) => void;
  setAllInfo: (allInfo: GETPrescriptionHeaderResponse) => void;
};

const usePrescriptionFetchedInfoStore = create<PrescriptionFetchedInfoType>(
  (set) => ({
    patientInfo: null,
    doctorInfo: null,
    appointmentInfo: null,
    oldAppointments: [],
    setPatientInfo: (patInfo) =>
      set((state) => ({ ...state, patientInfo: patInfo })),
    setDoctorInfo: (docInfo) =>
      set((state) => ({ ...state, doctorInfo: docInfo })),
    setAppointmentInfo: (appInfo) =>
      set((state) => ({ ...state, appointmentInfo: appInfo })),
    setOldAppointments: (oldApps) =>
      set((state) => ({ ...state, oldAppointments: oldApps })),
    setAllInfo: (allInfo) =>
      set(() => ({
        patientInfo: allInfo.PatientPortionInfo,
        doctorInfo: allInfo.DoctorPortionInfo,
        appointmentInfo: allInfo.AppointmentPortionInfo,
        oldAppointments: allInfo.OldAppointments,
      })),
  })
);

export default usePrescriptionFetchedInfoStore;
