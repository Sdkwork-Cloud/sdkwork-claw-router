import type { AccountConsumptionItem } from './account-consumption-item';
import type { AccountInvoiceSettings } from './account-invoice-settings';
import type { AccountLoginLog } from './account-login-log';
import type { AccountSecuritySummary } from './account-security-summary';

export interface AccountSummaryResponse {
  availableCredits: number;
  consumptionByService: AccountConsumptionItem[];
  /** Authenticated user's account email address. */
  email: string;
  estDaysRemaining: number;
  id: string;
  invoiceSettings: AccountInvoiceSettings;
  isVerified: boolean;
  loginLogs: AccountLoginLog[];
  monthlyConsumption: number;
  name: string;
  organization: string;
  security: AccountSecuritySummary;
  tier: string;
}
