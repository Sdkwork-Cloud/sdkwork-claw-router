/** Admin app category create request schema exposed by Claw Router. */
export interface AdminAppCategoryCreateRequest {
  /** Optional stable category code. */
  code?: string;
  /** Optional category description. */
  description?: string;
  /** Optional icon URL or asset path. */
  icon?: string;
  /** App store category display name. */
  name: string;
  /** Parent id field on admin app category create request. */
  parentId?: string | null;
  /** Path field on admin app category create request. */
  path?: string;
  /** Sort weight field on admin app category create request. */
  sortWeight?: number;
  /** Status field on admin app category create request. */
  status?: number;
  /** Visible field on admin app category create request. */
  visible?: boolean;
}
