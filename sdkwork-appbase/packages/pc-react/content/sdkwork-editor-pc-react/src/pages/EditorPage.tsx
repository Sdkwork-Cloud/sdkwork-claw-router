import { useEffect } from "react";
import {
  Button,
  LoadingBlock,
  StatusNotice,
} from "@sdkwork/ui-pc-react";
import {
  createSdkworkEditorBackdropStyle,
  createSdkworkEditorGlassStyle,
  createSdkworkEditorHeroStyle,
  createSdkworkEditorHeroTextStyle,
} from "../editor-appearance";
import type { SdkworkEditorController } from "../editor-controller";
import {
  useSdkworkEditorController,
  useSdkworkEditorControllerState,
} from "../editor-controller";
import type { SdkworkEditorService } from "../editor-service";
import { SdkworkEditorDocumentList } from "../components/EditorDocumentList";
import { SdkworkEditorFocusPanel } from "../components/EditorFocusPanel";
import { SdkworkEditorModeSwitcher } from "../components/EditorModeSwitcher";

export interface SdkworkEditorPageProps {
  controller?: SdkworkEditorController;
  onOpenPath?: (path: string) => void;
  service?: Partial<SdkworkEditorService>;
}

export function SdkworkEditorPage({
  controller: controllerProp,
  onOpenPath,
  service,
}: SdkworkEditorPageProps) {
  const controller = useSdkworkEditorController(controllerProp, service);
  const state = useSdkworkEditorControllerState(controller);
  const primaryHeroTextStyle = createSdkworkEditorHeroTextStyle();
  const mutedHeroTextStyle = createSdkworkEditorHeroTextStyle("muted");
  const subtleHeroTextStyle = createSdkworkEditorHeroTextStyle("subtle");

  useEffect(() => {
    if (!state.isBootstrapped && !state.isLoading) {
      void controller.bootstrap();
    }
  }, [controller, state.isBootstrapped, state.isLoading]);

  return (
    <div className="relative h-full overflow-y-auto">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72"
        style={createSdkworkEditorBackdropStyle()}
      />

      <div className="relative px-4 py-4 sm:px-5 sm:py-5">
        <div className="mx-auto max-w-[96rem] space-y-5">
        <section
          className="overflow-hidden rounded-[2rem] border border-[color-mix(in_srgb,var(--sdk-color-border-default)_72%,transparent)] px-6 py-7 text-white shadow-[var(--sdk-shadow-lg)]"
          style={createSdkworkEditorHeroStyle()}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div
                className="inline-flex rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em]"
                style={{
                  ...createSdkworkEditorGlassStyle("accent", {
                    backgroundWeight: 12,
                    borderWeight: 24,
                    surfaceWeight: 82,
                  }),
                  ...subtleHeroTextStyle,
                }}
              >
                Content Authoring
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight" style={primaryHeroTextStyle}>Editor Workspace</h1>
              <p className="mt-3 text-sm leading-7" style={mutedHeroTextStyle}>
                Compose, inspect, and triage code, markdown, and rich text assets with deterministic catalog state.
              </p>
            </div>
            <Button onClick={() => void controller.refresh()} type="button" variant="secondary">
              Refresh documents
            </Button>
          </div>
        </section>

        {state.isLoading && !state.isBootstrapped ? <LoadingBlock label="Loading editor workspace..." /> : null}

        {state.lastError ? (
          <StatusNotice title="Editor workspace error" tone="danger">
            {state.lastError}
          </StatusNotice>
        ) : null}

        <section className="grid gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
          <div className="space-y-4">
            <SdkworkEditorModeSwitcher
              activeMode={state.activeMode}
              onModeChange={(mode) => controller.setMode(mode)}
              onSortChange={(sortBy) => controller.setSortBy(sortBy)}
              sortBy={state.sortBy}
            />
            <label className="block">
              <span className="sr-only">Search documents</span>
              <input
                className="w-full rounded-[1rem] border border-[var(--sdk-color-border-default)] bg-[var(--sdk-color-surface-panel)] px-3.5 py-2.5 text-sm text-[var(--sdk-color-text-primary)]"
                onChange={(event) => controller.setSearchQuery(event.target.value)}
                placeholder="Search documents"
                type="search"
                value={state.searchQuery}
              />
            </label>
            <SdkworkEditorDocumentList
              documents={state.visibleDocuments}
              onSelectDocument={(documentId) => controller.selectDocument(documentId)}
              selectedDocumentId={state.selectedDocumentId}
            />
          </div>

          <SdkworkEditorFocusPanel
            document={state.selectedDocument}
            onOpenPath={onOpenPath}
          />
        </section>
      </div>
      </div>
    </div>
  );
}
