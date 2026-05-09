export interface AccountConsumptionItem {
  /** UI color token selected by the backend from known modality labels. */
  color: string;
  name: string;
  percentage: number;
  value: number;
}
