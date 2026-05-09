import type { AppReleaseItem } from './app-release-item';

export interface AppDetailResponse {
  category: string;
  description: string;
  developer: string;
  downloads: string;
  features: string[];
  /** Stable application identity from plus_app.config.standard.appKey when present; falls back to plus_app.id only when appKey is absent. */
  id: string;
  image: string;
  name: string;
  rating: number;
  releases: AppReleaseItem[];
  screenshots: string[];
}
