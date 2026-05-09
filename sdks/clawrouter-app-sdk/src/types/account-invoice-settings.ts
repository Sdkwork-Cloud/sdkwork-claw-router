export interface AccountInvoiceSettings {
  invoiceType: string;
  orgFull: string;
  /** Safe invoice payment method display label without raw bank account number. */
  paymentMethod: string;
  taxId: string;
}
