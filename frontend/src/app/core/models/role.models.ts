export type RoleType = 'APPLICATION' | 'ADMINISTRATOR';

export interface Role {
  id: string;
  version: number;
  entityState: 'ACTIVE' | 'INACTIVE';
  name: string;
  roleType: RoleType;
  index?: number; // Optional index for table display
}

export interface RoleApiResponse {
  result: Role[];
  message: string | null;
  messageNumber: number;
  duration: number;
  elements: number;
  warning: string | null;
}

export interface SingleRoleApiResponse {
  result: Role;
  message: string | null;
  messageNumber: number;
  duration: number;
  elements: number;
  warning: string | null;
}
