export interface PageResult {
  pageNo?: number;
  pageSize?: number;
  records?: Record<string, unknown>[];
  total?: number;
}
