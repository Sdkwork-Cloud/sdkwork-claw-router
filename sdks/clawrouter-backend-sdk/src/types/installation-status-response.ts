export interface InstallationStatusResponse {
  catalogSource: string;
  catalogVersion: string;
  /** Always false for status reads; install and upgrade actions report changes through the installer command path. */
  changed: boolean;
  environment: string;
  externalCatalog: boolean;
  lastCatalogRefreshStatus: 'not_run' | 'success' | 'dry_run' | 'failed';
  schemaVersion: string;
  seedProfile: string;
  status: 'not_installed' | 'installed' | 'upgrade_required' | 'incomplete' | 'corrupt';
}
