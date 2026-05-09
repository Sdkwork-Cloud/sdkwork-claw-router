export interface DashboardAnnouncement {
  id: number;
  text: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'unknown';
}
