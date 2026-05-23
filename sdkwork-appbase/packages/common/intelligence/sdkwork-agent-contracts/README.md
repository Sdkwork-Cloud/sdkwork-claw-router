# SDKWork Agent Contracts

Framework-neutral agent contracts for SDKWork applications. The package defines the standard agent domain model, run lifecycle, MCP and skill binding surface, memory hooks, metering event shape, and app/backend API route contract.

This package intentionally contains no React or provider runtime code. Product runtimes consume these contracts and map them to their own persistence, generated SDKs, and execution engines.
