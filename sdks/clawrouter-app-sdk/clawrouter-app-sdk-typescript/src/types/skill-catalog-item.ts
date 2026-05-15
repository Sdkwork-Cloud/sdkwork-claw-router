import type { SkillPackageItem } from './skill-package-item';

/** Skill catalog item schema exposed by Claw Router. */
export interface SkillCatalogItem {
  /** Category field on skill catalog item. */
  category: string;
  /** Clawhub image field on skill catalog item. */
  clawhubImage: string;
  /** Description field on skill catalog item. */
  description: string;
  /** Developer field on skill catalog item. */
  developer: string;
  /** Downloads field on skill catalog item. */
  downloads: string;
  /** Features field on skill catalog item. */
  features: string[];
  /** Frameworks field on skill catalog item. */
  frameworks: string[];
  /** Id field on skill catalog item. */
  id: string;
  /** Image field on skill catalog item. */
  image: string;
  /** Last updated field on skill catalog item. */
  lastUpdated: string;
  /** License field on skill catalog item. */
  license: string;
  /** Name field on skill catalog item. */
  name: string;
  /** Packages field on skill catalog item. */
  packages?: SkillPackageItem[];
  /** Rating field on skill catalog item. */
  rating: number;
  /** Screenshots field on skill catalog item. */
  screenshots: string[];
  /** Size field on skill catalog item. */
  size: string;
  /** Version field on skill catalog item. */
  version: string;
}
