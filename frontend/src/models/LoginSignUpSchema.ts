export type UserRoles = "patient" | "doctor";

export enum ProfileStatus {
  FULLY_REGISTERED = "fully_registered",
  PARTIALLY_REGISTERED = "partially_registered",
}

export type LoginSignupToken = {
  token: string;
  profile_status: ProfileStatus;
  role: UserRoles;
};
