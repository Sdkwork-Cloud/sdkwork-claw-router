import { readPcReactRuntimeSession } from "@sdkwork/core-pc-react";
import {
  createEmptySdkworkInstallCatalog,
  createSdkworkInstallStepFlow,
  resolveSdkworkRecommendedInstallPath,
  sortSdkworkInstallVariants,
  summarizeSdkworkInstallProgress,
  summarizeSdkworkInstallReadiness,
  type SdkworkInstallAssessmentStatus,
  type SdkworkInstallCatalogData,
  type SdkworkInstallHostPlatform,
  type SdkworkInstallStep,
  type SdkworkInstallTargetKind,
  type SdkworkInstallVariant,
} from "./install";

export interface GetSdkworkInstallCatalogInput {
  basePath?: string;
  targetKind?: SdkworkInstallTargetKind;
  variantId?: string | null;
}

export interface SdkworkInstallRuntimeContext {
  hasContainerRuntime?: boolean;
  hostPlatform: SdkworkInstallHostPlatform;
  nodeAvailable?: boolean;
  runtimeReady?: boolean;
}

export interface CreateSdkworkInstallServiceOptions {
  getRuntimeContext?: () => SdkworkInstallRuntimeContext;
  getSessionTokens?: () => {
    authToken?: string;
  };
  variants?: readonly SdkworkInstallVariant[];
}

export interface SdkworkInstallService {
  getCatalog(input?: GetSdkworkInstallCatalogInput): Promise<SdkworkInstallCatalogData>;
  getEmptyCatalog(input?: GetSdkworkInstallCatalogInput): SdkworkInstallCatalogData;
}

function normalizeText(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function cloneVariant(variant: SdkworkInstallVariant): SdkworkInstallVariant {
  return {
    ...variant,
    dependencies: variant.dependencies.map((dependency) => ({
      ...dependency,
    })),
    tags: [...variant.tags],
  };
}

function applyRuntimeSignals(
  variant: SdkworkInstallVariant,
  runtimeContext: SdkworkInstallRuntimeContext,
): SdkworkInstallVariant {
  const nextVariant = cloneVariant(variant);

  nextVariant.dependencies = nextVariant.dependencies.map((dependency) => {
    if (dependency.id === "container-runtime") {
      if (runtimeContext.hasContainerRuntime === false) {
        return {
          ...dependency,
          autoFixAvailable: true,
          detail: "Container runtime is not available on this host yet",
          status: "warning",
        };
      }
    }

    if (dependency.id === "nodejs" && runtimeContext.nodeAvailable === false) {
      return {
        ...dependency,
        autoFixAvailable: true,
        detail: "Node.js runtime is missing and tooling install will remain limited",
        status: "warning",
      };
    }

    if (dependency.id === "core-runtime" && runtimeContext.runtimeReady === false) {
      return {
        ...dependency,
        autoFixAvailable: true,
        detail: "Core runtime must be installed before app payload install",
        status: "blocked",
      };
    }

    return dependency;
  });

  if (!nextVariant.hostPlatforms.includes(runtimeContext.hostPlatform)) {
    nextVariant.dependencies.push({
      autoFixAvailable: false,
      detail: `${runtimeContext.hostPlatform} is not supported by this install variant`,
      id: `host-${runtimeContext.hostPlatform}`,
      label: "Host compatibility",
      status: "blocked",
    });
    nextVariant.recommended = false;
  }

  return nextVariant;
}

function scoreVariant(
  variant: SdkworkInstallVariant,
  preferredTargetKind: SdkworkInstallTargetKind | undefined,
): number {
  const readiness = summarizeSdkworkInstallReadiness(variant.dependencies);
  return Number(variant.recommended) * 20
    + Number(variant.targetKind === preferredTargetKind) * 12
    - readiness.blockedDependencies * 30
    - readiness.warningDependencies * 6;
}

function resolveSelectedVariant(
  variants: readonly SdkworkInstallVariant[],
  selectedVariantId: string | null | undefined,
  preferredTargetKind: SdkworkInstallTargetKind | undefined,
): SdkworkInstallVariant | null {
  if (selectedVariantId) {
    return variants.find((variant) => variant.id === selectedVariantId) ?? null;
  }

  const ranked = [...variants].sort(
    (left, right) =>
      scoreVariant(right, preferredTargetKind) - scoreVariant(left, preferredTargetKind)
      || left.title.localeCompare(right.title),
  );

  return ranked[0] ?? null;
}

function resolveAssessmentStatus(blockedDependencies: number): SdkworkInstallAssessmentStatus {
  return blockedDependencies > 0 ? "blocked" : "ready";
}

function resolveStepFlow(readinessStatus: ReturnType<typeof summarizeSdkworkInstallReadiness>): SdkworkInstallStep[] {
  if (readinessStatus.status === "blocked") {
    return createSdkworkInstallStepFlow({
      assessmentStatus: "blocked",
      configurationStatus: "idle",
      dependenciesStatus: "error",
      initializationStatus: "idle",
      installStatus: "idle",
    });
  }

  return createSdkworkInstallStepFlow({
    assessmentStatus: resolveAssessmentStatus(readinessStatus.blockedDependencies),
    configurationStatus: "idle",
    dependenciesStatus: "success",
    initializationStatus: "idle",
    installStatus: "idle",
  });
}

function resolveVariants(
  variants: readonly SdkworkInstallVariant[],
  targetKind: SdkworkInstallTargetKind | undefined,
): SdkworkInstallVariant[] {
  const filtered = targetKind ? variants.filter((variant) => variant.targetKind === targetKind) : variants;
  return sortSdkworkInstallVariants(filtered);
}

function createCatalog(
  input: {
    basePath?: string;
    hostPlatform: SdkworkInstallHostPlatform;
    isAuthenticated: boolean;
    targetKind?: SdkworkInstallTargetKind;
    variants: readonly SdkworkInstallVariant[];
  },
  selectedVariantId?: string | null,
): SdkworkInstallCatalogData {
  const variants = resolveVariants(input.variants, input.targetKind);
  const selectedVariant = resolveSelectedVariant(variants, selectedVariantId, input.targetKind);
  const readiness = summarizeSdkworkInstallReadiness(selectedVariant?.dependencies ?? []);
  const steps = resolveStepFlow(readiness);
  const catalog = createEmptySdkworkInstallCatalog({
    basePath: input.basePath,
    hostPlatform: input.hostPlatform,
    isAuthenticated: input.isAuthenticated,
    selectedVariantId: selectedVariant?.id ?? null,
    steps,
    variants,
  });

  catalog.readiness = readiness;
  catalog.progress = summarizeSdkworkInstallProgress(steps);
  catalog.recommendedVariantId = selectedVariant?.id ?? null;
  catalog.recommendedInstallPath = selectedVariant?.installPath
    ?? resolveSdkworkRecommendedInstallPath(input.hostPlatform, input.targetKind ?? "app");

  return catalog;
}

export function createSdkworkInstallService(
  options: CreateSdkworkInstallServiceOptions = {},
): SdkworkInstallService {
  const getSessionTokens = options.getSessionTokens ?? (() => readPcReactRuntimeSession());
  const getRuntimeContext = options.getRuntimeContext ?? (() => ({
    hasContainerRuntime: true,
    hostPlatform: "windows" as const,
    nodeAvailable: true,
    runtimeReady: true,
  }));

  return {
    getEmptyCatalog(input = {}) {
      const runtimeContext = getRuntimeContext();
      const hasSession = Boolean(normalizeText(getSessionTokens().authToken));
      const baseVariants = options.variants ?? [];
      const variants = baseVariants.map((variant) => applyRuntimeSignals(variant, runtimeContext));
      const fallbackCatalog = variants.length === 0
        ? createEmptySdkworkInstallCatalog({
            basePath: input.basePath,
            hostPlatform: runtimeContext.hostPlatform,
            isAuthenticated: hasSession,
          })
        : createCatalog(
            {
              basePath: input.basePath,
              hostPlatform: runtimeContext.hostPlatform,
              isAuthenticated: hasSession,
              targetKind: input.targetKind,
              variants,
            },
            input.variantId,
          );

      return fallbackCatalog;
    },

    async getCatalog(input = {}) {
      const runtimeContext = getRuntimeContext();
      const hasSession = Boolean(normalizeText(getSessionTokens().authToken));
      const baseCatalog = this.getEmptyCatalog({
        ...input,
      });
      const baseVariants = options.variants ?? baseCatalog.variants;
      const variants = baseVariants.map((variant) => applyRuntimeSignals(variant, runtimeContext));

      return createCatalog(
        {
          basePath: input.basePath,
          hostPlatform: runtimeContext.hostPlatform,
          isAuthenticated: hasSession,
          targetKind: input.targetKind,
          variants,
        },
        input.variantId ?? baseCatalog.selectedVariantId,
      );
    },
  };
}

export const sdkworkInstallService = createSdkworkInstallService();
