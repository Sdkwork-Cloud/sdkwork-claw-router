import type { ForumAuthor } from './forum-author';
import type { ForumCommentItem } from './forum-comment-item';

export interface ForumCommentDetail {
  author: ForumAuthor;
  commentId: string;
  content: string;
  contentId: number;
  contentType: 'FEEDS' | 'COMMENTS';
  createdAt: string;
  deviceInfo: string;
  ipAddress: string;
  isTop: boolean;
  likes: number;
  parentId?: number;
  replies: ForumCommentItem[];
  replyCount: number;
  status: 'PUBLISHED' | 'PENDING' | 'DELETED';
  updatedAt: string;
  userId: number;
}
