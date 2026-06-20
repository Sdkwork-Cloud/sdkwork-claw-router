/** Forum create comment request schema exposed by Claw Router. */
export interface ForumCreateCommentRequest {
  /** Content field on forum create comment request. */
  content: string;
  /** Content id field on forum create comment request. */
  contentId: string;
  /** Content type field on forum create comment request. */
  contentType: 'feeds' | 'comments' | 'FEEDS' | 'COMMENTS';
  /** Device info field on forum create comment request. */
  deviceInfo?: string;
}
