import type { MediaResource } from './media-resource';

/** App release item schema exposed by Claw Router. */
export interface AppReleaseItem {
  /** Artifact field on app release item. */
  artifact: MediaResource;
  /** Id field on app release item. */
  id: string;
  /** Os field on app release item. */
  os: 'Windows' | 'macOS' | 'Linux' | 'iOS' | 'Android' | 'HarmonyOS' | 'PC Web' | 'Mobile Web' | 'WeChat' | 'Alipay' | 'ByteDance' | 'Baidu' | 'QuickApp';
  /** Platform type field on app release item. */
  platformType: 'Desktop' | 'Mobile' | 'Web' | 'Mini Program';
  /** Release date field on app release item. */
  releaseDate: string;
  /** Size field on app release item. */
  size: string;
  /** Version field on app release item. */
  version: string;
  /** Whats new field on app release item. */
  whatsNew?: string;
}
