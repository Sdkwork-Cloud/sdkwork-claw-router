/** Admin model mapping resolve request schema exposed by Claw Router. */
export interface AdminModelMappingResolveRequest {
  /** Channel code field on admin model mapping resolve request. */
  channelCode?: string | null;
  /** Channel id field on admin model mapping resolve request. */
  channelId?: string | null;
  /** Source model field on admin model mapping resolve request. */
  sourceModel: string;
  /** Vendor code field on admin model mapping resolve request. */
  vendorCode?: string | null;
}
