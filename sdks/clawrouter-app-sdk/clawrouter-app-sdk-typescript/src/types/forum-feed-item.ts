import type { ForumAuthor } from './forum-author';

/** Forum feed item schema exposed by Claw Router. */
export interface ForumFeedItem {
  /** Author field on forum feed item. */
  author: ForumAuthor;
  /** Category id field on forum feed item. */
  categoryId: number;
  /** Comment count field on forum feed item. */
  commentCount: number;
  /** Content field on forum feed item. */
  content: string;
  /** Content type field on forum feed item. */
  contentType: 'feeds';
  /** Cover image field on forum feed item. */
  coverImage: string;
  /** Created at field on forum feed item. */
  createdAt: string;
  /** Id field on forum feed item. */
  id: number;
  /** Is collected field on forum feed item. */
  isCollected: boolean;
  /** Is hot field on forum feed item. */
  isHot: boolean;
  /** Is liked field on forum feed item. */
  isLiked: boolean;
  /** Is recommended field on forum feed item. */
  isRecommended: boolean;
  /** Is top field on forum feed item. */
  isTop: boolean;
  /** Like count field on forum feed item. */
  likeCount: number;
  /** Share count field on forum feed item. */
  shareCount: number;
  /** Summary field on forum feed item. */
  summary: string;
  /** Tags field on forum feed item. */
  tags: string[];
  /** Title field on forum feed item. */
  title: string;
  /** Updated at field on forum feed item. */
  updatedAt: string;
  /** View count field on forum feed item. */
  viewCount: number;
}
