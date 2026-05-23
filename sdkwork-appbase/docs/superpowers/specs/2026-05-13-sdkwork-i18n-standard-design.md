# SDKWork PC React I18n Standard Design

## Goal

Standardize UI internationalization for `apps/sdkwork-appbase` PC React packages with a single SDKWork-owned i18n foundation and migrate IAM auth to it without preserving the legacy per-component `locale/messages` compatibility layer.

## Decision

Introduce `@sdkwork/i18n-pc-react` as the only React i18n runtime package for appbase PC React modules. It wraps `i18next` and `react-i18next`, but feature packages must depend on the SDKWork facade, not on `react-i18next` directly.

Auth moves from module-local `SdkworkAuthIntlProvider locale/messages` to:

- `SDKWORK_AUTH_I18N_NAMESPACE = "iam.auth"`
- a typed catalog exported by auth
- global `SdkworkI18nProvider` in the app shell or route test harness
- `useSdkworkAuthIntl()` resolving auth messages from the global namespace

Because compatibility is intentionally not required, auth page props, callback page props, controller options, and service options no longer accept `locale` or `messages`.

## Architecture

```text
App shell / test harness
  -> SdkworkI18nProvider
       -> i18next/react-i18next instance
       -> SDKWork locale normalization
       -> SDKWork namespace catalog registration
  -> feature packages
       -> register/export namespace catalogs
       -> consume typed module messages through SDKWork hooks
```

Feature packages keep their own domain message shape, but the merge, provider, locale normalization, namespace registration, and parity checks live in the foundation package.

## Auth Migration

`@sdkwork/auth-pc-react` exports the auth catalog and continues to expose typed auth messages for consumers that need static references. Runtime localization, however, comes only from `SdkworkI18nProvider`; page-level `locale/messages` injection is removed.

Auth forms keep controlled validation with inline, accessible field errors. Required messages, labels, OAuth copy, QR copy, and service fallback errors all resolve from the same `iam.auth` namespace.

## Testing

Foundation tests cover:

- locale normalization (`zh` variants to `zh-CN`, default to `en-US`)
- namespace catalog creation and deep merge
- key parity between locales
- provider registration and `useSdkworkModuleMessages`

Auth tests cover:

- global provider switches login UI and validation messages to Chinese
- auth page props reject legacy `locale/messages` at type level
- auth catalog has complete locale parity

## Out Of Scope

This slice migrates the auth package and creates the standard foundation. Other existing packages still using local `*-intl.tsx` patterns should be migrated package by package after the standard is available.
