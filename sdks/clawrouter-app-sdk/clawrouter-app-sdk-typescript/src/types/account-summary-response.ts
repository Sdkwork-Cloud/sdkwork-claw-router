import type { AccountConsumptionItem } from './account-consumption-item';
import type { AccountInvoiceSettings } from './account-invoice-settings';
import type { AccountLoginLog } from './account-login-log';
import type { AccountSecuritySummary } from './account-security-summary';

/** Account summary response schema exposed by Claw Router. */
export interface AccountSummaryResponse {
  /** Available credits field on account summary response. */
  availableCredits: number;
  /** Consumption by service field on account summary response. */
  consumptionByService: AccountConsumptionItem[];
  /** Authenticated user's account email address. */
  email: string;
  /** Est days remaining field on account summary response. */
  estDaysRemaining: number;
  /** Id field on account summary response. */
  id: string;
  /** Invoice settings field on account summary response. */
  invoiceSettings: AccountInvoiceSettings;
  /** Is verified field on account summary response. */
  isVerified: boolean;
  /** Login logs field on account summary response. */
  loginLogs: AccountLoginLog[];
  /** Monthly consumption field on account summary response. */
  monthlyConsumption: number;
  /** Name field on account summary response. */
  name: string;
  /** Organization field on account summary response. */
  organization: string;
  /** Security field on account summary response. */
  security: AccountSecuritySummary;
  /** Tier field on account summary response. */
  tier: string;
}
