export interface TransactionDashboardResponse {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  totalAmount: number;
  period: string;
}

export interface TransactionLogsView {
  transactionId: string;
  transactionType: string;
  amount: number;
  status: string;
  timestamp: string;
  entityName: string;
  provider: string;
  reference: string;
}

export interface TransactionLogsRequest {
  startDate: string;
  endDate: string;
  entityId?: string;
  status?: string;
  transactionType?: string;
  page?: number;
  size?: number;
}

export interface PullTransactionLogs {
  transactionId: string;
  entityId: string;
  amount: number;
  status: string;
  timestamp: string;
  reference: string;
  accountNumber: string;
  accountName: string;
}

export interface PushTransactionLogs {
  transactionId: string;
  entityId: string;
  amount: number;
  status: string;
  timestamp: string;
  reference: string;
  recipientAccount: string;
  recipientName: string;
}

export interface InternalTransactionLogs {
  transactionId: string;
  entityId: string;
  amount: number;
  status: string;
  timestamp: string;
  reference: string;
  description: string;
  transactionType: string;
}
