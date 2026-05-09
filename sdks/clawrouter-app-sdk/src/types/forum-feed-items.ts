import type { ForumFeedItem } from './forum-feed-item';

export interface ForumFeedItems {
  content: ForumFeedItem[];
  items: ForumFeedItem[];
  totalElements: number;
}
