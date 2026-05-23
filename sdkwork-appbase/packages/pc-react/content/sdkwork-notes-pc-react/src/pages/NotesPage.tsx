import { useEffect } from "react";
import {
  Button,
  LoadingBlock,
  StatusNotice,
} from "@sdkwork/ui-pc-react";
import type { SdkworkNotesController } from "../notes-controller";
import {
  useSdkworkNotesController,
  useSdkworkNotesControllerState,
} from "../notes-controller";
import type { SdkworkNotesService } from "../notes-service";
import { SdkworkNotesCardList } from "../components/NotesCardList";
import { SdkworkNotesNotebookRail } from "../components/NotesNotebookRail";
import { SdkworkNotesPreviewPanel } from "../components/NotesPreviewPanel";

export interface SdkworkNotesPageProps {
  controller?: SdkworkNotesController;
  service?: Partial<SdkworkNotesService>;
}

export function SdkworkNotesPage({
  controller: controllerProp,
  service,
}: SdkworkNotesPageProps) {
  const controller = useSdkworkNotesController(controllerProp, service);
  const state = useSdkworkNotesControllerState(controller);

  useEffect(() => {
    if (!state.isBootstrapped && !state.isLoading) {
      void controller.bootstrap();
    }
  }, [controller, state.isBootstrapped, state.isLoading]);

  return (
    <div className="h-full overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
      <div className="mx-auto max-w-[96rem] space-y-5">
        <section className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_right,rgba(129,140,248,0.16),transparent_30%),linear-gradient(140deg,#111827,#1f2937_50%,#0f172a)] px-6 py-7 text-white shadow-[var(--sdk-shadow-lg)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-tight">Notes Workspace</h1>
              <p className="mt-3 text-sm leading-7 text-white/75">
                Curate notebooks, capture operational context, and keep high-signal handoff notes in one reusable capability package.
              </p>
            </div>
            <Button onClick={() => void controller.refresh()} type="button" variant="outline">
              Refresh notes
            </Button>
          </div>
        </section>

        {state.isLoading && !state.isBootstrapped ? <LoadingBlock label="Loading notes workspace..." /> : null}
        {state.lastError ? (
          <StatusNotice title="Notes workspace error" tone="danger">
            {state.lastError}
          </StatusNotice>
        ) : null}

        <section className="space-y-4 rounded-[1.5rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] p-5">
          <SdkworkNotesNotebookRail
            activeNotebookId={state.activeNotebookId}
            notebooks={state.workspace.notebooks}
            onNotebookChange={(notebookId) => controller.setNotebook(notebookId)}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => controller.setShowStarredOnly(!state.showStarredOnly)}
              type="button"
              variant={state.showStarredOnly ? "secondary" : "ghost"}
            >
              Starred only
            </Button>
            <Button
              onClick={() => controller.setSortBy("recent")}
              type="button"
              variant={state.sortBy === "recent" ? "secondary" : "ghost"}
            >
              Recent
            </Button>
            <Button
              onClick={() => controller.setSortBy("starred")}
              type="button"
              variant={state.sortBy === "starred" ? "secondary" : "ghost"}
            >
              Starred
            </Button>
            <Button
              onClick={() => controller.setSortBy("alphabetical")}
              type="button"
              variant={state.sortBy === "alphabetical" ? "secondary" : "ghost"}
            >
              A-Z
            </Button>
          </div>

          <label className="block">
            <span className="sr-only">Search notes</span>
            <input
              className="w-full rounded-[1rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] px-3.5 py-2.5 text-sm text-[var(--sdk-color-text-primary)]"
              onChange={(event) => controller.setSearchQuery(event.target.value)}
              placeholder="Search notes"
              type="search"
              value={state.searchQuery}
            />
          </label>

          <div className="grid gap-5 xl:grid-cols-[24rem_minmax(0,1fr)]">
            <SdkworkNotesCardList
              notes={state.visibleNotes}
              onSelect={(noteId) => controller.selectNote(noteId)}
              selectedNoteId={state.selectedNoteId}
            />
            <SdkworkNotesPreviewPanel note={state.selectedNote} />
          </div>
        </section>
      </div>
    </div>
  );
}
