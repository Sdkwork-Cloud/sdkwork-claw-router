# SDKWORK Image Claw Visual And I18n Alignment PC React Design

## Context

`@sdkwork/image-pc-react` already provides a reusable image workspace with:

- image digest summary cards
- preset and status filtering
- gallery-ready image cards
- controller and service seams for host runtime integration

The package still has the same gaps that `generation` had before alignment:

- hardcoded page, summary, gallery, and controller copy
- no package-local intl seam for host reuse
- page-local dark hero and cyan selection treatments instead of token-driven Claw-style appearance helpers

## Goal

Turn `@sdkwork/image-pc-react` into the next content reference package after `generation` by aligning it with `claw-studio` on:

- package-local localization
- token-driven visual composition
- localized controller fallback messaging
- reusable host override seams

## Scope

This iteration covers:

- `ImagePage`
- `ImageSummaryCards`
- `ImageGallery`
- image controller fallback copy
- package exports and README

It does not yet cover `video` or `media`.

## Architecture

### 1. Package-local copy layer

Add built-in `en-US` and `zh-CN` image dictionaries for:

- page title, description, loading, error, search, and all-presets label
- image status labels
- empty gallery text
- summary card labels
- controller load-failure fallback

### 2. Package-local intl provider

Add a provider and hook that expose:

- normalized locale handling
- safe default English fallback
- host message override merge seam
- status label formatting
- integer formatting for digest values

### 3. Package-local appearance seam

Add reusable image appearance helpers for:

- backdrop style
- hero style
- chip tone style
- panel style

The package should stay on `sdkwork-ui` tokens and move away from raw cyan classes.

## Testing Scope

Tests should lock:

- page-level host localization overrides
- standalone component intl provider behavior
- appearance helper exports
- controller fallback override behavior

## Deliverable

After this iteration, `@sdkwork/image-pc-react` should match the aligned package standard already established by `identity`, `commerce`, and `generation`.
