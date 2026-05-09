import type { MappingRule } from './routingService';

const MODEL_NAME_PATTERN = /^\S{1,128}$/;
const GENERATED_RULE_ID_PATTERN = /^rule-(\d+)$/;

export function isValidMappingModelName(value: string): boolean {
  return MODEL_NAME_PATTERN.test(value.trim());
}

export function hasDuplicateSourceModel(rules: MappingRule[], sourceModel: string): boolean {
  const normalized = sourceModel.trim().toLowerCase();
  return rules.some(rule => rule.sourceModel.trim().toLowerCase() === normalized);
}

export function createMappingRuleDraft(
  existingRules: MappingRule[],
  sourceModel: string,
  targetModel: string,
): MappingRule {
  return {
    id: nextMappingRuleId(existingRules),
    sourceModel: sourceModel.trim(),
    targetModel: targetModel.trim(),
  };
}

function nextMappingRuleId(existingRules: MappingRule[]): string {
  const maxId = existingRules.reduce((max, rule) => {
    const match = GENERATED_RULE_ID_PATTERN.exec(rule.id.trim());
    if (!match) {
      return max;
    }
    const value = Number.parseInt(match[1] ?? '0', 10);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);

  return `rule-${maxId + 1}`;
}
