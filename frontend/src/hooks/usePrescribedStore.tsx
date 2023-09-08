import { PrescribedMedStoreType, PrescribedMedType } from '@/models/Prescriptions';
import { create } from 'zustand';

const usePrescribedStore = create<PrescribedMedStoreType>((set) => ({
    medList : [],
    addMed : (med: PrescribedMedType) => set((state) => ({medList: [...state.medList, med]})),
    removeMed: (med: PrescribedMedType) => set((state) => ({medList: state.medList.filter(item => med !== item)}))
}))

export default usePrescribedStore;