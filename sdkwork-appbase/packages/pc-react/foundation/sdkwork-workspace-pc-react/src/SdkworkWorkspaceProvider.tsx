import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { SdkworkWorkspaceBlueprint } from "./workspace";

export interface SdkworkWorkspaceState {
  activeNavigationItemId?: string;
  activeTabId?: string;
  isBottomPanelOpen: boolean;
  isInspectorOpen: boolean;
  setActiveNavigationItemId: (value: string | undefined) => void;
  setActiveTabId: (value: string | undefined) => void;
  setBottomPanelOpen: (value: boolean) => void;
  setInspectorOpen: (value: boolean) => void;
  toggleBottomPanelOpen: () => void;
  toggleInspectorOpen: () => void;
}

const SdkworkWorkspaceContext = createContext<SdkworkWorkspaceState | null>(null);

export interface SdkworkWorkspaceProviderProps extends PropsWithChildren {
  blueprint?: SdkworkWorkspaceBlueprint;
  defaultActiveNavigationItemId?: string;
  defaultActiveTabId?: string;
  defaultBottomPanelOpen?: boolean;
  defaultInspectorOpen?: boolean;
}

export function SdkworkWorkspaceProvider({
  blueprint,
  children,
  defaultActiveNavigationItemId,
  defaultActiveTabId,
  defaultBottomPanelOpen,
  defaultInspectorOpen,
}: SdkworkWorkspaceProviderProps) {
  const [activeNavigationItemId, setActiveNavigationItemId] = useState<string | undefined>(
    defaultActiveNavigationItemId ?? blueprint?.defaultActiveNavigationItemId,
  );
  const [activeTabId, setActiveTabId] = useState<string | undefined>(
    defaultActiveTabId ?? blueprint?.defaultActiveTabId,
  );
  const [isBottomPanelOpen, setBottomPanelOpen] = useState<boolean>(
    defaultBottomPanelOpen ?? blueprint?.isBottomPanelOpenByDefault ?? false,
  );
  const [isInspectorOpen, setInspectorOpen] = useState<boolean>(
    defaultInspectorOpen ?? blueprint?.isInspectorOpenByDefault ?? true,
  );

  const value = useMemo(
    () => ({
      activeNavigationItemId,
      activeTabId,
      isBottomPanelOpen,
      isInspectorOpen,
      setActiveNavigationItemId,
      setActiveTabId,
      setBottomPanelOpen,
      setInspectorOpen,
      toggleBottomPanelOpen: () => setBottomPanelOpen((open) => !open),
      toggleInspectorOpen: () => setInspectorOpen((open) => !open),
    }),
    [activeNavigationItemId, activeTabId, isBottomPanelOpen, isInspectorOpen],
  );

  return (
    <SdkworkWorkspaceContext.Provider value={value}>
      {children}
    </SdkworkWorkspaceContext.Provider>
  );
}

export function useOptionalSdkworkWorkspace() {
  return useContext(SdkworkWorkspaceContext);
}

export function useSdkworkWorkspace() {
  const context = useOptionalSdkworkWorkspace();
  if (!context) {
    throw new Error("useSdkworkWorkspace must be used inside SdkworkWorkspaceProvider");
  }

  return context;
}
