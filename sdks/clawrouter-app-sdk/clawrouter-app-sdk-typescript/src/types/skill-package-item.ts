/** Skill package item schema exposed by Claw Router. */
export interface SkillPackageItem {
  /** Artifact ref field on skill package item. */
  artifactRef: string;
  /** Artifact size bytes field on skill package item. */
  artifactSizeBytes: number;
  /** Frameworks field on skill package item. */
  frameworks: string[];
  /** Id field on skill package item. */
  id: string;
  /** License name field on skill package item. */
  licenseName: string;
  /** Published at field on skill package item. */
  publishedAt: string;
  /** Version field on skill package item. */
  version: string;
}
