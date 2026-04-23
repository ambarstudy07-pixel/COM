export interface StockRecord {
  Date: string;
  AgencyName: string;
  DomesticClosingStock: number; // 14.2 KG
  DomesticBacklog: number; // 14.2 KG
  CommercialClosingStock: number; // 19 KG
  IndustrialClosingStock47_5: number; // 47.5 KG
  IndustrialClosingStock425: number; // 425 KG
}

export interface CrisisRecord {
  RequestID: string;
  ConsumerName: string;
  Category: string; // e.g., Commercial, Domestic, Health
  AgencyName: string;
  Issue: string; // e.g., Shortage, Complaint, Querry
  CurrentStatus: string; // e.g., Resolved, In-Progress, Pending
}

export interface StockSummary {
  totalDomesticStock: number;
  totalCommercialStock: number;
  totalIndustrialStock: number;
  totalDomesticBacklog: number;
}

export interface CrisisSummary {
  totalIssues: number;
  totalResolved: number;
  totalPending: number;
  resolutionRate: number;
}
