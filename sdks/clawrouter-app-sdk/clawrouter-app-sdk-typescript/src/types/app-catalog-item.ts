import type { AppReleaseItem } from './app-release-item';
import type { MediaResource } from './media-resource';

/** App catalog item schema exposed by Claw Router. */
export interface AppCatalogItem {
  /** Category field on app catalog item. */
  category: string;
  /** Description field on app catalog item. */
  description: string;
  /** Developer field on app catalog item. */
  developer: string;
  /** Downloads field on app catalog item. */
  downloads: string;
  /** Features field on app catalog item. */
  features: string[];
  /** Stable application identity from plus_app.config.standard.appKey when present; falls back to plus_app.id only when appKey is absent. */
  id: string;
  /** Image field on app catalog item. */
  image: MediaResource;
  /** Name field on app catalog item. */
  name: string;
  /** Rating field on app catalog item. */
  rating: number;
  /** Releases field on app catalog item. */
  releases: AppReleaseItem[];
  /** Screenshots field on app catalog item. */
  screenshots: MediaResource[];
}
