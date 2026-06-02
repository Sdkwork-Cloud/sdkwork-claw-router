import type { AdminSiteModelCreateRequest } from './admin-site-model-create-request';

/** Admin site models replace request schema exposed by Claw Router. */
export interface AdminSiteModelsReplaceRequest {
  /** Items field on admin site models replace request. */
  items: AdminSiteModelCreateRequest[];
}
