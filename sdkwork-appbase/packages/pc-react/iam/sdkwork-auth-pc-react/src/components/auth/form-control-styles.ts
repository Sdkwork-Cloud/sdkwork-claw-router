import type { CSSProperties } from "react";

export const SDKWORK_AUTH_INPUT_CLASS_NAME =
  "h-11 rounded-xl border-zinc-200 bg-white shadow-sm transition-colors text-[var(--sdkwork-auth-field-text-color)] placeholder:text-[var(--sdkwork-auth-field-placeholder-color)] focus-visible:ring-primary-500 focus-visible:ring-offset-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus-visible:ring-offset-zinc-950";

export const SDKWORK_AUTH_ICON_INPUT_CLASS_NAME =
  `${SDKWORK_AUTH_INPUT_CLASS_NAME} pl-10`;

export const SDKWORK_AUTH_PASSWORD_FRAME_CLASS_NAME =
  "grid w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-colors focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 focus-within:ring-offset-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus-within:ring-offset-zinc-950";

export const SDKWORK_AUTH_PASSWORD_FRAME_STYLE = {
  alignItems: "center",
  backgroundColor: "var(--sdkwork-auth-field-background-color, #ffffff)",
  borderColor: "var(--sdkwork-auth-field-border-color, #e4e4e7)",
  borderRadius: "0.75rem",
  borderStyle: "solid",
  borderWidth: "1px",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  display: "grid",
  gridTemplateColumns: "2.5rem minmax(0, 1fr) 2.5rem",
  minHeight: "2.75rem",
  overflow: "hidden",
  width: "100%",
} satisfies CSSProperties;

export const SDKWORK_AUTH_PASSWORD_ICON_SLOT_CLASS_NAME =
  "flex h-full min-w-10 items-center justify-center text-[var(--sdkwork-auth-icon-muted-color)]";

export const SDKWORK_AUTH_PASSWORD_ICON_SLOT_STYLE = {
  alignItems: "center",
  color: "var(--sdkwork-auth-icon-muted-color, #71717a)",
  display: "flex",
  height: "100%",
  justifyContent: "center",
  minWidth: "2.5rem",
} satisfies CSSProperties;

export const SDKWORK_AUTH_PASSWORD_CONTROL_SLOT_STYLE = {
  minWidth: "0",
} satisfies CSSProperties;

export const SDKWORK_AUTH_PASSWORD_INPUT_CLASS_NAME =
  "h-11 w-full rounded-none border-0 bg-transparent px-0 py-0 shadow-none outline-none ring-0 ring-offset-0 text-[var(--sdkwork-auth-field-text-color)] placeholder:text-[var(--sdkwork-auth-field-placeholder-color)] focus-visible:ring-0 focus-visible:ring-offset-0";

export const SDKWORK_AUTH_PASSWORD_LEADING_ICON_CLASS_NAME =
  "h-5 w-5 shrink-0 text-[var(--sdkwork-auth-icon-muted-color)]";

export const SDKWORK_AUTH_PASSWORD_LEADING_ICON_STYLE = {
  display: "block",
  flexShrink: 0,
  height: "1.25rem",
  pointerEvents: "none",
  width: "1.25rem",
} satisfies CSSProperties;

export const SDKWORK_AUTH_PASSWORD_VISIBILITY_ICON_STYLE = {
  display: "block",
  height: "1rem",
  width: "1rem",
} satisfies CSSProperties;

export const SDKWORK_AUTH_PASSWORD_VISIBILITY_TOGGLE_CLASS_NAME =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg p-0 text-[var(--sdkwork-auth-icon-muted-color)] hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100";

export const SDKWORK_AUTH_PASSWORD_VISIBILITY_TOGGLE_STYLE = {
  alignItems: "center",
  backgroundColor: "transparent",
  borderColor: "transparent",
  borderRadius: "0.5rem",
  boxShadow: "none",
  color: "var(--sdkwork-auth-icon-muted-color, #71717a)",
  display: "inline-flex",
  flexShrink: 0,
  height: "2rem",
  justifyContent: "center",
  lineHeight: 0,
  padding: 0,
  width: "2rem",
} satisfies CSSProperties;

export const SDKWORK_AUTH_PRIMARY_BUTTON_CLASS_NAME =
  "h-11 w-full rounded-xl bg-primary-600 font-bold text-white shadow-sm hover:bg-primary-700 focus-visible:ring-primary-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950";

export const SDKWORK_AUTH_OUTLINE_BUTTON_CLASS_NAME =
  "h-11 min-w-[132px] shrink-0 rounded-xl border-zinc-200 bg-white font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800";

export const SDKWORK_AUTH_INPUT_STYLE = {
  backgroundColor: "var(--sdkwork-auth-field-background-color, #ffffff)",
  borderColor: "var(--sdkwork-auth-field-border-color, #e4e4e7)",
  borderRadius: "0.75rem",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  color: "var(--sdkwork-auth-field-text-color, #09090b)",
  height: "2.75rem",
} satisfies CSSProperties;

export const SDKWORK_AUTH_PASSWORD_INPUT_STYLE = {
  backgroundColor: "transparent",
  border: "0",
  borderColor: "transparent",
  borderRadius: "0",
  borderStyle: "solid",
  borderWidth: "0",
  boxShadow: "none",
  color: "var(--sdkwork-auth-field-text-color, #09090b)",
  height: "2.75rem",
  outline: "none",
  padding: "0",
  paddingBottom: "0",
  paddingLeft: "0",
  paddingRight: "0",
  paddingTop: "0",
  width: "100%",
} satisfies CSSProperties;

export const SDKWORK_AUTH_PRIMARY_BUTTON_STYLE = {
  backgroundColor: "var(--sdkwork-auth-primary-button-background-color, var(--sdk-color-brand-primary, #dc2626))",
  borderColor: "transparent",
  borderRadius: "0.75rem",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  color: "var(--sdkwork-auth-primary-button-text-color, #ffffff)",
  height: "2.75rem",
  width: "100%",
} satisfies CSSProperties;

export const SDKWORK_AUTH_OUTLINE_BUTTON_STYLE = {
  backgroundColor: "var(--sdkwork-auth-outline-button-background-color, #ffffff)",
  borderColor: "var(--sdkwork-auth-outline-button-border-color, #e4e4e7)",
  borderRadius: "0.75rem",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  color: "var(--sdkwork-auth-outline-button-text-color, #18181b)",
  height: "2.75rem",
} satisfies CSSProperties;
