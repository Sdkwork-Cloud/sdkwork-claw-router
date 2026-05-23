# @sdkwork/iam-sdk-adapter

Central adapter boundary that converts generated app and backend SDK clients into the standard IAM port surface consumed by `@sdkwork/iam-service` and `@sdkwork/iam-runtime`.

Business modules should depend on the standard IAM ports, not on app-specific generated SDK constructors or legacy method names.
