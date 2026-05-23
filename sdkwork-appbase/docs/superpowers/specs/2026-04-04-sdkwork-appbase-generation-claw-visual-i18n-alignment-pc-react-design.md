# SDKWORK Generation Claw Visual And I18n Alignment PC React Design

## Context

`@sdkwork/generation-pc-react` already exposes the core reusable generation workspace:

- generation run digest summary
- searchable and filterable run list
- run detail inspection
- controller and service seams that can be wired into shared runtime state

The package is functional, but it is still behind the current `claw-studio` standard in three places:

- user-facing copy is still embedded directly in page and component files
- the package has no local internationalization seam for host reuse
- visual surfaces still rely on hardcoded violet hero and selection treatments instead of token-driven Claw-style shell composition

## Goal

Turn `@sdkwork/generation-pc-react` into the reusable reference package for AI-era content generation workspaces by aligning it with `claw-studio` on:

- package-local localization
- token-driven visual appearance
- consistent runtime-facing error and loading copy
- Claw-style workspace rhythm built on `sdkwork-ui` and `sdkwork-core`

## Scope

This iteration covers the exported generation package surface:

- `GenerationPage`
- `GenerationRunSummary`
- `GenerationRunList`
- `GenerationRunDetail`
- generation controller fallback messaging
- generation package exports and README

It does not yet refactor `image` or `video` in the same pass.
Those packages should follow the same seam pattern after generation is complete.

## Claw Studio Reference Standard

The generation package should align to the observable `claw-studio` standard:

- premium top hero with layered, dark-neutral surface treatment
- content panels that feel deliberate and dense instead of scaffolded
- strong but restrained accent usage driven by theme tokens
- empty states and detail cards that read like product surfaces, not placeholders
- locale-aware copy and number formatting at the package boundary

## Architecture

### 1. Package-local copy layer

Add a dedicated generation copy module with built-in `en-US` and `zh-CN` dictionaries.

The copy layer should cover:

- page title, description, actions, search, filters, and sort labels
- summary labels
- empty state labels and descriptions
- detail metrics and status labels
- controller fallback error copy

This keeps the package reusable across shells without forcing a workspace-wide i18n dependency.

### 2. Package-local intl provider

Add a generation intl provider and hook so the page and exported components can consume localized copy and formatting without prop drilling.

The provider should support:

- locale normalization
- host copy overrides
- safe default English fallback when no provider is present
- locale-aware integer and latency formatting
- normalized status and sort labels

### 3. Package-local appearance seam

Add a generation appearance module that turns visual decisions into reusable helpers:

- backdrop style
- hero style
- tone chip style
- panel style

The package should stay on `sdkwork-ui` primitives and theme variables, but the composition should move closer to Claw's dark, high-contrast workspace rhythm.

### 4. Controller messaging alignment

Move controller fallback error strings into the generation copy layer so runtime errors are consistent with the page surface and host locale.

No backend or controller state semantics should change.

## State And Data Rules

- No backend contract changes
- No new generation mutations
- No changes to run sorting/filtering behavior except localized labels
- No compatibility shims for old visuals; optimize directly for the new reusable standard

## Testing Scope

Tests should lock:

- Chinese copy rendering through the generation page seam
- default English fallback behavior when no provider is installed
- appearance helper output shape
- controller fallback error copy remaining deterministic

## Deliverable

After this iteration, `@sdkwork/generation-pc-react` should:

- expose `copy + intl + appearance` seams like the aligned IAM and commerce packages
- render Claw-style generation workspace surfaces without hardcoded product literals
- support host locale and message overrides
- become the reference pattern for `image` and `video`
