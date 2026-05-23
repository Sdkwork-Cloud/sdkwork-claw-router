# @sdkwork/iam-runtime

Runtime bootstrap for IAM modules.

The runtime owns:

- SaaS/local/private deployment mode.
- Dev/test/prod environment selection.
- Token store and context store adapters.
- Dual-token request header generation.
- Session-to-`AppContext` and `ShardingContext` propagation.

Applications provide generated SDK clients and storage adapters at initialization time.
