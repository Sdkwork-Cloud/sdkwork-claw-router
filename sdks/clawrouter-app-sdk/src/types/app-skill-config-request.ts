/** Skill runtime configuration request. config.portal is reserved portal metadata and must not be provided by clients. */
export interface AppSkillConfigRequest {
  /** Optional config wrapper. When omitted, the whole request object is treated as skill config. config.portal is reserved portal metadata and must not be provided by clients. */
  config?: Record<string, unknown>;
}
