import {
  GETPrescriptionResponse,
  PrescriptionBrandInfo,
} from "@/models/Prescriptions";
import { create } from "zustand";

type OldPrescriptionStoreType = {
  medList: PrescriptionBrandInfo[];
  diagnosis: string[];
  symptoms: string[];
  past_history: string;
  advices: string[];
  tests: string[];
  meetAfter: number;
  setAllInfo: (presInfo: GETPrescriptionResponse) => void;
};

const useOldPrescriptionStore = create<OldPrescriptionStoreType>((set) => ({
  medList: [],
  diagnosis: [],
  symptoms: [],
  past_history: "",
  advices: [],
  tests: [],
  meetAfter: 0,
  setAllInfo: (presInfo) =>
    set((state) => ({
      ...state,
      medList: presInfo.Medicines ? presInfo.Medicines : [],
      diagnosis: presInfo.diagnosis ? presInfo.diagnosis : [],
      symptoms: presInfo.symptoms ? presInfo.symptoms : [],
      advices: presInfo.advices ? presInfo.advices : [],
      meetAfter: presInfo.meetAfter ? presInfo.meetAfter : 0,
      past_history: presInfo.past_history ? presInfo.past_history[0] : '',
      tests: presInfo.test ? presInfo.test : [],
    })),
}));

export default useOldPrescriptionStore;