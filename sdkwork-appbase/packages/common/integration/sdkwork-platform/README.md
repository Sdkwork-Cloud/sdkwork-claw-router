# @sdkwork/platform

Provider-neutral SDKWork platform module.

This package owns open platform accounts, entries, hooks, webhook deliveries,
provider events, external delivery windows, outbox attempts, menus, notices, and
payment bindings. Official-account messages and customer-service replies are
written into `@sdkwork/conversation`; platform records only reference the
conversation and message ids needed for delivery and audit.
