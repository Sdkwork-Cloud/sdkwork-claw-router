export interface AppReleaseItem {
  downloadUrl: string;
  id: string;
  os: 'Windows' | 'macOS' | 'Linux' | 'iOS' | 'Android' | 'HarmonyOS' | 'PC Web' | 'Mobile Web' | 'WeChat' | 'Alipay' | 'ByteDance' | 'Baidu' | 'QuickApp';
  platformType: 'Desktop' | 'Mobile' | 'Web' | 'Mini Program';
  releaseDate: string;
  size: string;
  version: string;
  whatsNew?: string;
}
