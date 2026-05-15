/** Forum community link schema exposed by Claw Router. */
export interface ForumCommunityLink {
  /** Id field on forum community link. */
  id: string;
  /** Label field on forum community link. */
  label: string;
  /** Qr code url field on forum community link. */
  qrCodeUrl?: string;
  /** Tone field on forum community link. */
  tone: 'green' | 'blue' | 'teal' | 'red' | 'pink';
  /** Url field on forum community link. */
  url: string;
}
