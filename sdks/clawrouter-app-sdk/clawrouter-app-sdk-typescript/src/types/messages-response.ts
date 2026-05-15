import type { Message } from './message';

/** Messages response schema exposed by Claw Router. */
export interface MessagesResponse {
  /** Items field on messages response. */
  items: Message[];
}
