import assert from "node:assert/strict";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { readMediaResourceUrl, toExternalUrlMediaResource } from "./packages/sdkwork-claw-router-commons/src/media-resource.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import {
  AdminSkillService,
  createSkillPackageInputFromForm,
  createSkillCategoryInputFromForm,
  createSkillArtifactInputFromForm,
  createSkillAssetInputFromForm,
  createSkillInputFromForm,
  updateSkillCategoryInputFromForm,
  updateSkillArtifactInputFromForm,
  updateSkillAssetInputFromForm,
  updateSkillPackageInputFromForm,
  updateSkillInputFromForm,
} from "./packages/sdkwork-claw-router-admin-skill/src/skillService.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type CapturedBackendRequest = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
};

function mediaResource(
  url: string,
  kind: "image" | "video" | "audio" | "archive" | "document" | "other" = "image",
) {
  const resource = toExternalUrlMediaResource(url, kind);
  assert.ok(resource, `expected media resource for ${url}`);
  return resource;
}

async function withBackendSdkFetch<T>(
  handler: (url: string, init?: RequestInit) => unknown,
  fn: (captured: CapturedBackendRequest[]) => Promise<T>,
): Promise<T> {
  const captured: CapturedBackendRequest[] = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    enumerable: true,
    value: {
      dispatchEvent: () => true,
    },
  });
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    const body = typeof init?.body === "string" ? init.body : "";
    const headers = Object.fromEntries(new Headers(init?.headers).entries());
    captured.push({
      url,
      method: init?.method ?? "GET",
      headers,
      body,
    });
    const result = handler(url, init);
    return new Response(JSON.stringify({ code: "2000", data: result }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  clearStoredAppSessionToken();
  resetClawRouterSdkClients();

  try {
    return await fn(captured);
  } finally {
    clearStoredAppSessionToken();
    resetClawRouterSdkClients();
    globalThis.fetch = originalFetch;
    if (originalWindowDescriptor) {
      Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    } else {
      delete (globalThis as { window?: Window }).window;
    }
  }
}

function sampleSkill(overrides: Record<string, unknown> = {}) {
  return {
    id: "8101",
    skillKey: "research_brief",
    name: "Research Brief",
    summary: "Summarize research material",
    description: "Produces concise research briefs.",
    icon: "/skills/research.svg",
    coverImage: "/skills/research-cover.png",
    categoryId: "1901",
    packageId: "7101",
    provider: "sdkwork",
    version: "1.0.0",
    versionName: "Initial",
    runtime: "agent-skill",
    entrypoint: "skill.json",
    manifestUrl: "artifact://skills/research/manifest.json",
    repositoryUrl: "https://example.com/research",
    homepageUrl: "https://example.com/research/home",
    documentationUrl: "https://example.com/research/docs",
    licenseName: "MIT",
    sourceType: "OFFICIAL",
    marketStatus: "DRAFT",
    visibility: "PUBLIC",
    reviewStatus: "PENDING",
    reviewComment: "",
    reviewedBy: "",
    reviewedAt: "",
    builtin: false,
    isBuiltin: false,
    enabled: true,
    featured: false,
    recommendWeight: 10,
    price: "0",
    currency: "CNY",
    installCount: "12",
    ratingAvg: "4.8",
    ratingCount: "5",
    tags: ["research", "brief"],
    capabilities: ["summarize"],
    configSchema: { type: "object" },
    defaultConfig: { tone: "concise" },
    latestPublishedAt: "",
    createdAt: "2026-05-09T00:00:00Z",
    updatedAt: "2026-05-09T00:00:00Z",
    ...overrides,
  };
}

function samplePackage(overrides: Record<string, unknown> = {}) {
  return {
    id: "7101",
    packageKey: "agent_productivity",
    name: "Agent Productivity",
    summary: "Curated productivity skills",
    description: "A package for agent productivity workflows.",
    icon: "/skills/packages/productivity.svg",
    coverImage: "/skills/packages/productivity-cover.png",
    categoryId: "1901",
    enabled: true,
    featured: true,
    sortWeight: 30,
    tags: ["agent", "productivity"],
    latestPublishedAt: "",
    createdAt: "2026-05-09T00:00:00Z",
    updatedAt: "2026-05-09T00:00:00Z",
    ...overrides,
  };
}

function sampleCategory(overrides: Record<string, unknown> = {}) {
  return {
    id: "1901",
    name: "Productivity",
    description: "Agent productivity",
    code: "productivity",
    icon: "/icons/productivity.svg",
    sortWeight: 1,
    parentId: "",
    path: "/skills/productivity",
    visible: true,
    status: 1,
    type: 19,
    ...overrides,
  };
}

function sampleAsset(overrides: Record<string, unknown> = {}) {
  return {
    id: "9101",
    skillId: "8101",
    targetType: 35,
    targetId: "8101",
    artifactId: null,
    assetType: 1,
    asset: mediaResource("https://cdn.example.test/skills/research/cover.png", "other"),
    thumbnail: mediaResource("https://cdn.example.test/skills/research/thumb.png"),
    title: "Skill cover",
    altText: "Skill marketplace cover",
    mimeType: "image/png",
    width: 1200,
    height: 720,
    durationSeconds: null,
    fileSize: "182000",
    sortOrder: 10,
    status: 1,
    publishedAt: "2026-05-09T00:00:00Z",
    createdAt: "2026-05-09T00:00:00Z",
    updatedAt: "2026-05-09T00:00:00Z",
    ...overrides,
  };
}

function sampleArtifact(overrides: Record<string, unknown> = {}) {
  return {
    id: "9201",
    skillId: "8101",
    targetType: 35,
    targetId: "8101",
    artifactType: 1,
    version: "1.0.0",
    platformType: "agent",
    osName: "runtime",
    artifactRef: "builtin://sdkwork.skills.research_brief@1.0.0",
    artifact: mediaResource("data/skills/artifacts/research-brief-1.0.0.json", "archive"),
    artifactSizeBytes: "2048",
    runtime: "builtin",
    frameworks: ["Rust service", "OpenAI-compatible"],
    licenseName: "SDKWork Commercial",
    checksumHash: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    releaseNotes: "Initial release.",
    status: 1,
    publishedAt: "2026-05-09T00:00:00Z",
    deprecatedAt: null,
    createdAt: "2026-05-09T00:00:00Z",
    updatedAt: "2026-05-09T00:00:00Z",
    ...overrides,
  };
}

test("admin skill form helpers create normalized backend DTOs", () => {
  const categoryForm = new FormData();
  categoryForm.set("name", " Productivity ");
  categoryForm.set("code", " productivity ");
  categoryForm.set("description", " Agent productivity ");
  categoryForm.set("sortWeight", "12");
  categoryForm.set("visible", "true");
  categoryForm.set("status", "1");
  categoryForm.set("type", "19");

  assert.deepEqual(createSkillCategoryInputFromForm(categoryForm), {
    name: "Productivity",
    code: "productivity",
    description: "Agent productivity",
    sortWeight: 12,
    visible: true,
    status: 1,
    type: 19,
  });

  const packageForm = new FormData();
  packageForm.set("packageKey", " agent_productivity ");
  packageForm.set("name", " Agent Productivity ");
  packageForm.set("summary", " Curated productivity ");
  packageForm.set("categoryId", "1901");
  packageForm.set("enabled", "true");
  packageForm.set("featured", "true");
  packageForm.set("sortWeight", "30");
  packageForm.set("tags", "agent, productivity, agent");

  assert.deepEqual(createSkillPackageInputFromForm(packageForm), {
    packageKey: "agent_productivity",
    name: "Agent Productivity",
    summary: "Curated productivity",
    categoryId: "1901",
    enabled: true,
    featured: true,
    sortWeight: 30,
    tags: ["agent", "productivity"],
  });

  const skillForm = new FormData();
  skillForm.set("skillKey", " research_brief ");
  skillForm.set("name", " Research Brief ");
  skillForm.set("summary", " Summarize research ");
  skillForm.set("categoryId", "1901");
  skillForm.set("provider", " sdkwork ");
  skillForm.set("version", " 1.0.0 ");
  skillForm.set("runtime", " agent-skill ");
  skillForm.set("entrypoint", " skill.json ");
  skillForm.set("licenseName", " MIT ");
  skillForm.set("tags", "research, brief, research");
  skillForm.set("capabilities", "summarize,extract");
  skillForm.set("configSchema", '{"type":"object"}');
  skillForm.set("defaultConfig", '{"tone":"concise"}');

  assert.deepEqual(createSkillInputFromForm(skillForm), {
    skillKey: "research_brief",
    name: "Research Brief",
    summary: "Summarize research",
    categoryId: "1901",
    provider: "sdkwork",
    version: "1.0.0",
    runtime: "agent-skill",
    entrypoint: "skill.json",
    licenseName: "MIT",
    tags: ["research", "brief"],
    capabilities: ["summarize", "extract"],
    configSchema: { type: "object" },
    defaultConfig: { tone: "concise" },
    sourceType: "COMMUNITY",
    marketStatus: "DRAFT",
    visibility: "PUBLIC",
    reviewStatus: "PENDING",
    enabled: true,
    featured: false,
    builtin: false,
    isBuiltin: false,
  });
});

test("admin skill update helper omits empty editable fields", () => {
  const categoryForm = new FormData();
  categoryForm.set("name", " Productivity Pro ");
  categoryForm.set("description", " ");
  categoryForm.set("parentId", "1900");
  categoryForm.set("sortWeight", "5");
  categoryForm.set("visible", "false");

  assert.deepEqual(updateSkillCategoryInputFromForm(categoryForm), {
    name: "Productivity Pro",
    parentId: "1900",
    sortWeight: 5,
    visible: false,
  });

  const form = new FormData();
  form.set("name", " Research Brief Pro ");
  form.set("summary", " ");
  form.set("categoryId", " ");
  form.set("tags", "analysis, research");

  assert.deepEqual(updateSkillInputFromForm(form), {
    name: "Research Brief Pro",
    tags: ["analysis", "research"],
  });

  const packageForm = new FormData();
  packageForm.set("name", " Productivity Pro ");
  packageForm.set("summary", " ");
  packageForm.set("categoryId", " ");
  packageForm.set("featured", "false");
  packageForm.set("tags", "workflow, quality");

  assert.deepEqual(updateSkillPackageInputFromForm(packageForm), {
    name: "Productivity Pro",
    featured: false,
    tags: ["workflow", "quality"],
  });

  const assetForm = new FormData();
  assetForm.set("title", " Skill cover ");
  assetForm.set("thumbnail", " ");
  assetForm.set("sortOrder", "20");
  assert.deepEqual(updateSkillAssetInputFromForm(assetForm), {
    title: "Skill cover",
    sortOrder: 20,
  });

  const artifactForm = new FormData();
  artifactForm.set("version", " 1.0.2 ");
  artifactForm.set("checksumHash", " ");
  artifactForm.set("frameworks", "Rust service, OpenAI-compatible, Rust service");
  assert.deepEqual(updateSkillArtifactInputFromForm(artifactForm), {
    version: "1.0.2",
    frameworks: ["Rust service", "OpenAI-compatible"],
  });
});

test("admin skill asset and artifact form helpers normalize marketplace resource DTOs", () => {
  const assetForm = new FormData();
  assetForm.set("artifactId", "9201");
  assetForm.set("assetType", "1");
  assetForm.set("asset", " artifact://skills/research/cover.png ");
  assetForm.set("thumbnail", " artifact://skills/research/cover-thumb.png ");
  assetForm.set("title", " Skill cover ");
  assetForm.set("altText", " Marketplace cover ");
  assetForm.set("mimeType", " image/png ");
  assetForm.set("width", "1200");
  assetForm.set("height", "630");
  assetForm.set("fileSize", "2048");
  assetForm.set("sortOrder", "10");
  assetForm.set("status", "1");

  assert.deepEqual(createSkillAssetInputFromForm(assetForm), {
    artifactId: "9201",
    assetType: 1,
    asset: mediaResource("artifact://skills/research/cover.png", "other"),
    thumbnail: mediaResource("artifact://skills/research/cover-thumb.png"),
    title: "Skill cover",
    altText: "Marketplace cover",
    mimeType: "image/png",
    width: 1200,
    height: 630,
    fileSize: 2048,
    sortOrder: 10,
    status: 1,
  });

  const artifactForm = new FormData();
  artifactForm.set("artifactType", "1");
  artifactForm.set("version", " 1.1.0 ");
  artifactForm.set("platformType", " agent ");
  artifactForm.set("osName", " runtime ");
  artifactForm.set("artifactRef", " builtin://sdkwork.skills.research_brief@1.1.0 ");
  artifactForm.set("artifact", " data/skills/artifacts/research-brief-1.1.0.json ");
  artifactForm.set("artifactSizeBytes", "4096");
  artifactForm.set("runtime", " builtin ");
  artifactForm.set("frameworks", "Rust service, OpenAI-compatible, Rust service");
  artifactForm.set("licenseName", " SDKWork Commercial ");
  artifactForm.set("checksumHash", "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef");
  artifactForm.set("releaseNotes", " Initial release ");
  artifactForm.set("status", "1");

  assert.deepEqual(createSkillArtifactInputFromForm(artifactForm), {
    artifactType: 1,
    version: "1.1.0",
    platformType: "agent",
    osName: "runtime",
    artifactRef: "builtin://sdkwork.skills.research_brief@1.1.0",
    artifact: mediaResource("data/skills/artifacts/research-brief-1.1.0.json", "archive"),
    artifactSizeBytes: 4096,
    runtime: "builtin",
    frameworks: ["Rust service", "OpenAI-compatible"],
    licenseName: "SDKWork Commercial",
    checksumHash: "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    releaseNotes: "Initial release",
    status: 1,
  });
});

test("admin skill form helpers reject negative control values before submit", () => {
  const categoryForm = new FormData();
  categoryForm.set("name", "Productivity");
  categoryForm.set("status", "-1");
  assert.throws(
    () => createSkillCategoryInputFromForm(categoryForm),
    /status must be a non-negative integer/,
  );

  const assetForm = new FormData();
  assetForm.set("asset", "artifact://skills/research/cover.png");
  assetForm.set("assetType", "-1");
  assert.throws(
    () => createSkillAssetInputFromForm(assetForm),
    /assetType must be a non-negative integer/,
  );

  const artifactForm = new FormData();
  artifactForm.set("artifact", "artifact://skills/research/skill.json");
  artifactForm.set("artifactType", "-1");
  assert.throws(
    () => createSkillArtifactInputFromForm(artifactForm),
    /artifactType must be a non-negative integer/,
  );
});

test("admin skill page exposes SDK-backed asset and artifact management surface", async () => {
  const source = await import("node:fs/promises").then((fs) =>
    fs.readFile(new URL("./packages/sdkwork-claw-router-admin-skill/src/index.tsx", import.meta.url), "utf8"),
  );

  for (const expected of [
    "openResourceManager",
    "SkillResourcesModal",
    "AdminSkillService.fetchSkillAssets",
    "AdminSkillService.createSkillAsset",
    "AdminSkillService.updateSkillAsset",
    "AdminSkillService.deleteSkillAsset",
    "AdminSkillService.fetchSkillArtifacts",
    "AdminSkillService.createSkillArtifact",
    "AdminSkillService.updateSkillArtifact",
    "AdminSkillService.deleteSkillArtifact",
    "createSkillAssetInputFromForm",
    "createSkillArtifactInputFromForm",
    "admin.skill.actions.manageResources",
  ]) {
    assert.ok(source.includes(expected), `missing admin skill resource management source marker: ${expected}`);
  }
});

test("admin skill page uses tabbed management sections and page-scoped i18n keys", async () => {
  const fs = await import("node:fs/promises");
  const source = await fs.readFile(
    new URL("./packages/sdkwork-claw-router-admin-skill/src/index.tsx", import.meta.url),
    "utf8",
  );
  const i18nSource = await fs.readFile(
    new URL("./packages/sdkwork-claw-router-i18n/src/resources/admin/skill.ts", import.meta.url),
    "utf8",
  );

  for (const expected of [
    "type SkillAdminTab = 'skills' | 'packages';",
    "const [activeTab, setActiveTab] = useState<SkillAdminTab>('skills');",
    'role="tablist"',
    'role="tab"',
    "aria-selected={activeTab === 'skills'}",
    "aria-selected={activeTab === 'packages'}",
    "activeTab === 'packages' ? (",
    "activeTab === 'skills' ? (",
  ]) {
    assert.ok(source.includes(expected), `missing tabbed admin skill source marker: ${expected}`);
  }

  for (const removed of [
    ">Agent Skills<",
    ">Skill Packages<",
    ">Skills<",
    "title=\"Loading packages\"",
    "title=\"No packages found\"",
    "title=\"Loading skills\"",
    "title=\"No skills found\"",
  ]) {
    assert.ok(!source.includes(removed), `admin skill page still hardcodes user-facing text: ${removed}`);
  }

  for (const key of [
    "admin.skill.tabs.skills",
    "admin.skill.tabs.packages",
    "admin.skill.actions.createSkill",
    "admin.skill.actions.createPackage",
    "admin.skill.filters.searchPlaceholder",
    "admin.skill.empty.noPackages",
    "admin.skill.empty.noSkills",
    "admin.skill.modals.skill.createTitle",
    "admin.skill.modals.package.createTitle",
    "admin.skill.resources.title",
  ]) {
    assert.ok(source.includes(`t('${key}'`), `admin skill page should consume i18n key ${key}`);
    assert.equal(
      i18nSource.split(`"${key}":`).length - 1,
      2,
      `admin skill i18n key ${key} must exist once in English and once in Chinese resources`,
    );
  }
});

test("admin skill page uses bottom pagination for skill and package lists", async () => {
  const fs = await import("node:fs/promises");
  const source = await fs.readFile(
    new URL("./packages/sdkwork-claw-router-admin-skill/src/index.tsx", import.meta.url),
    "utf8",
  );
  const i18nSource = await fs.readFile(
    new URL("./packages/sdkwork-claw-router-i18n/src/resources/admin/skill.ts", import.meta.url),
    "utf8",
  );

  for (const expected of [
    "data-admin-skill-pagination",
    "BottomPagination",
    "const [skillPage, setSkillPage] = useState(1);",
    "const [packagePage, setPackagePage] = useState(1);",
    "const [skillPageSize, setSkillPageSize] = useState(20);",
    "const [packagePageSize, setPackagePageSize] = useState(20);",
    "AdminSkillService.fetchSkillPackages(packageQuery)",
    "AdminSkillService.fetchSkills(skillQuery)",
    "page: skillPage,",
    "pageSize: skillPageSize,",
    "page: packagePage,",
    "pageSize: packagePageSize,",
    "hasNextPage={filteredSkills.length >= skillPageSize}",
    "hasNextPage={filteredPackages.length >= packagePageSize}",
  ]) {
    assert.ok(source.includes(expected), `missing admin skill pagination marker: ${expected}`);
  }

  for (const removed of [
    "AdminSkillService.fetchSkillPackages({ page: 1, pageSize: 100 })",
    "AdminSkillService.fetchSkills({ page: 1, pageSize: 100 })",
  ]) {
    assert.ok(!source.includes(removed), `admin skill page still uses fixed pagination: ${removed}`);
  }

  for (const key of [
    "admin.skill.pagination.showing",
    "admin.skill.pagination.page",
    "admin.skill.pagination.pageSize",
  ]) {
    assert.ok(source.includes(`t('${key}'`), `admin skill page should consume i18n key ${key}`);
    assert.equal(
      i18nSource.split(`"${key}":`).length - 1,
      2,
      `admin skill i18n key ${key} must exist once in English and once in Chinese resources`,
    );
  }
});

test("admin skill management tables fill the available admin viewport", async () => {
  const fs = await import("node:fs/promises");
  const source = await fs.readFile(
    new URL("./packages/sdkwork-claw-router-admin-skill/src/index.tsx", import.meta.url),
    "utf8",
  );

  for (const expected of [
    "AdminTableShell",
    'data-admin-skill="skill-management"',
    "data-admin-skill-table-card",
    "data-admin-skill-table-viewport",
    "data-admin-skill-pagination",
    "flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden",
    "data-admin-skill-layout className=\"grid min-h-0 min-w-0 flex-1 gap-4 overflow-hidden",
    "className=\"min-h-0 min-w-0 flex-1\"",
    "viewportClassName=\"min-h-0 flex-1\"",
    "footer={",
    "sticky top-0 z-10",
  ]) {
    assert.ok(source.includes(expected), `missing adaptive admin skill table marker: ${expected}`);
  }

  assert.ok(
    source.indexOf("data-admin-skill-table-viewport") < source.indexOf("data-admin-skill-pagination"),
    "admin skill pagination should render outside the scrollable table viewport",
  );
});

test("admin skill resource modal keeps resource tables in bounded internal viewports", async () => {
  const fs = await import("node:fs/promises");
  const source = await fs.readFile(
    new URL("./packages/sdkwork-claw-router-admin-skill/src/index.tsx", import.meta.url),
    "utf8",
  );

  for (const expected of [
    "data-admin-skill-resources-modal",
    "flex max-h-[92vh] min-h-0 w-full max-w-6xl flex-col overflow-hidden",
    "data-admin-skill-resources-modal-body",
    "custom-scrollbar min-h-0 flex-1 overflow-y-auto p-5",
    "data-admin-skill-resources-grid",
    "data-admin-skill-assets-table-viewport",
    "data-admin-skill-artifacts-table-viewport",
    "max-h-[min(420px,calc(92vh-220px))] overflow-auto",
  ]) {
    assert.ok(source.includes(expected), `missing bounded admin skill resource modal marker: ${expected}`);
  }
});

test("admin skill page uses a left category tree with CRUD and right-side tabs", async () => {
  const source = await import("node:fs/promises").then((fs) =>
    fs.readFile(new URL("./packages/sdkwork-claw-router-admin-skill/src/index.tsx", import.meta.url), "utf8"),
  );

  for (const expected of [
    "data-admin-skill-layout",
    "data-admin-skill-category-tree",
    "data-admin-skill-table-card",
    "data-admin-skill-table-header",
    "data-admin-skill-table-filters",
    "function SkillCategoryTree",
    "function buildCategoryTree",
    "function isCategoryInSelectedTree",
    "selectedCategoryId",
    "setSelectedCategoryId",
    "onCreateChild",
    "onEditCategory",
    "onDeleteCategory",
    "role=\"tablist\"",
    "activeTab === 'packages' ? openCreatePackage : openCreateSkill",
    "activeTab === 'packages' ? t('admin.skill.actions.createPackage') : t('admin.skill.actions.createSkill')",
  ]) {
    assert.ok(source.includes(expected), `missing admin skill category tree marker: ${expected}`);
  }

  for (const removed of [
    "<Metric label=",
    "admin.skill.metrics.total",
    "admin.skill.metrics.pendingReview",
    "admin.skill.subtitle",
    "admin.skill.sections.packages.description",
    "admin.skill.sections.skills.description",
    "value={categoryId}",
    "setCategoryId(event.target.value)",
  ]) {
    assert.ok(!source.includes(removed), `admin skill page still renders the old compact-only layout: ${removed}`);
  }
});

test("admin skill service calls generated backend SDK asset and artifact paths", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/ecosystem/skills/8101/assets" && method === "GET") {
        return { items: [sampleAsset()] };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/assets/9101" && method === "GET") {
        return { item: sampleAsset() };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/assets" && method === "POST") {
        return { item: sampleAsset({ id: "9102", title: "Created asset" }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/assets/9101" && method === "PUT") {
        return { item: sampleAsset({ title: "Updated asset", sortOrder: 20 }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/assets/9101" && method === "DELETE") {
        return { deleted: true };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/artifacts" && method === "GET") {
        return { items: [sampleArtifact()] };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/artifacts/9201" && method === "GET") {
        return { item: sampleArtifact() };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/artifacts" && method === "POST") {
        return { item: sampleArtifact({ id: "9202", version: "1.1.0" }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/artifacts/9201" && method === "PUT") {
        return { item: sampleArtifact({ version: "1.2.0", frameworks: ["Rust service"] }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/artifacts/9201" && method === "DELETE") {
        return { deleted: true };
      }
      throw new Error(`Unexpected request ${method} ${url}`);
    },
    async (captured) => {
      const assets = await AdminSkillService.fetchSkillAssets("8101");
      const asset = await AdminSkillService.getSkillAsset("8101", "9101");
      const createdAsset = await AdminSkillService.createSkillAsset("8101", {
        asset: mediaResource("artifact://skills/research/cover.png", "other"),
        thumbnail: mediaResource("artifact://skills/research/cover-thumb.png"),
        title: " Created asset ",
        altText: " Skill cover ",
        artifactId: "9201",
        assetType: 1,
        width: 1200,
        height: 630,
        fileSize: 2048,
        sortOrder: 10,
        status: 1,
      });
      const updatedAsset = await AdminSkillService.updateSkillAsset("8101", "9101", {
        title: " Updated asset ",
        thumbnail: null,
        sortOrder: 20,
      });
      const deletedAsset = await AdminSkillService.deleteSkillAsset("8101", "9101");

      const artifacts = await AdminSkillService.fetchSkillArtifacts("8101");
      const artifact = await AdminSkillService.getSkillArtifact("8101", "9201");
      const createdArtifact = await AdminSkillService.createSkillArtifact("8101", {
        version: " 1.1.0 ",
        platformType: " web ",
        osName: " any ",
        artifact: mediaResource("artifact://skills/research/skill.json", "archive"),
        artifactSizeBytes: 4096,
        runtime: " agent-skill ",
        frameworks: ["React portal", "Rust service", "React portal"],
        checksumHash: "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        status: 1,
      });
      const updatedArtifact = await AdminSkillService.updateSkillArtifact("8101", "9201", {
        version: "1.2.0",
        artifact: null,
        frameworks: ["Rust service"],
      });
      const deletedArtifact = await AdminSkillService.deleteSkillArtifact("8101", "9201");

      assert.equal(assets[0].title, "Skill cover");
      assert.equal(assets[0].fileSize, "182000");
      assert.equal(asset.artifactId, null);
      assert.equal(createdAsset.id, "9102");
      assert.equal(updatedAsset.sortOrder, 20);
      assert.equal(deletedAsset, true);
      assert.deepEqual(artifacts[0].frameworks, ["Rust service", "OpenAI-compatible"]);
      assert.equal(artifacts[0].artifactSizeBytes, "2048");
      assert.equal(artifact.checksumHash, "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      assert.equal(createdArtifact.version, "1.1.0");
      assert.deepEqual(updatedArtifact.frameworks, ["Rust service"]);
      assert.equal(deletedArtifact, true);

      assert.deepEqual(captured.map((request) => `${request.method} ${request.url}`), [
        "GET /backend/v3/api/ecosystem/skills/8101/assets",
        "GET /backend/v3/api/ecosystem/skills/8101/assets/9101",
        "POST /backend/v3/api/ecosystem/skills/8101/assets",
        "PUT /backend/v3/api/ecosystem/skills/8101/assets/9101",
        "DELETE /backend/v3/api/ecosystem/skills/8101/assets/9101",
        "GET /backend/v3/api/ecosystem/skills/8101/artifacts",
        "GET /backend/v3/api/ecosystem/skills/8101/artifacts/9201",
        "POST /backend/v3/api/ecosystem/skills/8101/artifacts",
        "PUT /backend/v3/api/ecosystem/skills/8101/artifacts/9201",
        "DELETE /backend/v3/api/ecosystem/skills/8101/artifacts/9201",
      ]);
      assert.deepEqual(JSON.parse(captured[2].body), {
        asset: mediaResource("artifact://skills/research/cover.png", "other"),
        thumbnail: mediaResource("artifact://skills/research/cover-thumb.png"),
        title: "Created asset",
        altText: "Skill cover",
        artifactId: "9201",
        assetType: 1,
        width: 1200,
        height: 630,
        fileSize: "2048",
        sortOrder: 10,
        status: 1,
      });
      assert.deepEqual(JSON.parse(captured[7].body), {
        version: "1.1.0",
        platformType: "web",
        osName: "any",
        artifact: mediaResource("artifact://skills/research/skill.json", "archive"),
        artifactSizeBytes: "4096",
        runtime: "agent-skill",
        frameworks: ["React portal", "Rust service"],
        checksumHash: "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        status: 1,
      });
      for (const request of captured) {
        assert.equal(request.headers["x-request-id"], undefined);
      }
    },
  );
});

test("admin skill service calls generated backend SDK paths and normalizes package and skill lifecycle state", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/ecosystem/skills/categories" && method === "GET") {
        return { items: [sampleCategory()] };
      }
      if (url === "/backend/v3/api/ecosystem/skills/categories/1901" && method === "PUT") {
        return { item: sampleCategory({ name: "Productivity Pro", sortWeight: 5 }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills/categories/1901" && method === "DELETE") {
        return { deleted: true };
      }
      if (url === "/backend/v3/api/ecosystem/skills?q=research&page=1&page_size=20" && method === "GET") {
        return { items: [sampleSkill()] };
      }
      if (url === "/backend/v3/api/ecosystem/skills/package?q=agent&enabled=true" && method === "GET") {
        return { items: [samplePackage()] };
      }
      if (url === "/backend/v3/api/ecosystem/skills/package/7101" && method === "GET") {
        return { item: samplePackage() };
      }
      if (url === "/backend/v3/api/ecosystem/skills/package" && method === "POST") {
        return { item: samplePackage({ id: "7201", packageKey: "quality_pack", name: "Quality Pack" }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills/package/7101" && method === "PUT") {
        return { item: samplePackage({ name: "Agent Productivity Pro", featured: false }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills/package/7101/disable" && method === "POST") {
        return { item: samplePackage({ enabled: false }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills/package/7101/enable" && method === "POST") {
        return { item: samplePackage({ enabled: true }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills/package/7101" && method === "DELETE") {
        return { deleted: true };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101" && method === "GET") {
        return { item: sampleSkill({ marketStatus: "PUBLISHED", reviewStatus: "APPROVED" }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills" && method === "POST") {
        return { item: sampleSkill({ id: "9001", skillKey: "draft_skill", name: "Draft Skill" }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101" && method === "PUT") {
        return { item: sampleSkill({ name: "Research Brief Pro" }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/assets" && method === "GET") {
        return { items: [sampleAsset()] };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/assets/9101" && method === "GET") {
        return { item: sampleAsset() };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/assets" && method === "POST") {
        return { item: sampleAsset({ id: "9102", title: "Skill demo cover" }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/assets/9101" && method === "PUT") {
        return { item: sampleAsset({ title: "Skill cover updated", thumbnail: null }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/assets/9101" && method === "DELETE") {
        return { deleted: true };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/artifacts" && method === "GET") {
        return { items: [sampleArtifact()] };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/artifacts/9201" && method === "GET") {
        return { item: sampleArtifact() };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/artifacts" && method === "POST") {
        return { item: sampleArtifact({ id: "9202", version: "1.0.1" }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/artifacts/9201" && method === "PUT") {
        return { item: sampleArtifact({ version: "1.0.2", checksumHash: null }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/artifacts/9201" && method === "DELETE") {
        return { deleted: true };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/review/approve" && method === "POST") {
        return { item: sampleSkill({ reviewStatus: "APPROVED", reviewComment: "Approved" }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/publish" && method === "POST") {
        return { item: sampleSkill({ marketStatus: "PUBLISHED", latestPublishedAt: "2026-05-09T01:00:00Z" }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101/disable" && method === "POST") {
        return { item: sampleSkill({ enabled: false }) };
      }
      if (url === "/backend/v3/api/ecosystem/skills/8101" && method === "DELETE") {
        return { deleted: true };
      }
      throw new Error(`Unexpected request ${method} ${url}`);
    },
    async (captured) => {
      const categories = await AdminSkillService.fetchSkillCategories();
      const updatedCategory = await AdminSkillService.updateSkillCategory("1901", {
        name: "Productivity Pro",
        sortWeight: 5,
      });
      const deletedCategory = await AdminSkillService.deleteSkillCategory("1901");
      const skills = await AdminSkillService.fetchSkills({ searchQuery: "research", page: 1, pageSize: 20 });
      const packages = await AdminSkillService.fetchSkillPackages({ searchQuery: "agent", enabled: true });
      const skillPackage = await AdminSkillService.getSkillPackage("7101");
      const createdPackage = await AdminSkillService.createSkillPackage({
        packageKey: "quality_pack",
        name: "Quality Pack",
      });
      const updatedPackage = await AdminSkillService.updateSkillPackage("7101", {
        name: "Agent Productivity Pro",
        featured: false,
      });
      const disabledPackage = await AdminSkillService.disableSkillPackage("7101");
      const enabledPackage = await AdminSkillService.enableSkillPackage("7101");
      const deletedPackage = await AdminSkillService.deleteSkillPackage("7101");
      const skill = await AdminSkillService.getSkill("8101");
      const created = await AdminSkillService.createSkill({
        skillKey: "draft_skill",
        name: "Draft Skill",
      });
      const updated = await AdminSkillService.updateSkill("8101", {
        name: "Research Brief Pro",
      });
      const assets = await AdminSkillService.fetchSkillAssets("8101");
      const asset = await AdminSkillService.getSkillAsset("8101", "9101");
      const createdAsset = await AdminSkillService.createSkillAsset("8101", {
        asset: mediaResource("https://cdn.example.test/skills/research/demo.png", "other"),
        thumbnail: mediaResource("https://cdn.example.test/skills/research/demo-thumb.png"),
        title: " Skill demo cover ",
        altText: " Skill demo ",
        mimeType: " image/png ",
        width: 1200,
        height: 720,
        fileSize: 182000,
        sortOrder: 20,
        status: 1,
      });
      const updatedAsset = await AdminSkillService.updateSkillAsset("8101", "9101", {
        title: " Skill cover updated ",
        thumbnail: null,
      });
      const deletedAsset = await AdminSkillService.deleteSkillAsset("8101", "9101");
      const artifacts = await AdminSkillService.fetchSkillArtifacts("8101");
      const artifact = await AdminSkillService.getSkillArtifact("8101", "9201");
      const createdArtifact = await AdminSkillService.createSkillArtifact("8101", {
        version: " 1.0.1 ",
        artifactRef: " builtin://sdkwork.skills.research_brief@1.0.1 ",
        artifact: mediaResource("data/skills/artifacts/research-brief-1.0.1.json", "archive"),
        artifactSizeBytes: 4096,
        runtime: " builtin ",
        frameworks: ["Rust service", "OpenAI-compatible", "Rust service"],
        checksumHash: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      });
      const updatedArtifact = await AdminSkillService.updateSkillArtifact("8101", "9201", {
        version: "1.0.2",
        checksumHash: null,
      });
      const deletedArtifact = await AdminSkillService.deleteSkillArtifact("8101", "9201");
      const approved = await AdminSkillService.approveSkill("8101", "Approved");
      const published = await AdminSkillService.publishSkill("8101");
      const disabled = await AdminSkillService.disableSkill("8101");
      const deleted = await AdminSkillService.deleteSkill("8101");

      assert.equal(categories[0].code, "productivity");
      assert.equal(updatedCategory.name, "Productivity Pro");
      assert.equal(deletedCategory, true);
      assert.equal(skills[0].skillKey, "research_brief");
      assert.equal(packages[0].packageKey, "agent_productivity");
      assert.equal(skillPackage.id, "7101");
      assert.equal(createdPackage.id, "7201");
      assert.equal(updatedPackage.name, "Agent Productivity Pro");
      assert.equal(disabledPackage.enabled, false);
      assert.equal(enabledPackage.enabled, true);
      assert.equal(deletedPackage, true);
      assert.equal(skill.marketStatus, "PUBLISHED");
      assert.equal(created.id, "9001");
      assert.equal(updated.name, "Research Brief Pro");
      assert.equal(assets[0].targetType, 35);
      assert.equal(assets[0].fileSize, "182000");
      assert.equal(readMediaResourceUrl(asset.asset), "https://cdn.example.test/skills/research/cover.png");
      assert.equal(createdAsset.id, "9102");
      assert.equal(updatedAsset.thumbnail, undefined);
      assert.equal(deletedAsset, true);
      assert.equal(artifacts[0].frameworks.length, 2);
      assert.equal(artifacts[0].artifactSizeBytes, "2048");
      assert.equal(artifact.artifactRef, "builtin://sdkwork.skills.research_brief@1.0.0");
      assert.equal(createdArtifact.version, "1.0.1");
      assert.equal(updatedArtifact.checksumHash, null);
      assert.equal(deletedArtifact, true);
      assert.equal(approved.reviewStatus, "APPROVED");
      assert.equal(published.marketStatus, "PUBLISHED");
      assert.equal(disabled.enabled, false);
      assert.equal(deleted, true);

      assert.deepEqual(captured.map((request) => `${request.method} ${request.url}`), [
        "GET /backend/v3/api/ecosystem/skills/categories",
        "PUT /backend/v3/api/ecosystem/skills/categories/1901",
        "DELETE /backend/v3/api/ecosystem/skills/categories/1901",
        "GET /backend/v3/api/ecosystem/skills?q=research&page=1&page_size=20",
        "GET /backend/v3/api/ecosystem/skills/package?q=agent&enabled=true",
        "GET /backend/v3/api/ecosystem/skills/package/7101",
        "POST /backend/v3/api/ecosystem/skills/package",
        "PUT /backend/v3/api/ecosystem/skills/package/7101",
        "POST /backend/v3/api/ecosystem/skills/package/7101/disable",
        "POST /backend/v3/api/ecosystem/skills/package/7101/enable",
        "DELETE /backend/v3/api/ecosystem/skills/package/7101",
        "GET /backend/v3/api/ecosystem/skills/8101",
        "POST /backend/v3/api/ecosystem/skills",
        "PUT /backend/v3/api/ecosystem/skills/8101",
        "GET /backend/v3/api/ecosystem/skills/8101/assets",
        "GET /backend/v3/api/ecosystem/skills/8101/assets/9101",
        "POST /backend/v3/api/ecosystem/skills/8101/assets",
        "PUT /backend/v3/api/ecosystem/skills/8101/assets/9101",
        "DELETE /backend/v3/api/ecosystem/skills/8101/assets/9101",
        "GET /backend/v3/api/ecosystem/skills/8101/artifacts",
        "GET /backend/v3/api/ecosystem/skills/8101/artifacts/9201",
        "POST /backend/v3/api/ecosystem/skills/8101/artifacts",
        "PUT /backend/v3/api/ecosystem/skills/8101/artifacts/9201",
        "DELETE /backend/v3/api/ecosystem/skills/8101/artifacts/9201",
        "POST /backend/v3/api/ecosystem/skills/8101/review/approve",
        "POST /backend/v3/api/ecosystem/skills/8101/publish",
        "POST /backend/v3/api/ecosystem/skills/8101/disable",
        "DELETE /backend/v3/api/ecosystem/skills/8101",
      ]);

      const updateCategoryRequest = captured.find((request) => request.method === "PUT" && request.url === "/backend/v3/api/ecosystem/skills/categories/1901");
      assert.ok(updateCategoryRequest);
      assert.deepEqual(JSON.parse(updateCategoryRequest.body), {
        name: "Productivity Pro",
        sortWeight: 5,
      });
      const deleteCategoryRequest = captured.find((request) => request.method === "DELETE" && request.url === "/backend/v3/api/ecosystem/skills/categories/1901");
      assert.ok(deleteCategoryRequest);
      assert.equal(deleteCategoryRequest.headers["x-request-id"], undefined);
      assert.equal(captured[3].body, "");
      assert.equal(captured[4].body, "");
      const createAssetRequest = captured.find((request) => request.method === "POST" && request.url === "/backend/v3/api/ecosystem/skills/8101/assets");
      assert.ok(createAssetRequest);
      assert.deepEqual(JSON.parse(createAssetRequest.body), {
        asset: mediaResource("https://cdn.example.test/skills/research/demo.png", "other"),
        thumbnail: mediaResource("https://cdn.example.test/skills/research/demo-thumb.png"),
        title: "Skill demo cover",
        altText: "Skill demo",
        mimeType: "image/png",
        width: 1200,
        height: 720,
        fileSize: "182000",
        sortOrder: 20,
        status: 1,
      });
      const updateAssetRequest = captured.find((request) => request.method === "PUT" && request.url === "/backend/v3/api/ecosystem/skills/8101/assets/9101");
      assert.ok(updateAssetRequest);
      assert.deepEqual(JSON.parse(updateAssetRequest.body), {
        title: "Skill cover updated",
        thumbnail: null,
      });
      const createArtifactRequest = captured.find((request) => request.method === "POST" && request.url === "/backend/v3/api/ecosystem/skills/8101/artifacts");
      assert.ok(createArtifactRequest);
      assert.deepEqual(JSON.parse(createArtifactRequest.body), {
        version: "1.0.1",
        artifactRef: "builtin://sdkwork.skills.research_brief@1.0.1",
        artifact: mediaResource("data/skills/artifacts/research-brief-1.0.1.json", "archive"),
        artifactSizeBytes: "4096",
        runtime: "builtin",
        frameworks: ["Rust service", "OpenAI-compatible"],
        checksumHash: "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      });
      const updateArtifactRequest = captured.find((request) => request.method === "PUT" && request.url === "/backend/v3/api/ecosystem/skills/8101/artifacts/9201");
      assert.ok(updateArtifactRequest);
      assert.deepEqual(JSON.parse(updateArtifactRequest.body), { version: "1.0.2", checksumHash: null });
      const approveRequest = captured.find((request) => request.url === "/backend/v3/api/ecosystem/skills/8101/review/approve");
      assert.ok(approveRequest);
      assert.deepEqual(JSON.parse(approveRequest.body), { reviewComment: "Approved" });
      for (const request of captured) {
        assert.equal(request.headers["x-request-id"], undefined);
      }
    },
  );
});

test("admin skill service validates path segments and structured JSON form fields", async () => {
  await assert.rejects(() => AdminSkillService.getSkill("../admin"), /skillId must be a safe path segment/);
  await assert.rejects(() => AdminSkillService.updateSkill("skill/1", { name: "x" }), /skillId must be a safe path segment/);
  await assert.rejects(() => AdminSkillService.getSkillPackage("../package"), /packageId must be a safe path segment/);
  await assert.rejects(() => AdminSkillService.updateSkillPackage("package/1", { name: "x" }), /packageId must be a safe path segment/);
  await assert.rejects(() => AdminSkillService.fetchSkillAssets("skill/1"), /skillId must be a safe path segment/);
  await assert.rejects(() => AdminSkillService.getSkillAsset("8101", "../asset"), /assetId must be a safe path segment/);
  await assert.rejects(() => AdminSkillService.fetchSkillArtifacts("skill/1"), /skillId must be a safe path segment/);
  await assert.rejects(() => AdminSkillService.getSkillArtifact("8101", "../artifact"), /artifactId must be a safe path segment/);
  await assert.rejects(() => AdminSkillService.createSkillPackage({ packageKey: "", name: "x" }), /packageKey is required/);
  await assert.rejects(() => AdminSkillService.createSkillPackage({ packageKey: "valid", name: "" }), /name is required/);
  await assert.rejects(() => AdminSkillService.createSkill({ skillKey: "", name: "x" }), /skillKey is required/);
  await assert.rejects(() => AdminSkillService.createSkill({ skillKey: "valid", name: "" }), /name is required/);
  await assert.rejects(() => AdminSkillService.createSkillAsset("8101", { asset: undefined as never }), /asset is required/);
  await assert.rejects(
    () => AdminSkillService.createSkillAsset("8101", { asset: "relative/path.png" as never }),
    /asset is required|asset must be a media resource/,
  );
  await assert.rejects(() => AdminSkillService.createSkillArtifact("8101", { version: "1.0.0" }), /artifactRef or artifact is required/);
  await assert.rejects(
    () => AdminSkillService.createSkillArtifact("8101", {
      artifactRef: "builtin://sdkwork.skills.research@1.0.0",
      checksumHash: "sha256:not-a-digest",
    }),
    /checksumHash must use sha256:<64 lowercase hex>/,
  );

  const form = new FormData();
  form.set("skillKey", "invalid json");
  form.set("name", "Invalid JSON");
  form.set("configSchema", "[1,2,3]");
  assert.throws(() => createSkillInputFromForm(form), /configSchema must be a JSON object/);
});

test("admin skill service fails closed when backend omits resource type and status fields", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/ecosystem/skills/categories" && method === "GET") {
        return {
          items: [
            {
              id: "1901",
              name: "Productivity",
              description: "Agent productivity",
              code: "productivity",
              icon: "/icons/productivity.svg",
              sortWeight: 1,
              parentId: "",
              path: "/skills/productivity",
              visible: true,
              status: 1,
            },
          ],
        };
      }
      throw new Error(`Unexpected request ${method} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminSkillService.fetchSkillCategories(),
        /Skill category type is required/,
      );
    },
  );

  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/ecosystem/skills/8101/assets" && method === "GET") {
        return {
          items: [
            sampleAsset({
              targetType: undefined,
              assetType: undefined,
              status: undefined,
            }),
          ],
        };
      }
      throw new Error(`Unexpected request ${method} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminSkillService.fetchSkillAssets("8101"),
        /Skill asset target type is required/,
      );
    },
  );

  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/ecosystem/skills/8101/artifacts" && method === "GET") {
        return {
          items: [
            sampleArtifact({
              artifactType: undefined,
              status: undefined,
            }),
          ],
        };
      }
      throw new Error(`Unexpected request ${method} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminSkillService.fetchSkillArtifacts("8101"),
        /Skill artifact type is required/,
      );
    },
  );
});

test("admin skill asset and artifact reads fail closed when backend omits required timestamps", async () => {
  for (const [url, action, response, message] of [
    [
      "/backend/v3/api/ecosystem/skills/8101/assets",
      () => AdminSkillService.fetchSkillAssets("8101"),
      { items: [sampleAsset({ createdAt: undefined })] },
      /Skill asset created time is required/,
    ],
    [
      "/backend/v3/api/ecosystem/skills/8101/assets",
      () => AdminSkillService.fetchSkillAssets("8101"),
      { items: [sampleAsset({ updatedAt: undefined })] },
      /Skill asset updated time is required/,
    ],
    [
      "/backend/v3/api/ecosystem/skills/8101/artifacts",
      () => AdminSkillService.fetchSkillArtifacts("8101"),
      { items: [sampleArtifact({ createdAt: undefined })] },
      /Skill artifact created time is required/,
    ],
    [
      "/backend/v3/api/ecosystem/skills/8101/artifacts",
      () => AdminSkillService.fetchSkillArtifacts("8101"),
      { items: [sampleArtifact({ updatedAt: undefined })] },
      /Skill artifact updated time is required/,
    ],
  ] as const) {
    await withBackendSdkFetch(
      (requestUrl, init) => {
        if (requestUrl === url && (init?.method ?? "GET") === "GET") {
          return response;
        }
        throw new Error(`Unexpected request ${init?.method ?? "GET"} ${requestUrl}`);
      },
      async () => {
        await assert.rejects(action, message);
      },
    );
  }
});

test("admin skill delete operations fail closed unless backend confirms deletion", async () => {
  for (const [label, url, action, message] of [
    [
      "package",
      "/backend/v3/api/ecosystem/skills/package/7101",
      () => AdminSkillService.deleteSkillPackage("7101"),
      /Skill package delete confirmation is required/,
    ],
    [
      "skill",
      "/backend/v3/api/ecosystem/skills/8101",
      () => AdminSkillService.deleteSkill("8101"),
      /Skill delete confirmation is required/,
    ],
    [
      "asset",
      "/backend/v3/api/ecosystem/skills/8101/assets/9101",
      () => AdminSkillService.deleteSkillAsset("8101", "9101"),
      /Skill asset delete confirmation is required/,
    ],
    [
      "artifact",
      "/backend/v3/api/ecosystem/skills/8101/artifacts/9201",
      () => AdminSkillService.deleteSkillArtifact("8101", "9201"),
      /Skill artifact delete confirmation is required/,
    ],
  ] as const) {
    await withBackendSdkFetch(
      (requestUrl, init) => {
        if (requestUrl === url && init?.method === "DELETE") {
          return {};
        }
        throw new Error(`Unexpected ${label} delete request ${init?.method ?? "GET"} ${requestUrl}`);
      },
      async () => {
        await assert.rejects(action, message);
      },
    );

    await withBackendSdkFetch(
      (requestUrl, init) => {
        if (requestUrl === url && init?.method === "DELETE") {
          return { deleted: false };
        }
        throw new Error(`Unexpected ${label} delete request ${init?.method ?? "GET"} ${requestUrl}`);
      },
      async () => {
        await assert.rejects(action, message);
      },
    );
  }
});

test("admin skill lifecycle actions fail closed unless backend returns the requested state", async () => {
  for (const [url, action, response, message] of [
    [
      "/backend/v3/api/ecosystem/skills/package/7101/enable",
      () => AdminSkillService.enableSkillPackage("7101"),
      samplePackage({ enabled: false }),
      /Enabled skill package response must have enabled=true/,
    ],
    [
      "/backend/v3/api/ecosystem/skills/package/7101/disable",
      () => AdminSkillService.disableSkillPackage("7101"),
      samplePackage({ enabled: true }),
      /Disabled skill package response must have enabled=false/,
    ],
    [
      "/backend/v3/api/ecosystem/skills/8101/enable",
      () => AdminSkillService.enableSkill("8101"),
      sampleSkill({ enabled: false }),
      /Enabled skill response must have enabled=true/,
    ],
    [
      "/backend/v3/api/ecosystem/skills/8101/disable",
      () => AdminSkillService.disableSkill("8101"),
      sampleSkill({ enabled: true }),
      /Disabled skill response must have enabled=false/,
    ],
    [
      "/backend/v3/api/ecosystem/skills/8101/publish",
      () => AdminSkillService.publishSkill("8101"),
      sampleSkill({ marketStatus: "DRAFT" }),
      /Published skill response must have PUBLISHED market status/,
    ],
    [
      "/backend/v3/api/ecosystem/skills/8101/unpublish",
      () => AdminSkillService.offlineSkill("8101"),
      sampleSkill({ marketStatus: "PUBLISHED" }),
      /Offline skill response must have OFFLINE market status/,
    ],
    [
      "/backend/v3/api/ecosystem/skills/8101/review/approve",
      () => AdminSkillService.approveSkill("8101"),
      sampleSkill({ reviewStatus: "PENDING" }),
      /Approved skill response must have APPROVED review status/,
    ],
    [
      "/backend/v3/api/ecosystem/skills/8101/review/reject",
      () => AdminSkillService.rejectSkill("8101"),
      sampleSkill({ reviewStatus: "PENDING" }),
      /Rejected skill response must have REJECTED review status/,
    ],
  ] as const) {
    await withBackendSdkFetch(
      (requestUrl, init) => {
        if (requestUrl === url && init?.method === "POST") {
          return { item: response };
        }
        throw new Error(`Unexpected lifecycle request ${init?.method ?? "GET"} ${requestUrl}`);
      },
      async () => {
        await assert.rejects(action, message);
      },
    );
  }
});

test("admin skill service fails closed when backend omits required marketplace state fields", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/ecosystem/skills/categories" && method === "GET") {
        return {
          items: [
            {
              id: "1901",
              name: "Productivity",
              sortWeight: 1,
              status: 1,
              type: 19,
            },
          ],
        };
      }
      throw new Error(`Unexpected request ${method} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminSkillService.fetchSkillCategories(),
        /Skill category visibility is required/,
      );
    },
  );

  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/ecosystem/skills/package" && method === "GET") {
        return {
          items: [
            samplePackage({
              enabled: undefined,
            }),
          ],
        };
      }
      throw new Error(`Unexpected request ${method} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminSkillService.fetchSkillPackages(),
        /Skill package enabled flag is required/,
      );
    },
  );

  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/ecosystem/skills" && method === "GET") {
        return {
          items: [
            sampleSkill({
              sourceType: undefined,
              currency: undefined,
              configSchema: undefined,
            }),
          ],
        };
      }
      throw new Error(`Unexpected request ${method} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AdminSkillService.fetchSkills(),
        /Skill source type is required/,
      );
    },
  );
});
