/** Usage log item schema exposed by Claw Router. */
export interface UsageLogItem {
  /** Base input price field on usage log item. */
  baseInputPrice: string;
  /** Base output price field on usage log item. */
  baseOutputPrice: string;
  /** Cache read price field on usage log item. */
  cacheReadPrice: string;
  /** Cache read tokens field on usage log item. */
  cacheReadTokens: number;
  /** Cost field on usage log item. */
  cost: string;
  /** Group field on usage log item. */
  group: string;
  /** Id field on usage log item. */
  id: string;
  /** Input tokens field on usage log item. */
  inputTokens: number;
  /** Ip field on usage log item. */
  ip: string;
  /** Is stream field on usage log item. */
  isStream: boolean;
  /** Model field on usage log item. */
  model: string;
  /** Multiplier field on usage log item. */
  multiplier: string;
  /** Output tokens field on usage log item. */
  outputTokens: number;
  /** Path field on usage log item. */
  path: string;
  /** Reasoning effort field on usage log item. */
  reasoningEffort: string;
  /** Request id field on usage log item. */
  requestId: string;
  /** Time field on usage log item. */
  time: string;
  /** Token name field on usage log item. */
  tokenName: string;
  /** Total time field on usage log item. */
  totalTime: string;
  /** Ttft field on usage log item. */
  ttft: string;
  /** Type field on usage log item. */
  type: string;
}
