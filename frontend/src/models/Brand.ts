export interface Brand {
  id: number;
  name: string;
  strength: string;
  generic: string;
  manufacturer: string;
  dosage: {
    type: string;
    icon: string;
  };
}
