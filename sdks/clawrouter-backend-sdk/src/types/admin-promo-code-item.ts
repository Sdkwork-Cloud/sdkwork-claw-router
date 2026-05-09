export interface AdminPromoCodeItem {
  batchId: string;
  code: string;
  id: string;
  status: 'available' | 'claimed' | 'used' | 'voided';
  usedAt?: string;
  usedBy?: string;
}
