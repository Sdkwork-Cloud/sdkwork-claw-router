# SDKWork Claw Router — Kubernetes Deployment Example

This example targets a distributed deployment with PostgreSQL and Redis managed outside the cluster.

## Prerequisites

- PostgreSQL reachable from the cluster
- Redis reachable from the cluster (required for server deployment mode)
- Secrets mounted for database password, API key pepper, session signing secrets, and trusted-subject secret

## Apply

```bash
kubectl apply -f deployments/kubernetes/claw-router-edge.yaml
kubectl apply -f deployments/kubernetes/claw-router-app-api.yaml
kubectl apply -f deployments/kubernetes/claw-router-admin-api.yaml
```

## Probes

- **Liveness**: `GET /healthz` — process is running
- **Readiness**: `GET /readyz` — returns `503` until `SELECT 1` succeeds against the configured database

## Migration

Run database upgrade once before scaling replicas:

```bash
clawrouterctl upgrade --config-file /etc/sdkwork/clawrouter.toml
```

Do not rely on concurrent `ensure_installed` from multiple replicas during first rollout.
