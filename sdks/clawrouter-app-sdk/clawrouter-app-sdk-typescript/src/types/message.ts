/** Message schema exposed by Claw Router. */
export interface Message {
  /** Content field on message. */
  content: string;
  /** User-facing short notification summary. */
  desc: string;
  /** Id field on message. */
  id: string;
  /** Read field on message. */
  read: boolean;
  /** Time field on message. */
  time: string;
  /** Title field on message. */
  title: string;
  /** Type field on message. */
  type: 'info' | 'billing' | 'warning' | 'alert';
}
