import type { CommercePaymentRuntimeAssemblyEvent } from './commerce-payment-runtime-assembly-event';
import type { CommercePaymentRuntimeAssemblySummary } from './commerce-payment-runtime-assembly-summary';

/** Commerce payment runtime snapshot response schema exposed by Claw Router. */
export interface CommercePaymentRuntimeSnapshotResponse {
  /** Environment field on commerce payment runtime snapshot response. */
  environment: 'sandbox' | 'production';
  /** Events field on commerce payment runtime snapshot response. */
  events: CommercePaymentRuntimeAssemblyEvent[];
  /** Recorded at field on commerce payment runtime snapshot response. */
  recordedAt: string;
  /** Summary field on commerce payment runtime snapshot response. */
  summary: CommercePaymentRuntimeAssemblySummary;
}
