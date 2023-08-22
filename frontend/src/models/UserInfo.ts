
export enum UserStatus {
  FULLY_REGISTERED = "fully_registered",
  PARTIALLY_REGISTERED = "partially_registered",
}

export enum UserGender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export enum UserBloodGroup {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  NOT_KNOWN = "not_known",
};

export interface PatientAttributes {
  id: number;
  status: UserStatus;
  //userID: number;

  // additional info
  email: string;
  image: string;
  name: string;
  phone: string;
  gendar: UserGender;
  dob: Date;
  address: string;
  bloodGroup: UserBloodGroup;
  height: number;
  weight: number;
};
