import type { MediaResource } from './media-resource';

/** Forum author schema exposed by Claw Router. */
export interface ForumAuthor {
  /** Avatar field on forum author. */
  avatar?: MediaResource;
  /** Bio field on forum author. */
  bio?: string;
  /** Id field on forum author. */
  id: string;
  /** Is following field on forum author. */
  isFollowing: boolean;
  /** Name field on forum author. */
  name: string;
}
