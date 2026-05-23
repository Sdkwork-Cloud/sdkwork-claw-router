# @sdkwork/workspace-mobile-react

## Purpose

Headless mobile workspace blueprints for tab shells, route ownership, global layers, and bottom inset policy.

## Placement

- Architecture: `mobile-react`
- Domain: `foundation`
- Capability: `workspace`
- Status: `ready`

## Depends on

- `@sdkwork/appbase-mobile-react` for capability manifest composition
- `@sdkwork/router-mobile-react` for path normalization

## Public surface

- `createSdkworkWorkspaceTabs` normalizes tab-shell entries
- `createSdkworkWorkspaceTabRouteRules` normalizes route-to-tab ownership rules
- `createSdkworkWorkspaceLayers` standardizes global workspace layers
- `resolveWorkspaceTabMeta` maps arbitrary paths back to the owning tab
- `createWorkspaceTabInteraction` standardizes navigate versus reselect behavior
- `resolveWorkspaceLayerVisibility` produces visible layers and bottom inset policy
- `createWorkspaceManifest` declares reusable mobile workspace defaults

## Productized seams

- deterministic mobile tab-shell blueprints
- reusable route ownership for active-tab resolution
- standardized global layers for tabbar, mini player, and floating assistant
- bottom inset decisions without UI coupling
