import type { ForumAuthor } from './forum-author';
import type { MediaResource } from './media-resource';

/** Forum feed item schema exposed by Claw Router. */
export interface ForumFeedItem {
  /** Author field on forum feed item. */
  author: ForumAuthor;
  /** Category id field on forum feed item. */
  categoryId: string;
  /** Comment count field on forum feed item. */
  commentCount: string;
  /** Content field on forum feed item. */
  content: string;
  /** Content type field on forum feed item. */
  contentType: 'feeds';
  /** Cover field on forum feed item. */
  cover: MediaResource;
  /** Created at field on forum feed item. */
  createdAt: string;
  /** Id field on forum feed item. */
  id: string;
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
  likeCount: string;
  /** Share count field on forum feed item. */
  shareCount: string;
  /** Summary field on forum feed item. */
  summary: string;
  /** Tags field on forum feed item. */
  tags: string[];
  /** Title field on forum feed item. */
  title: string;
  /** Updated at field on forum feed item. */
  updatedAt: string;
  /** View count field on forum feed item. */
  viewCount: string;
}
