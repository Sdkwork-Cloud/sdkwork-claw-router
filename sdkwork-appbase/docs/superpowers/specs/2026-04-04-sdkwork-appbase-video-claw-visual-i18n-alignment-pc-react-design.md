# SDKWORK Video Claw Visual And I18n Alignment PC React Design

## Context

`@sdkwork/video-pc-react` already exposes a reusable video workspace with:

- video digest summary cards
- preset and render-status filtering
- video gallery cards
- controller and service seams for host runtime integration

The package still has the same pre-alignment gaps that `generation` and `image` had:

- hardcoded page, gallery, summary, and controller copy
- no package-local intl seam for host reuse
- fixed dark hero and cyan/sky chip styling instead of token-driven appearance helpers

## Goal

Turn `@sdkwork/video-pc-react` into the third aligned content package after `generation` and `image` by bringing it onto the same reusable standard:

- package-local localization
- token-driven visual composition
- localized controller fallback messaging
- host override seams for page and standalone components

## Scope

This iteration covers:

- `VideoPage`
- `VideoSummaryCards`
- `VideoGallery`
- video controller fallback copy
- package exports and README

It does not yet cover `media`.

## Architecture

### 1. Package-local copy layer

Add built-in `en-US` and `zh-CN` dictionaries for:

- page title, description, loading, error, search, and all-presets label
- render status labels
- empty gallery text
- summary labels
- controller load-failure fallback
- `scene/scenes` wording

### 2. Package-local intl provider

Add a provider and hook that expose:

- normalized locale handling
- safe default English fallback
- host message override merge seam
- status label formatting
- integer formatting for digest values
- scene count formatting

### 3. Package-local appearance seam

Add reusable appearance helpers for:

- backdrop style
- hero style
- tone chip style
- panel style

The package should stay on `sdkwork-ui` tokens and stop depending on hardcoded cyan/sky accent classes.

## Testing Scope

Tests should lock:

- page-level host localization overrides
- standalone component intl-provider behavior
- appearance helper exports
- controller fallback override behavior

## Deliverable

After this iteration, `@sdkwork/video-pc-react` should follow the same aligned package standard now established by `identity`, `commerce`, `generation`, and `image`.
