import type { AppReleaseItem } from './app-release-item';

/** App detail response schema exposed by Claw Router. */
export interface AppDetailResponse {
  /** Category field on app detail response. */
  category: string;
  /** Description field on app detail response. */
  description: string;
  /** Developer field on app detail response. */
  developer: string;
  /** Downloads field on app detail response. */
  downloads: string;
  /** Features field on app detail response. */
  features: string[];
  /** Stable application identity from plus_app.config.standard.appKey when present; falls back to plus_app.id only when appKey is absent. */
  id: string;
  /** Image field on app detail response. */
  image: string;
  /** Name field on app detail response. */
  name: string;
  /** Rating field on app detail response. */
  rating: number;
  /** Releases field on app detail response. */
  releases: AppReleaseItem[];
  /** Screenshots field on app detail response. */
  screenshots: string[];
}
