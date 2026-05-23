# @sdkwork/i18n-pc-react

SDKWork PC React internationalization foundation.

This package is the only place where appbase React modules should touch `i18next` and `react-i18next`. Feature modules export typed namespace catalogs and consume messages through the SDKWork facade.

## Public Contract

- `SdkworkI18nProvider` mounts SDKWork catalogs and selects the current locale.
- `createSdkworkMessageCatalog` creates typed namespace catalogs.
- `useSdkworkModuleMessages` resolves a module catalog from the active provider.
- `assertSdkworkCatalogLocaleParity` verifies locale key parity.
- `normalizeSdkworkLocale` normalizes runtime locale input.

## Verification

```bash
pnpm.cmd exec vitest run packages/pc-react/foundation/sdkwork-i18n-pc-react/tests
pnpm.cmd exec tsc --noEmit -p packages/pc-react/foundation/sdkwork-i18n-pc-react/tsconfig.json
```
