import type { SettlementBillBreakdown } from './settlement-bill-breakdown';

export interface SettlementBill {
  breakdown: SettlementBillBreakdown;
  endDate: string;
  id: string;
  period: string;
  startDate: string;
  status: string;
  totalCost: string;
  totalTokens: string;
}
