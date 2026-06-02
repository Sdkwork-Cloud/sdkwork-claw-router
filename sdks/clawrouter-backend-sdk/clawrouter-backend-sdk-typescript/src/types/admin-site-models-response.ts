import type { AdminSiteModelItem } from './admin-site-model-item';

/** Admin site models response schema exposed by Claw Router. */
export interface AdminSiteModelsResponse {
  /** Items field on admin site models response. */
  items: AdminSiteModelItem[];
}
