import { Button } from "@sdkwork/ui-pc-react";
import type { SdkworkEditorDocumentMode } from "../editor";
import type { SdkworkEditorSortBy } from "../editor";

export interface SdkworkEditorModeSwitcherProps {
  activeMode: SdkworkEditorDocumentMode | "all";
  onModeChange?: (mode: SdkworkEditorDocumentMode | "all") => void;
  onSortChange?: (sortBy: SdkworkEditorSortBy) => void;
  sortBy: SdkworkEditorSortBy;
}

const modes: Array<SdkworkEditorDocumentMode | "all"> = ["all", "code", "markdown", "rich-text"];
const sorts: SdkworkEditorSortBy[] = ["recent", "priority", "alphabetical"];

function labelMode(mode: SdkworkEditorDocumentMode | "all"): string {
  if (mode === "rich-text") {
    return "Rich text";
  }

  return mode.charAt(0).toUpperCase() + mode.slice(1);
}

function labelSort(sortBy: SdkworkEditorSortBy): string {
  if (sortBy === "recent") {
    return "Recent";
  }
  if (sortBy === "priority") {
    return "Priority";
  }
  return "A-Z";
}

export function SdkworkEditorModeSwitcher({
  activeMode,
  onModeChange,
  onSortChange,
  sortBy,
}: SdkworkEditorModeSwitcherProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[1.25rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-4">
      <div className="flex flex-wrap gap-2">
        {modes.map((mode) => (
          <Button
            key={mode}
            onClick={() => onModeChange?.(mode)}
            type="button"
            variant={activeMode === mode ? "secondary" : "ghost"}
          >
            {labelMode(mode)}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {sorts.map((value) => (
          <Button
            key={value}
            onClick={() => onSortChange?.(value)}
            type="button"
            variant={sortBy === value ? "secondary" : "ghost"}
          >
            {labelSort(value)}
          </Button>
        ))}
      </div>
    </div>
  );
}
