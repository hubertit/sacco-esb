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

// Integration Logs Models
export interface IntegrationLogData {
  id: string;
  receivedAt: string;
  partner: PartnerInfo;
  direction: 'IN' | 'OUT' | 'INTERNAL';
  correlationId: string;
  messageType: 'SEND_ONLY' | 'SEND_AND_RECEIVE';
  status: 'COMPLETED' | 'TIMEOUT' | 'FAILED' | 'PENDING' | 'PROCESSING';
  responseCode: number;
  processedAt: string | null;
  payloadFormat: 'JSON' | 'XML' | 'TEXT';
  payloadJson: string;
  description: string;
  sensitive: boolean;
  payloadSize: number;
  extra: string;
}

export interface PartnerInfo {
  id: string;
  partnerCode: string;
  partnerName: string;
  contactInfo: string | null;
  notes: string | null;
  createdAt: string;
}

export interface IntegrationLogFilterRequest {
  page?: number;
  size?: number;
  from?: string;
  to?: string;
}

export interface IntegrationLogApiResponse {
  content: IntegrationLogData[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
