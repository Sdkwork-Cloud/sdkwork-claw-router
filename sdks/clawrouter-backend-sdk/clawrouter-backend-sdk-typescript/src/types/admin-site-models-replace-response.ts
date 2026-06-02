import type { AdminSiteModelItem } from './admin-site-model-item';

/** Admin site models replace response schema exposed by Claw Router. */
export interface AdminSiteModelsReplaceResponse {
  /** Items field on admin site models replace response. */
  items: AdminSiteModelItem[];
}
