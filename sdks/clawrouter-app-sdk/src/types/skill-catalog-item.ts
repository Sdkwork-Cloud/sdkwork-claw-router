import type { SkillPackageItem } from './skill-package-item';

export interface SkillCatalogItem {
  category: string;
  clawhubImage: string;
  description: string;
  developer: string;
  downloads: string;
  features: string[];
  frameworks: string[];
  id: string;
  image: string;
  lastUpdated: string;
  license: string;
  name: string;
  packages?: SkillPackageItem[];
  rating: number;
  screenshots: string[];
  size: string;
  version: string;
}
