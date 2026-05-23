import { Button } from "@sdkwork/ui-pc-react";
import type { SdkworkNoteNotebook } from "../notes";

export interface SdkworkNotesNotebookRailProps {
  activeNotebookId: string | "all";
  notebooks: readonly SdkworkNoteNotebook[];
  onNotebookChange?: (notebookId: string | "all") => void;
}

export function SdkworkNotesNotebookRail({
  activeNotebookId,
  notebooks,
  onNotebookChange,
}: SdkworkNotesNotebookRailProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => onNotebookChange?.("all")}
        type="button"
        variant={activeNotebookId === "all" ? "secondary" : "ghost"}
      >
        All notebooks
      </Button>
      {notebooks.map((notebook) => (
        <Button
          key={notebook.id}
          onClick={() => onNotebookChange?.(notebook.id)}
          type="button"
          variant={activeNotebookId === notebook.id ? "secondary" : "ghost"}
        >
          {notebook.title}
        </Button>
      ))}
    </div>
  );
}
