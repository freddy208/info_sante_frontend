import { UserStatus, Gender } from "./enums";

export type User = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  avatar: string | null;
  dateOfBirth: Date | null;
  gender: Gender | null;
  city: string | null;
  region: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  status: UserStatus;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
  createdAt: Date;
  updatedAt: Date;
};