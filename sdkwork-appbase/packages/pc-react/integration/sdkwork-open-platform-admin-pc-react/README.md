# @sdkwork/open-platform-admin-pc-react

Provider-neutral admin management for official account and mini app accounts.

The package is a PC React boundary over the generated backend SDK. It expects
`backendClient.openPlatform.accounts.*` resource-tree methods and never creates
raw HTTP clients or provider-specific `wechat` modules.

Managed surfaces:

- open platform accounts for `official_account` and `mini_app`
- login entries used by QR login and registration
- payment bindings attached to each account
- default QR account selection
