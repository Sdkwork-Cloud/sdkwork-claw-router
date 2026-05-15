/** Account invoice settings schema exposed by Claw Router. */
export interface AccountInvoiceSettings {
  /** Invoice type field on account invoice settings. */
  invoiceType: string;
  /** Org full field on account invoice settings. */
  orgFull: string;
  /** Safe invoice payment method display label without raw bank account number. */
  paymentMethod: string;
  /** Tax id field on account invoice settings. */
  taxId: string;
}
