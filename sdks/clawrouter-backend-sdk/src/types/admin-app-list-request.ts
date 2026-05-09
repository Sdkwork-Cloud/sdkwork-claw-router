export interface AdminAppListRequest {
  appType?: string;
  keyword?: string;
  marketStatus?: 'DRAFT' | 'PUBLISHED' | 'OFFLINE';
  pageNo?: number;
  pageSize?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}
