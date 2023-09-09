import { BrandInfo } from "./Brand"

export type PrescribedMedType = {
    name: string,
    when: 'before' | 'after',
    dosage: {
        morning : number,
        day : number,
        night : number,
    },
    duration: number,
    brandInfo: BrandInfo | undefined,
}

export type PrescribedMedStoreType = {
    medList : PrescribedMedType[],
    addMed: (med: PrescribedMedType) => void,
    removeMed: (med: PrescribedMedType) => void,
    reset: () => void,
}

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
}