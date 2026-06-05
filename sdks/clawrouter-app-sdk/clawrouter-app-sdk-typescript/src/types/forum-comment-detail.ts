import type { ForumAuthor } from './forum-author';
import type { ForumCommentItem } from './forum-comment-item';

/** Forum comment detail schema exposed by Claw Router. */
export interface ForumCommentDetail {
  /** Author field on forum comment detail. */
  author: ForumAuthor;
  /** Comment id field on forum comment detail. */
  commentId: string;
  /** Content field on forum comment detail. */
  content: string;
  /** Content id field on forum comment detail. */
  contentId: string;
  /** Content type field on forum comment detail. */
  contentType: 'FEEDS' | 'COMMENTS' | 'COURSE';
  /** Created at field on forum comment detail. */
  createdAt: string;
  /** Device info field on forum comment detail. */
  deviceInfo: string;
  /** Ip address field on forum comment detail. */
  ipAddress: string;
  /** Is top field on forum comment detail. */
  isTop: boolean;
  /** Likes field on forum comment detail. */
  likes: string;
  /** Parent id field on forum comment detail. */
  parentId?: string;
  /** Replies field on forum comment detail. */
  replies: ForumCommentItem[];
  /** Reply count field on forum comment detail. */
  replyCount: string;
  /** Status field on forum comment detail. */
  status: 'PUBLISHED' | 'PENDING' | 'DELETED';
  /** Updated at field on forum comment detail. */
  updatedAt: string;
  /** User id field on forum comment detail. */
  userId: string;
}
