import type { ForumAuthor } from './forum-author';

/** Forum comment item schema exposed by Claw Router. */
export interface ForumCommentItem {
  /** Author field on forum comment item. */
  author: ForumAuthor;
  /** Comment id field on forum comment item. */
  commentId: string;
  /** Content field on forum comment item. */
  content: string;
  /** Content id field on forum comment item. */
  contentId: string;
  /** Content type field on forum comment item. */
  contentType: 'FEEDS' | 'COMMENTS' | 'COURSE';
  /** Created at field on forum comment item. */
  createdAt: string;
  /** Is top field on forum comment item. */
  isTop: boolean;
  /** Likes field on forum comment item. */
  likes: string;
  /** Parent id field on forum comment item. */
  parentId?: string;
  /** Reply count field on forum comment item. */
  replyCount: string;
  /** Status field on forum comment item. */
  status: 'PUBLISHED' | 'PENDING' | 'DELETED';
  /** User id field on forum comment item. */
  userId: string;
}
