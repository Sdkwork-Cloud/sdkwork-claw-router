import type { ForumAuthor } from './forum-author';

export interface ForumFeedItem {
  author: ForumAuthor;
  categoryId: number;
  commentCount: number;
  content: string;
  contentId: number;
  contentType: 'feeds';
  coverImage: string;
  createdAt: string;
  favoriteCount: number;
  id: string;
  isCollected: boolean;
  isHot: boolean;
  isLiked: boolean;
  isRecommended: boolean;
  isTop: boolean;
  likeCount: number;
  shareCount: number;
  summary: string;
  tags: string[];
  title: string;
  updatedAt: string;
  viewCount: number;
}
