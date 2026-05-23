export type SdkworkInstallHostPlatform = "linux" | "macos" | "windows";
export type SdkworkInstallTargetKind = "app" | "runtime" | "tooling";
export type SdkworkInstallRuntimePlatform = "container" | "native" | "wsl";
export type SdkworkInstallDependencyStatus = "blocked" | "ready" | "warning";
export type SdkworkInstallReadinessStatus = "blocked" | "ready" | "warning";
export type SdkworkInstallStepStatus = "blocked" | "completed" | "pending" | "ready" | "running" | "warning";
export type SdkworkInstallAssessmentStatus = "blocked" | "error" | "idle" | "loading" | "ready";
export type SdkworkInstallActionStatus = "error" | "idle" | "running" | "success";
export type SdkworkInstallStepId = "configure" | "dependencies" | "initialize" | "install" | "verify";
export type SdkworkInstallRouteSection = "overview" | "steps" | "variants";

export interface SdkworkInstallWorkspaceManifest extends SdkworkInstallCapabilityManifest {
  capability: "install";
  routePath: string;
}

export interface SdkworkInstallCapabilityManifest {
  description: string;
  host?: string;
  id: string;
  packageNames: string[];
  theme?: string;
  title: string;
}

export interface CreateInstallWorkspaceManifestOptions
  extends Partial<
    Pick<SdkworkInstallCapabilityManifest, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkInstallRouteIntent {
  focusWindow: boolean;
  route: string;
  section?: SdkworkInstallRouteSection;
  source: "install-workspace";
  stepId?: SdkworkInstallStepId;
  targetKind?: SdkworkInstallTargetKind;
  type: "install-route-intent";
  variantId?: string;
}

export interface CreateInstallRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  section?: SdkworkInstallRouteSection;
  stepId?: SdkworkInstallStepId;
  targetKind?: SdkworkInstallTargetKind;
  variantId?: string;
}

export interface SdkworkInstallDependency {
  autoFixAvailable: boolean;
  detail: string;
  id: string;
  label: string;
  status: SdkworkInstallDependencyStatus;
}

export interface SdkworkInstallVariant {
  dependencies: SdkworkInstallDependency[];
  description: string;
  estimatedMinutes: number;
  hostPlatforms: SdkworkInstallHostPlatform[];
  id: string;
  installPath: string;
  recommended: boolean;
  route: string;
  runtimePlatform: SdkworkInstallRuntimePlatform;
  tags: string[];
  targetKind: SdkworkInstallTargetKind;
  title: string;
}

export interface SdkworkInstallStep {
  description: string;
  id: SdkworkInstallStepId;
  progressPercent: number;
  status: SdkworkInstallStepStatus;
  title: string;
}

export interface SdkworkInstallReadinessSummary {
  blockedDependencies: number;
  readyDependencies: number;
  status: SdkworkInstallReadinessStatus;
  totalDependencies: number;
  warningDependencies: number;
}

export interface SdkworkInstallProgressSummary {
  blockedSteps: number;
  completedSteps: number;
  pendingSteps: number;
  progressPercent: number;
  runningStepId: SdkworkInstallStepId | null;
  totalSteps: number;
  warningSteps: number;
}

export interface SdkworkInstallCatalogData {
  hostPlatform: SdkworkInstallHostPlatform;
  isAuthenticated: boolean;
  progress: SdkworkInstallProgressSummary;
  readiness: SdkworkInstallReadinessSummary;
  recommendedInstallPath: string;
  recommendedVariantId: string | null;
  routeIntents: {
    overview: SdkworkInstallRouteIntent;
    steps: SdkworkInstallRouteIntent;
    variants: SdkworkInstallRouteIntent;
  };
  selectedVariantId: string | null;
  steps: SdkworkInstallStep[];
  targetSummary: Record<SdkworkInstallTargetKind, number>;
  variants: SdkworkInstallVariant[];
}

export interface CreateSdkworkInstallStepFlowOptions {
  assessmentStatus: SdkworkInstallAssessmentStatus;
  configurationStatus: SdkworkInstallActionStatus;
  dependenciesStatus: SdkworkInstallActionStatus;
  initializationStatus: SdkworkInstallActionStatus;
  installStatus: SdkworkInstallActionStatus;
}

export interface CreateEmptySdkworkInstallCatalogOptions {
  basePath?: string;
  hostPlatform?: SdkworkInstallHostPlatform;
  isAuthenticated?: boolean;
  selectedVariantId?: string | null;
  steps?: readonly SdkworkInstallStep[];
  variants?: readonly SdkworkInstallVariant[];
}

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/install").trim();
  if (!normalized || normalized === "/") {
    return "/install";
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

function createSdkworkInstallCapabilityManifest(
  options: SdkworkInstallCapabilityManifest,
): SdkworkInstallCapabilityManifest {
  return {
    description: options.description,
    ...(options.host ? { host: options.host } : {}),
    id: options.id,
    packageNames: [...options.packageNames],
    ...(options.theme ? { theme: options.theme } : {}),
    title: options.title,
  };
}

function roundPercentage(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

function resolveWindowsInstallPath(targetKind: SdkworkInstallTargetKind): string {
  if (targetKind === "runtime") {
    return "C:\\SDKWORK\\Runtime";
  }

  if (targetKind === "tooling") {
    return "C:\\SDKWORK\\Tooling";
  }

  return "C:\\SDKWORK\\Apps";
}

function resolveUnixInstallPath(targetKind: SdkworkInstallTargetKind): string {
  if (targetKind === "runtime") {
    return "/opt/sdkwork/runtime";
  }

  if (targetKind === "tooling") {
    return "/opt/sdkwork/tooling";
  }

  return "/opt/sdkwork/apps";
}

export function resolveSdkworkRecommendedInstallPath(
  hostPlatform: SdkworkInstallHostPlatform,
  targetKind: SdkworkInstallTargetKind,
): string {
  return hostPlatform === "windows"
    ? resolveWindowsInstallPath(targetKind)
    : resolveUnixInstallPath(targetKind);
}

function createDependency(
  id: string,
  label: string,
  detail: string,
  status: SdkworkInstallDependencyStatus = "ready",
  autoFixAvailable = false,
): SdkworkInstallDependency {
  return {
    autoFixAvailable,
    detail,
    id,
    label,
    status,
  };
}

export function createDefaultSdkworkInstallVariants(
  hostPlatform: SdkworkInstallHostPlatform = "windows",
): SdkworkInstallVariant[] {
  return [
    {
      dependencies: [
        createDependency("disk-space", "Disk space", "At least 2 GB available"),
        createDependency("network", "Network", "Outbound HTTPS access to package mirrors"),
      ],
      description: "Install desktop applications and managed runtime hooks in one guided flow.",
      estimatedMinutes: 6,
      hostPlatforms: ["windows", "macos", "linux"],
      id: "app-installer",
      installPath: resolveSdkworkRecommendedInstallPath(hostPlatform, "app"),
      recommended: true,
      route: "/install?variantId=app-installer",
      runtimePlatform: "native",
      tags: ["app", "guided"],
      targetKind: "app",
      title: "Desktop App Installer",
    },
    {
      dependencies: [
        createDependency("container-runtime", "Container runtime", "Docker or compatible engine available"),
        createDependency("network", "Network", "Access to distribution mirrors"),
      ],
      description: "Prepare runtime containers, base images, and launch scripts for services.",
      estimatedMinutes: 9,
      hostPlatforms: ["windows", "linux"],
      id: "runtime-docker",
      installPath: resolveSdkworkRecommendedInstallPath(hostPlatform, "runtime"),
      recommended: false,
      route: "/install?variantId=runtime-docker",
      runtimePlatform: "container",
      tags: ["runtime", "docker"],
      targetKind: "runtime",
      title: "Container Runtime",
    },
    {
      dependencies: [
        createDependency("nodejs", "Node.js", "Node.js 20+ for tooling workflows"),
        createDependency("git", "Git", "Git client for update and plugin workflows"),
      ],
      description: "Install CLI tooling, package hooks, and automation scripts for operators.",
      estimatedMinutes: 4,
      hostPlatforms: ["windows", "macos", "linux"],
      id: "tooling-cli",
      installPath: resolveSdkworkRecommendedInstallPath(hostPlatform, "tooling"),
      recommended: false,
      route: "/install?variantId=tooling-cli",
      runtimePlatform: "native",
      tags: ["tooling", "cli"],
      targetKind: "tooling",
      title: "CLI Tooling",
    },
  ];
}

export function sortSdkworkInstallVariants(
  variants: readonly SdkworkInstallVariant[],
): SdkworkInstallVariant[] {
  const rank: Record<SdkworkInstallTargetKind, number> = {
    app: 0,
    runtime: 1,
    tooling: 2,
  };

  return [...variants].sort(
    (left, right) =>
      Number(right.recommended) - Number(left.recommended)
      || rank[left.targetKind] - rank[right.targetKind]
      || left.title.localeCompare(right.title),
  );
}

export function summarizeSdkworkInstallReadiness(
  dependencies: readonly SdkworkInstallDependency[],
): SdkworkInstallReadinessSummary {
  const summary = dependencies.reduce(
    (state, dependency) => {
      if (dependency.status === "blocked") {
        state.blockedDependencies += 1;
      } else if (dependency.status === "warning") {
        state.warningDependencies += 1;
      } else {
        state.readyDependencies += 1;
      }
      return state;
    },
    {
      blockedDependencies: 0,
      readyDependencies: 0,
      warningDependencies: 0,
    },
  );

  let status: SdkworkInstallReadinessStatus = "ready";
  if (summary.blockedDependencies > 0) {
    status = "blocked";
  } else if (summary.warningDependencies > 0) {
    status = "warning";
  }

  return {
    ...summary,
    status,
    totalDependencies: dependencies.length,
  };
}

function createStep(
  id: SdkworkInstallStepId,
  title: string,
  description: string,
  status: SdkworkInstallStepStatus,
  progressPercent?: number,
): SdkworkInstallStep {
  const progressByStatus: Record<SdkworkInstallStepStatus, number> = {
    blocked: 0,
    completed: 100,
    pending: 0,
    ready: 0,
    running: 35,
    warning: 80,
  };

  return {
    description,
    id,
    progressPercent: roundPercentage(progressPercent ?? progressByStatus[status]),
    status,
    title,
  };
}

export function createSdkworkInstallStepFlow(
  input: CreateSdkworkInstallStepFlowOptions,
): SdkworkInstallStep[] {
  const dependenciesStatus: SdkworkInstallStepStatus =
    input.assessmentStatus === "loading" || input.dependenciesStatus === "running"
      ? "running"
      : input.assessmentStatus === "blocked" || input.assessmentStatus === "error"
        ? "blocked"
        : input.dependenciesStatus === "success"
          ? "completed"
          : input.dependenciesStatus === "error"
            ? "warning"
            : "ready";

  const installStatus: SdkworkInstallStepStatus =
    dependenciesStatus === "blocked"
      ? "pending"
      : input.installStatus === "running"
        ? "running"
        : input.installStatus === "success"
          ? "completed"
          : input.installStatus === "error"
            ? "warning"
            : dependenciesStatus === "completed"
              ? "ready"
              : "pending";

  const configureStatus: SdkworkInstallStepStatus =
    installStatus !== "completed"
      ? "pending"
      : input.configurationStatus === "running"
        ? "running"
        : input.configurationStatus === "success"
          ? "completed"
          : input.configurationStatus === "error"
            ? "warning"
            : "ready";

  const initializeStatus: SdkworkInstallStepStatus =
    configureStatus !== "completed"
      ? "pending"
      : input.initializationStatus === "running"
        ? "running"
        : input.initializationStatus === "success"
          ? "completed"
          : input.initializationStatus === "error"
            ? "warning"
            : "ready";

  const verifyStatus: SdkworkInstallStepStatus = initializeStatus === "completed" ? "ready" : "pending";

  return [
    createStep(
      "dependencies",
      "Dependencies",
      "Validate runtime and package prerequisites before installation starts.",
      dependenciesStatus,
    ),
    createStep(
      "install",
      "Install",
      "Apply package assets for the selected install target and variant.",
      installStatus,
    ),
    createStep(
      "configure",
      "Configure",
      "Write configuration defaults and environment integration settings.",
      configureStatus,
    ),
    createStep(
      "initialize",
      "Initialize",
      "Initialize local state, caches, and runtime startup scripts.",
      initializeStatus,
    ),
    createStep(
      "verify",
      "Verify",
      "Run health checks and route into next actions.",
      verifyStatus,
    ),
  ];
}

export function summarizeSdkworkInstallProgress(
  steps: readonly SdkworkInstallStep[],
): SdkworkInstallProgressSummary {
  const counters = steps.reduce(
    (state, step) => {
      if (step.status === "completed") {
        state.completedSteps += 1;
      } else if (step.status === "blocked") {
        state.blockedSteps += 1;
      } else if (step.status === "warning") {
        state.warningSteps += 1;
      } else {
        state.pendingSteps += 1;
      }

      if (step.status === "running") {
        state.runningStepId = step.id;
      }

      state.accumulatedProgress += step.progressPercent;
      return state;
    },
    {
      accumulatedProgress: 0,
      blockedSteps: 0,
      completedSteps: 0,
      pendingSteps: 0,
      runningStepId: null as SdkworkInstallStepId | null,
      warningSteps: 0,
    },
  );

  return {
    blockedSteps: counters.blockedSteps,
    completedSteps: counters.completedSteps,
    pendingSteps: counters.pendingSteps,
    progressPercent: steps.length > 0 ? roundPercentage(counters.accumulatedProgress / steps.length) : 0,
    runningStepId: counters.runningStepId,
    totalSteps: steps.length,
    warningSteps: counters.warningSteps,
  };
}

export function createInstallWorkspaceManifest({
  description = "Install center workspace for deterministic target resolution, dependency readiness, guided steps, and reusable route intents.",
  host,
  id = "sdkwork-install",
  packageNames = [
    "@sdkwork/install-pc-react",
    "@sdkwork/distribution-pc-react",
  ],
  routePath = "/install",
  theme,
  title = "Install Center",
}: CreateInstallWorkspaceManifestOptions = {}): SdkworkInstallWorkspaceManifest {
  return {
    ...createSdkworkInstallCapabilityManifest({
      description,
      host,
      id,
      packageNames,
      theme,
      title,
    }),
    capability: "install",
    routePath: normalizeBasePath(routePath),
  };
}

export function createInstallRouteIntent(
  options: CreateInstallRouteIntentOptions = {},
): SdkworkInstallRouteIntent {
  const basePath = normalizeBasePath(options.basePath);
  const queryParams = new URLSearchParams();

  if (options.section) {
    queryParams.set("section", options.section);
  }

  if (options.targetKind) {
    queryParams.set("targetKind", options.targetKind);
  }

  if (options.variantId) {
    queryParams.set("variantId", options.variantId);
  }

  if (options.stepId) {
    queryParams.set("stepId", options.stepId);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    focusWindow: options.focusWindow !== false,
    ...(options.section ? { section: options.section } : {}),
    ...(options.stepId ? { stepId: options.stepId } : {}),
    ...(options.targetKind ? { targetKind: options.targetKind } : {}),
    route: `${basePath}${querySuffix}`,
    source: "install-workspace",
    type: "install-route-intent",
    ...(options.variantId ? { variantId: options.variantId } : {}),
  };
}

function buildTargetSummary(variants: readonly SdkworkInstallVariant[]): Record<SdkworkInstallTargetKind, number> {
  return variants.reduce(
    (summary, variant) => {
      summary[variant.targetKind] += 1;
      return summary;
    },
    {
      app: 0,
      runtime: 0,
      tooling: 0,
    },
  );
}

function resolveSelectedVariant(
  variants: readonly SdkworkInstallVariant[],
  selectedVariantId: string | null | undefined,
): SdkworkInstallVariant | null {
  if (selectedVariantId) {
    return variants.find((variant) => variant.id === selectedVariantId) ?? null;
  }

  return variants.find((variant) => variant.recommended) ?? variants[0] ?? null;
}

export function createEmptySdkworkInstallCatalog(
  options: CreateEmptySdkworkInstallCatalogOptions = {},
): SdkworkInstallCatalogData {
  const hostPlatform = options.hostPlatform ?? "windows";
  const variants = sortSdkworkInstallVariants(
    options.variants ?? createDefaultSdkworkInstallVariants(hostPlatform),
  );
  const selectedVariant = resolveSelectedVariant(variants, options.selectedVariantId);
  const dependencies = selectedVariant?.dependencies ?? [];
  const readiness = summarizeSdkworkInstallReadiness(dependencies);
  const steps = options.steps
    ? [...options.steps]
    : createSdkworkInstallStepFlow({
        assessmentStatus: "ready",
        configurationStatus: "idle",
        dependenciesStatus: "success",
        initializationStatus: "idle",
        installStatus: "idle",
      });
  const progress = summarizeSdkworkInstallProgress(steps);
  const recommendedTargetKind = selectedVariant?.targetKind ?? "app";
  const recommendedInstallPath = selectedVariant?.installPath
    ?? resolveSdkworkRecommendedInstallPath(hostPlatform, recommendedTargetKind);
  const basePath = options.basePath ?? "/install";

  return {
    hostPlatform,
    isAuthenticated: Boolean(options.isAuthenticated),
    progress,
    readiness,
    recommendedInstallPath,
    recommendedVariantId: selectedVariant?.id ?? null,
    routeIntents: {
      overview: createInstallRouteIntent({
        basePath,
      }),
      steps: createInstallRouteIntent({
        basePath,
        section: "steps",
      }),
      variants: createInstallRouteIntent({
        basePath,
        section: "variants",
      }),
    },
    selectedVariantId: selectedVariant?.id ?? null,
    steps,
    targetSummary: buildTargetSummary(variants),
    variants,
  };
}

export const installPackageMeta = {
  architecture: "pc-react",
  domain: "device",
  package: "@sdkwork/install-pc-react",
  status: "ready",
} as const;

export type InstallPackageMeta = typeof installPackageMeta;
