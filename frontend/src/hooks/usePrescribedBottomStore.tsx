import { create } from 'zustand';

type PrescribedBottomStoreType = {
    meetAfter: number,
    tests: string[],
    advices: string[],
    addTest: (test: string) => void,
    removeTest: (test: string) => void,
    addAdvice: (advice: string) => void,
    removeAdvice: (advice:string) => void,
    setMeetAfter: (day: number) => void,
}

const usePrescribeBottomStore  = create<PrescribedBottomStoreType>(set => ({
    meetAfter: 0,
    tests: [],
    advices: ["Drink Water"],
    addTest: (test) => set(state => ({...state, tests: [...state.tests, test]})),
    removeTest: (test) => set(state => ({...state, tests: state.tests.filter(item => item !== test)})),
    addAdvice: (adivce) => set(state => ({...state, advices: [...state.advices, adivce]})),
    removeAdvice: (advice) => set(state => ({...state, advices: state.advices.filter(item => item !== advice)})),
    setMeetAfter: (day: number) => set(state => ({...state, meetAfter: day})),
}))

export default usePrescribeBottomStore;