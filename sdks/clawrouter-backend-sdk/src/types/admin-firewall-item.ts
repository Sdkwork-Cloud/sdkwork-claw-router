/** Persisted firewall rule snapshot returned by the backend. */
export interface AdminFirewallItem {
  id: string;
  reason: string;
  time: string;
  type: string;
  value: string;
}
