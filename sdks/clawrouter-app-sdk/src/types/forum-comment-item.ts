import type { ForumAuthor } from './forum-author';

export interface ForumCommentItem {
  author: ForumAuthor;
  commentId: string;
  content: string;
  contentId: number;
  contentType: 'FEEDS' | 'COMMENTS';
  createdAt: string;
  isTop: boolean;
  likes: number;
  parentId?: number;
  replyCount: number;
  status: 'PUBLISHED' | 'PENDING' | 'DELETED';
  userId: number;
}
