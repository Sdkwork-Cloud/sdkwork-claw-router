export interface ForumCreateFeedRequest {
  categoryId?: number;
  content: string;
  images?: string[];
  source?: string;
  sourceUrl?: string;
  summary?: string;
  tags?: string[];
  title?: string;
}
