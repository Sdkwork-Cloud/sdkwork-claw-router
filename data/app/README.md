# SDKWork App Seed

`sdkwork-apps.json` is the install-time PlusApp seed bundle for SDKWork Claw Router.
`sdkwork-app-categories.json` is the matching install-time `PlusCategory` seed manifest for the
App Center categories derived from `plusApp.config.portal.category`.

The source of truth is each app's `sdkwork.app.config.json` under `spring-ai-plus-business/apps`.
Generate this file from the app standard exporter instead of editing individual app projections by
hand:

```powershell
@'
import fs from 'node:fs/promises';
import path from 'node:path';
import { buildSdkworkAppPlusAppRegistrationBundle } from '../scripts/lib/sdkwork-app-standard-init-all.mjs';

const result = await buildSdkworkAppPlusAppRegistrationBundle(path.resolve('..'), {
  environment: 'production',
  channel: 'STABLE',
});
if (!result.ok) {
  console.error(JSON.stringify(result.errors, null, 2));
  process.exit(1);
}
await fs.writeFile('data/app/sdkwork-apps.json', `${JSON.stringify(result, null, 2)}\n`, 'utf8');
'@ | node --input-type=module
python -B -m tools.app_seed_category_manifest
```

The installer imports the app bundle into the Java-compatible `plus_app` table, imports the category
manifest into `plus_category`, and writes the app catalog projection tables during first install.
`plusApp.config.standard.appKey` is the stable app identity used by AppCenter routes, while the
physical table shape stays aligned with Java `PlusApp`.

The category manifest is not a separate source of truth. It must stay generated from
`sdkwork-apps.json`; the Rust installer validates that every category row matches the app bundle
before any seed data is imported. Regenerate both files together when app manifests are added,
removed, or reclassified.
