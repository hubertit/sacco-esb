export interface LogData {
  id: string;
  year: number;
  districtCode: string;
  branchCode: string;
  branchName: string;
  provider: string;
  logStatus: 'SUCCESS' | 'FAILED' | 'PENDING' | 'PROCESSING';
  dateTime: string;
  amount: number;
  referenceNumber: string;
  status: string;
  message: string;
  externalRefNumber: string;
  channel: string;
  sessionId: string;
  sourceWallet: string;
  walletNames: string;
  targetAccountNumber: string;
  targetAccountName: string;
  branchAccount: string | null;
}

export interface LogFilterRequest {
  msisdn?: string;
  targetWallet?: string;
  sourceAccountNumber?: string;
  startDate?: string;
  endDate?: string;
  table?: string;
  pageNumber?: string;
  pageSize?: string;
  referenceNumber?: string;
}

export interface LogApiResponse {
  data: LogData[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
