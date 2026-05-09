export interface Message {
  content: string;
  /** User-facing short notification summary. */
  desc: string;
  id: string;
  read: boolean;
  time: string;
  title: string;
  type: 'info' | 'billing' | 'warning' | 'alert';
}
