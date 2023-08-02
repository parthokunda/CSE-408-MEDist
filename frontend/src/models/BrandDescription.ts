export interface BrandDescription {
    id: number;
    name: string;
    strength: string;
    generic: string;
    manufacturer: string;
    dosage: {
      type: string;
      icon: string;
    };
    price: string;
    indications: string;
    pharmacology: string;
    dosageAdministration: string;
    interaction: string;
    contraindiction: string;
    sideEffects: string;
    overDoseEffect: string;
    storageCondition: string;
  }
  