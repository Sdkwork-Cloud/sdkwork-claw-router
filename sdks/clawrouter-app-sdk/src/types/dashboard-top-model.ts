export interface DashboardTopModel {
  cost: number;
  isUp: boolean;
  modality: 'text' | 'image' | 'video' | 'audio' | 'music' | 'unknown';
  name: string;
  rank: number;
  requests: number;
  supplier: string;
  trend: string;
}
