import { BrandInfo } from "./Brand";


export interface Generic {
    id: number;
    name: string;
    description: string;
    type: string;
    availableBrands: BrandInfo[];
}

