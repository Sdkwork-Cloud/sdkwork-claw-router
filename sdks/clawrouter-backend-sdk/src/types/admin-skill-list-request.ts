export interface AdminSkillListRequest {
  categoryId?: string;
  enabled?: boolean;
  keyword?: string;
  marketStatus?: 'DRAFT' | 'PUBLISHED' | 'OFFLINE' | 'DEPRECATED';
  pageNo?: number;
  pageSize?: number;
  reviewStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  visibility?: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
}
