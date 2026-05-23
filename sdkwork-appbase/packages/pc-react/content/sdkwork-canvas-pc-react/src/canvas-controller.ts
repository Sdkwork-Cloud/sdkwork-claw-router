import {
  useMemo,
  useSyncExternalStore,
} from "react";
import type {
  SdkworkCanvasBoard,
  SdkworkCanvasNode,
  SdkworkCanvasWorkspaceData,
} from "./canvas";
import {
  createSdkworkCanvasService,
  type SdkworkCanvasService,
} from "./canvas-service";

export interface SdkworkCanvasControllerState {
  activeBoard: SdkworkCanvasBoard | null;
  activeBoardId: string | null;
  isBootstrapped: boolean;
  isLoading: boolean;
  lastError?: string;
  selectedNode: SdkworkCanvasNode | null;
  selectedNodeId: string | null;
  workspace: SdkworkCanvasWorkspaceData;
}

export interface SdkworkCanvasController {
  bootstrap(): Promise<SdkworkCanvasControllerState>;
  getState(): SdkworkCanvasControllerState;
  refresh(): Promise<SdkworkCanvasControllerState>;
  selectBoard(boardId: string | null): void;
  selectNode(nodeId: string | null): void;
  service: SdkworkCanvasService;
  subscribe(listener: () => void): () => void;
}

export interface CreateSdkworkCanvasControllerOptions {
  initialState?: Partial<SdkworkCanvasControllerState>;
  service?: Partial<SdkworkCanvasService>;
}

function resolveActiveBoardId(
  boards: readonly SdkworkCanvasBoard[],
  activeBoardId: string | null,
): string | null {
  if (activeBoardId && boards.some((board) => board.id === activeBoardId)) {
    return activeBoardId;
  }
  return boards[0]?.id ?? null;
}

function resolveSelectedNodeId(
  board: SdkworkCanvasBoard | null,
  selectedNodeId: string | null,
): string | null {
  if (!board) {
    return null;
  }
  if (selectedNodeId && board.nodes.some((node) => node.id === selectedNodeId)) {
    return selectedNodeId;
  }
  return board.nodes[0]?.id ?? null;
}

function normalizeState(
  state: SdkworkCanvasControllerState,
): SdkworkCanvasControllerState {
  const activeBoardId = resolveActiveBoardId(state.workspace.boards, state.activeBoardId);
  const activeBoard = state.workspace.boards.find((board) => board.id === activeBoardId) ?? null;
  const selectedNodeId = resolveSelectedNodeId(activeBoard, state.selectedNodeId);

  return {
    ...state,
    activeBoard,
    activeBoardId,
    selectedNode: activeBoard?.nodes.find((node) => node.id === selectedNodeId) ?? null,
    selectedNodeId,
  };
}

export function createSdkworkCanvasController(
  options: CreateSdkworkCanvasControllerOptions = {},
): SdkworkCanvasController {
  const service: SdkworkCanvasService = options.service
    ? {
        ...createSdkworkCanvasService(),
        ...options.service,
      }
    : createSdkworkCanvasService();
  const fallbackWorkspace = service.getEmptyWorkspace();
  const listeners = new Set<() => void>();
  let state = normalizeState({
    activeBoard: null,
    activeBoardId: null,
    isBootstrapped: false,
    isLoading: false,
    selectedNode: null,
    selectedNodeId: null,
    workspace: fallbackWorkspace,
    ...options.initialState,
  });

  function emit(): void {
    listeners.forEach((listener) => listener());
  }

  function setState(
    next:
      | Partial<SdkworkCanvasControllerState>
      | ((currentState: SdkworkCanvasControllerState) => Partial<SdkworkCanvasControllerState>),
  ): void {
    const partial = typeof next === "function" ? next(state) : next;
    state = normalizeState({
      ...state,
      ...partial,
    });
    emit();
  }

  return {
    async bootstrap() {
      setState({
        isLoading: true,
        lastError: undefined,
      });

      try {
        const workspace = await service.getWorkspace();
        setState({
          isBootstrapped: true,
          isLoading: false,
          workspace,
        });
        return state;
      } catch (error) {
        setState({
          isLoading: false,
          lastError: error instanceof Error ? error.message : "Failed to load canvas workspace.",
        });
        throw error;
      }
    },

    getState() {
      return state;
    },

    async refresh() {
      const workspace = await service.getWorkspace();
      setState({
        isBootstrapped: true,
        isLoading: false,
        workspace,
      });
      return state;
    },

    selectBoard(boardId) {
      setState({
        activeBoardId: boardId,
        selectedNodeId: null,
      });
    },

    selectNode(nodeId) {
      setState({
        selectedNodeId: nodeId,
      });
    },

    service,

    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export function useSdkworkCanvasController(
  controller?: SdkworkCanvasController,
  service?: Partial<SdkworkCanvasService>,
): SdkworkCanvasController {
  return useMemo(
    () => controller ?? createSdkworkCanvasController(service ? { service } : undefined),
    [controller, service],
  );
}

export function useSdkworkCanvasControllerState(
  controller: SdkworkCanvasController,
): SdkworkCanvasControllerState {
  return useSyncExternalStore(
    controller.subscribe,
    controller.getState,
    controller.getState,
  );
}
