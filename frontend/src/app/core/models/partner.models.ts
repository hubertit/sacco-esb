export interface Partner {
  id: string;
  partnerCode: string;
  partnerName: string;
  contactInfo: string | null;
  notes: string | null;
  createdAt: string;
  index?: number; // Optional index for table display
}

export interface PartnerApiResponse {
  result: Partner[];
  message: string | null;
  messageNumber: number;
  duration: number;
  elements: number;
  warning: string | null;
}

export interface SinglePartnerApiResponse {
  result: Partner;
  message: string | null;
  messageNumber: number;
  duration: number;
  elements: number;
  warning: string | null;
}
