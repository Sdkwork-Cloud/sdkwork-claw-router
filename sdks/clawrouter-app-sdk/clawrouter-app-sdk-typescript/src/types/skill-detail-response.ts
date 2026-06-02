import type { MediaResource } from './media-resource';
import type { SkillPackageItem } from './skill-package-item';

/** Skill detail response schema exposed by Claw Router. */
export interface SkillDetailResponse {
  /** Category field on skill detail response. */
  category: string;
  /** Clawhub image field on skill detail response. */
  clawhubImage: string;
  /** Description field on skill detail response. */
  description: string;
  /** Developer field on skill detail response. */
  developer: string;
  /** Downloads field on skill detail response. */
  downloads: string;
  /** Features field on skill detail response. */
  features: string[];
  /** Frameworks field on skill detail response. */
  frameworks: string[];
  /** Id field on skill detail response. */
  id: string;
  /** Image field on skill detail response. */
  image: MediaResource;
  /** Last updated field on skill detail response. */
  lastUpdated: string;
  /** License field on skill detail response. */
  license: string;
  /** Name field on skill detail response. */
  name: string;
  /** Packages field on skill detail response. */
  packages?: SkillPackageItem[];
  /** Rating field on skill detail response. */
  rating: number;
  /** Screenshots field on skill detail response. */
  screenshots: MediaResource[];
  /** Size field on skill detail response. */
  size: string;
  /** Version field on skill detail response. */
  version: string;
}
