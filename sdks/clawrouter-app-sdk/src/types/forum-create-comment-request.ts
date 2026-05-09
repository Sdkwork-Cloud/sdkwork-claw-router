export interface ForumCreateCommentRequest {
  content: string;
  contentId: number;
  contentType: 'feeds' | 'comments' | 'FEEDS' | 'COMMENTS';
  deviceInfo?: string;
  ipAddress?: string;
  parentId?: number;
}
