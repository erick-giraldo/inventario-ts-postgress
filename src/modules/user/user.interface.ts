import { ObjectId } from 'mongodb';
import { UserType } from './user-type.enum';

export interface IUser {
  id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  username?: string;
  fullName?: string;
  emailAddress: string;
  twoFaSeed?: string | null | undefined;
  isEmailAddressVerified?: boolean | undefined;
  password: string;
  isActive?: boolean | undefined;
  userType?: UserType;
  profiles: (Profile | null)[];
}

export interface Profile {
  id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
  description?: string;
  shortName?: string;
  type?: string;
  roles: (Role | null)[];
}

export interface Role {
  id?: ObjectId;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
  name: string;
  type: string;
}
