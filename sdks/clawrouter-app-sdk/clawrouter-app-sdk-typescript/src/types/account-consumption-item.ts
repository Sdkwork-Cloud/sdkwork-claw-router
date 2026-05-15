/** Account consumption item schema exposed by Claw Router. */
export interface AccountConsumptionItem {
  /** UI color token selected by the backend from known modality labels. */
  color: string;
  /** Name field on account consumption item. */
  name: string;
  /** Percentage field on account consumption item. */
  percentage: number;
  /** Value field on account consumption item. */
  value: number;
}
