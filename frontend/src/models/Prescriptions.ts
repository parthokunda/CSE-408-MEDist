
export type PrescribedMedType = {
    name: string,
    when: 'before' | 'after',
    dosage: {
        morning : number,
        day : number,
        night : number,
    },
    duration: number,
}

export type PrescribedMedStoreType = {
    medList : PrescribedMedType[],
    addMed: (med: PrescribedMedType) => void,
    removeMed: (med: PrescribedMedType) => void,
}