export interface Entity {
  entityId: string;
  entityName: string;
  entityCode: string;
  entityType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EntityDto {
  entityId?: string;
  entityName: string;
  entityCode: string;
  entityType: string;
  isActive: boolean;
}

export interface EntityContract {
  contractId: string;
  entityId: string;
  provider: string;
  userName: string;
  passCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EntityContractDto {
  contractId?: string;
  entityId: string;
  provider: string;
  userName: string;
  passCode: string;
  isActive: boolean;
}

export interface AccountHolder {
  accountHolderId: string;
  entityId: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountHolderDto {
  accountHolderId?: string;
  entityId: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  isActive: boolean;
}
