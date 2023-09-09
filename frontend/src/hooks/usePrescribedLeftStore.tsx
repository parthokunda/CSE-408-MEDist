
import { create } from 'zustand';

type PrescribeLeftStoreType = {
    diagnosis: string[],
    symptoms: string[],
    pastHistory: string,
    addDiagnosis: (diagnosis: string) => void,
    removeDiagnosis: (diagnosis: string) => void,
    // addSymptoms: (symptom: string) => void,
    // removeSymptom: (symptom: string) => void,
    changeHistory: (history: string) => void,
}

const usePrescribedLeftStore = create<PrescribeLeftStoreType>(set => (
    {
        diagnosis: [],
        symptoms: [],
        pastHistory: "abcd",
        addDiagnosis : (diagnosis: string) => set(state => ({...state, diagnosis: [...state.diagnosis, diagnosis]})),
        removeDiagnosis: (diagnosis: string) => set(state => ({...state, diagnosis: state.diagnosis.filter(str => str !== diagnosis)})),
        changeHistory : (history) => set(state => ({...state, pastHistory: history})),
    }
));

export default usePrescribedLeftStore;