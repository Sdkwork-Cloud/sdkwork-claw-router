export interface AdminModelVendorCreateRequest {
  /** Safe style token used by the admin console. */
  color?: string;
  /** Vendor description shown in the admin console. */
  description?: string;
  /** Human-readable vendor display name. */
  name: string;
  status?: 'active' | 'inactive';
  /** Optional normalized vendor code; generated from name when omitted. */
  vendorCode?: string;
}
