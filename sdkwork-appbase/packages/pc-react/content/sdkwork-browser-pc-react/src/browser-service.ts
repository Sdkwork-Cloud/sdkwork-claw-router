import { readPcReactRuntimeSession } from "@sdkwork/core-pc-react";
import {
  createEmptySdkworkBrowserWorkspace,
  type SdkworkBrowserSiteGroup,
  type SdkworkBrowserTab,
  type SdkworkBrowserWorkspaceData,
} from "./browser";

export interface CreateSdkworkBrowserServiceOptions {
  fallbackGroups?: readonly SdkworkBrowserSiteGroup[];
  fallbackTabs?: readonly SdkworkBrowserTab[];
  getSessionTokens?: () => {
    authToken?: string;
  };
  listGroups?: () => Promise<readonly SdkworkBrowserSiteGroup[]>;
  listTabs?: () => Promise<readonly SdkworkBrowserTab[]>;
  workspaceId?: string;
}

export interface SdkworkBrowserService {
  getEmptyWorkspace(): SdkworkBrowserWorkspaceData;
  getWorkspace(): Promise<SdkworkBrowserWorkspaceData>;
}

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function resolveSettledValue<T>(
  result: PromiseSettledResult<T>,
  fallback: T,
): T {
  return result.status === "fulfilled" ? result.value : fallback;
}

export function createSdkworkBrowserService(
  options: CreateSdkworkBrowserServiceOptions = {},
): SdkworkBrowserService {
  const getSessionTokens = options.getSessionTokens ?? (() => readPcReactRuntimeSession());
  const fallbackWorkspace = createEmptySdkworkBrowserWorkspace({
    context: {
      workspaceId: options.workspaceId,
    },
    groups: options.fallbackGroups,
    tabs: options.fallbackTabs,
  });

  return {
    getEmptyWorkspace() {
      return createEmptySdkworkBrowserWorkspace({
        context: {
          isAuthenticated: Boolean(normalizeText(getSessionTokens().authToken)),
          workspaceId: options.workspaceId,
        },
        groups: options.fallbackGroups ?? fallbackWorkspace.groups,
        policy: fallbackWorkspace.policy,
        tabs: options.fallbackTabs ?? fallbackWorkspace.tabs,
      });
    },

    async getWorkspace() {
      const isAuthenticated = Boolean(normalizeText(getSessionTokens().authToken));

      if (!options.listTabs && !options.listGroups) {
        return createEmptySdkworkBrowserWorkspace({
          context: {
            isAuthenticated,
            workspaceId: options.workspaceId,
          },
          groups: options.fallbackGroups ?? fallbackWorkspace.groups,
          policy: fallbackWorkspace.policy,
          tabs: options.fallbackTabs ?? fallbackWorkspace.tabs,
        });
      }

      const [tabsResult, groupsResult] = await Promise.allSettled([
        options.listTabs ? options.listTabs() : Promise.resolve(options.fallbackTabs ?? fallbackWorkspace.tabs),
        options.listGroups ? options.listGroups() : Promise.resolve(options.fallbackGroups ?? fallbackWorkspace.groups),
      ]);

      const tabs = resolveSettledValue(tabsResult, options.fallbackTabs ?? fallbackWorkspace.tabs);
      const groups = resolveSettledValue(groupsResult, options.fallbackGroups ?? fallbackWorkspace.groups);

      return createEmptySdkworkBrowserWorkspace({
        context: {
          isAuthenticated,
          workspaceId: options.workspaceId,
        },
        groups,
        policy: fallbackWorkspace.policy,
        tabs,
      });
    },
  };
}

export const sdkworkBrowserService = createSdkworkBrowserService();
