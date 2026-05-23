/** Memory entry item schema exposed by Claw Router. */
export interface MemoryEntryItem {
  /** Confidence score field on memory entry item. */
  confidenceScore?: string | null;
  /** Content field on memory entry item. */
  content: string;
  /** Created at field on memory entry item. */
  createdAt: string;
  /** Id field on memory entry item. */
  id: string;
  /** Importance score field on memory entry item. */
  importanceScore?: string | null;
  /** Memory type field on memory entry item. */
  memoryType: string;
  /** Recall count field on memory entry item. */
  recallCount: number;
  /** Sensitivity level field on memory entry item. */
  sensitivityLevel: string;
  /** Source conversation id field on memory entry item. */
  sourceConversationId?: string | null;
  /** Source invocation id field on memory entry item. */
  sourceInvocationId?: string | null;
  /** Source item id field on memory entry item. */
  sourceItemId?: string | null;
  /** Source kind field on memory entry item. */
  sourceKind: string;
  /** Source turn id field on memory entry item. */
  sourceTurnId?: string | null;
  /** Space id field on memory entry item. */
  spaceId: string;
  /** Status field on memory entry item. */
  status: string;
  /** Subject key field on memory entry item. */
  subjectKey?: string | null;
  /** Subject type field on memory entry item. */
  subjectType?: string | null;
  /** Trust level field on memory entry item. */
  trustLevel: string;
  /** Updated at field on memory entry item. */
  updatedAt: string;
}
