// export interface Brand {
//   id: number;
//   name: string;
//   strength: string;
//   generic: string;
//   manufacturer: string;
//   dosage: {
//     type: string;
//     icon: string;
//   };
// }
export interface BrandInfo {
  Brand: {
    id: number;
    name: string;
    strength: string;
  };
  DosageForm: DosageFormAttributes;
  Generic: GenericAttributes;
  Manufacturer: ManufacturerAttributes;
  type? : "BrandInfo"
}

export interface AllGenericInfo {
  Generic: GenericAttributes;
  availableBrands: number;
  type?: "AllGenericInfo"
}

//TODO: ask dhrubo for a discriminator or type flag to be added to proper check 

export function isBrandInfoList(object: any): object is BrandInfo[] {
  console.log(object);
  return (
    Array.isArray(object) &&
    object.every((item) => {
      return item.Brand && item.DosageForm && item.Generic && item.Manufacturer;
    })
  );
}

export function isAllGenericInfoList(object:any) : object is AllGenericInfo[] {
  return (
    Array.isArray(object) && object.every(item => {
      return item.Generic && item.availableBrands;
    })
  )
}


export interface SingleGenericInfo {
  Generic: GenericAttributes;
  availableBrands: BrandInfo[];
}

export interface DosageFormAttributes {
  id: number;
  name: string;
  img_url: string;
}

export interface GenericAttributes {
  id: number;
  name: string;
  type: string;
}

export interface ManufacturerAttributes {
  id: number;
  name: string;
}

export interface BrandDescription extends BrandInfo {
  Description: DescriptionAttributes;
}

export interface DescriptionAttributes {
  id: number;
  unit_price: string;
  indications: string;
  compositions: string;
  pharmacology: string;
  dosage_and_administration: string;
  interaction: string;
  contraindications: string;
  side_effects: string;
  pregnancy_and_lactation: string;
  precautions_and_warnings: string;
  overdose_effects: string;
  therapeutic_class: string;
  storage_conditions: string;
}
