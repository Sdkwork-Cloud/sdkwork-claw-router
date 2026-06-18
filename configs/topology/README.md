# Claw Router topology profiles

Authoritative profile env files for `specs/topology.spec.json`.

Pattern: `{hosting}.{serviceLayout}.{environment}.env`

Default local development profile: `self-hosted.unified-process.development` (single-port integrated runtime).

Validate:

```bash
pnpm topology:validate
```

Canonical dev commands (see `docs/topology-standard.md` and `specs/topology.spec.json` → `scripts.pnpm`):

```bash
pnpm clawrouter:dev
pnpm clawrouter:dev:split
pnpm clawrouter:dev:cloud
```
