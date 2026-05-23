# SDKWork RPC Contracts

Canonical common proto contracts shared by SDKWork RPC services.

This package owns only language-neutral `.proto` files under `proto/sdkwork/common/v1`.
Business-domain RPC packages import these common messages instead of duplicating
context, metadata, error, pagination, money, or service manifest types.
