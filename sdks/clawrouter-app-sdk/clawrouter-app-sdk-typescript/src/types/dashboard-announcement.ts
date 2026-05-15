/** Dashboard announcement schema exposed by Claw Router. */
export interface DashboardAnnouncement {
  /** Id field on dashboard announcement. */
  id: number;
  /** Text field on dashboard announcement. */
  text: string;
  /** Time field on dashboard announcement. */
  time: string;
  /** Type field on dashboard announcement. */
  type: 'success' | 'info' | 'warning' | 'error' | 'unknown';
}
