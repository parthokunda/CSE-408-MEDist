import { BrandDescription } from "@/models/Brand";


export interface Generic {
    id: number;
    name: string;
    indications: string;
    pharmacology: string;
    dosageAdministration: string;
    interaction: string;
    contraindiction: string;
    sideEffects: string;
    overDoseEffect: string;
    storageCondition: string;
    availableBrands: BrandDescription[];
}

