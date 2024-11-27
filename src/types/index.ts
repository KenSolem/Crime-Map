export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  reports: Report[];
}

export type CrimeType =
  | 'ROBBERY'
  | 'DOMESTIC_VIOLENCE'
  | 'FIGHT'
  | 'HOMICIDE'
  | 'SEXUAL_ABUSE'
  | 'THREATS'
  | 'THEFT'
  | 'DRUGS'
  | 'ALCOHOL'
  | 'NOISE'
  | 'OTHER';

export interface Report {
  id: string;
  title: string;
  crimeType: CrimeType;
  description: string;
  address: string;
  phone: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'ACTIVE' | 'CLOSED';
  createdAt: Date;
  createdBy: string;
  closedAt?: Date;
  closedBy?: string;
  closureReport?: string;
}