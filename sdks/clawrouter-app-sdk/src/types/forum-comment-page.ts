import type { ForumCommentItem } from './forum-comment-item';

export interface ForumCommentPage {
  content: ForumCommentItem[];
  items: ForumCommentItem[];
  page: number;
  size: number;
  totalElements: number;
}
