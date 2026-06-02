import type { MediaResource } from './media-resource';

/** Forum community link schema exposed by Claw Router. */
export interface ForumCommunityLink {
  /** Id field on forum community link. */
  id: string;
  /** Label field on forum community link. */
  label: string;
  /** Qr code field on forum community link. */
  qrCode?: MediaResource;
  /** Tone field on forum community link. */
  tone: 'green' | 'blue' | 'teal' | 'red' | 'pink';
  /** Url field on forum community link. */
  url: string;
}
