import assert from "node:assert/strict";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import {
  AdminSkillService,
  createSkillPackageInputFromForm,
  createSkillCategoryInputFromForm,
  createSkillArtifactInputFromForm,
  createSkillAssetInputFromForm,
  createSkillInputFromForm,
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

async function withBackendSdkFetch<T>(
  handler: (url: string, init?: RequestInit) => unknown,
  fn: (captured: CapturedBackendRequest[]) => Promise<T>,
): Promise<T> {
  const captured: CapturedBackendRequest[] = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    enumerable: true,
    value: {},
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

function sampleAsset(overrides: Record<string, unknown> = {}) {
  return {
    id: "9101",
    skillId: "8101",
    targetType: 35,
    targetId: "8101",
    artifactId: null,
    assetType: 1,
    assetUrl: "https://cdn.example.test/skills/research/cover.png",
    thumbnailUrl: "https://cdn.example.test/skills/research/thumb.png",
    title: "Skill cover",
    altText: "Skill marketplace cover",
    mimeType: "image/png",
    width: 1200,
    height: 720,
    durationSeconds: null,
    fileSize: 182000,
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
    artifactUrl: "data/skills/artifacts/research-brief-1.0.0.json",
    artifactSizeBytes: 2048,
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
  assetForm.set("thumbnailUrl", " ");
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
  assetForm.set("assetUrl", " artifact://skills/research/cover.png ");
  assetForm.set("thumbnailUrl", " artifact://skills/research/cover-thumb.png ");
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
    assetUrl: "artifact://skills/research/cover.png",
    thumbnailUrl: "artifact://skills/research/cover-thumb.png",
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
  artifactForm.set("artifactUrl", " data/skills/artifacts/research-brief-1.1.0.json ");
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
    artifactUrl: "data/skills/artifacts/research-brief-1.1.0.json",
    artifactSizeBytes: 4096,
    runtime: "builtin",
    frameworks: ["Rust service", "OpenAI-compatible"],
    licenseName: "SDKWork Commercial",
    checksumHash: "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    releaseNotes: "Initial release",
    status: 1,
  });
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
    "Manage assets and artifacts",
  ]) {
    assert.ok(source.includes(expected), `missing admin skill resource management source marker: ${expected}`);
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
        assetUrl: " artifact://skills/research/cover.png ",
        thumbnailUrl: " artifact://skills/research/cover-thumb.png ",
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
        thumbnailUrl: null,
        sortOrder: 20,
      });
      const deletedAsset = await AdminSkillService.deleteSkillAsset("8101", "9101");

      const artifacts = await AdminSkillService.fetchSkillArtifacts("8101");
      const artifact = await AdminSkillService.getSkillArtifact("8101", "9201");
      const createdArtifact = await AdminSkillService.createSkillArtifact("8101", {
        version: " 1.1.0 ",
        platformType: " web ",
        osName: " any ",
        artifactUrl: " artifact://skills/research/skill.json ",
        artifactSizeBytes: 4096,
        runtime: " agent-skill ",
        frameworks: ["React portal", "Rust service", "React portal"],
        checksumHash: "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        status: 1,
      });
      const updatedArtifact = await AdminSkillService.updateSkillArtifact("8101", "9201", {
        version: "1.2.0",
        artifactUrl: null,
        frameworks: ["Rust service"],
      });
      const deletedArtifact = await AdminSkillService.deleteSkillArtifact("8101", "9201");

      assert.equal(assets[0].title, "Skill cover");
      assert.equal(asset.artifactId, null);
      assert.equal(createdAsset.id, "9102");
      assert.equal(updatedAsset.sortOrder, 20);
      assert.equal(deletedAsset, true);
      assert.deepEqual(artifacts[0].frameworks, ["Rust service", "OpenAI-compatible"]);
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
        assetUrl: "artifact://skills/research/cover.png",
        thumbnailUrl: "artifact://skills/research/cover-thumb.png",
        title: "Created asset",
        altText: "Skill cover",
        artifactId: "9201",
        assetType: 1,
        width: 1200,
        height: 630,
        fileSize: 2048,
        sortOrder: 10,
        status: 1,
      });
      assert.deepEqual(JSON.parse(captured[7].body), {
        version: "1.1.0",
        platformType: "web",
        osName: "any",
        artifactUrl: "artifact://skills/research/skill.json",
        artifactSizeBytes: 4096,
        runtime: "agent-skill",
        frameworks: ["React portal", "Rust service"],
        checksumHash: "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        status: 1,
      });
      for (const request of captured.filter((item) => item.method === "POST" || item.method === "PUT" || item.method === "DELETE")) {
        assert.match(request.headers["x-request-id"], /^admin-skill-/);
      }
    },
  );
});

test("admin skill service calls generated backend SDK paths and normalizes package and skill lifecycle state", async () => {
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
              type: 19,
            },
          ],
        };
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
        return { item: sampleAsset({ title: "Skill cover updated", thumbnailUrl: null }) };
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
        assetUrl: " https://cdn.example.test/skills/research/demo.png ",
        thumbnailUrl: " https://cdn.example.test/skills/research/demo-thumb.png ",
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
        thumbnailUrl: null,
      });
      const deletedAsset = await AdminSkillService.deleteSkillAsset("8101", "9101");
      const artifacts = await AdminSkillService.fetchSkillArtifacts("8101");
      const artifact = await AdminSkillService.getSkillArtifact("8101", "9201");
      const createdArtifact = await AdminSkillService.createSkillArtifact("8101", {
        version: " 1.0.1 ",
        artifactRef: " builtin://sdkwork.skills.research_brief@1.0.1 ",
        artifactUrl: " data/skills/artifacts/research-brief-1.0.1.json ",
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
      assert.equal(asset.assetUrl, "https://cdn.example.test/skills/research/cover.png");
      assert.equal(createdAsset.id, "9102");
      assert.equal(updatedAsset.thumbnailUrl, null);
      assert.equal(deletedAsset, true);
      assert.equal(artifacts[0].frameworks.length, 2);
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

      assert.equal(captured[1].body, "");
      assert.equal(captured[2].body, "");
      const createAssetRequest = captured.find((request) => request.method === "POST" && request.url === "/backend/v3/api/ecosystem/skills/8101/assets");
      assert.ok(createAssetRequest);
      assert.deepEqual(JSON.parse(createAssetRequest.body), {
        assetUrl: "https://cdn.example.test/skills/research/demo.png",
        thumbnailUrl: "https://cdn.example.test/skills/research/demo-thumb.png",
        title: "Skill demo cover",
        altText: "Skill demo",
        mimeType: "image/png",
        width: 1200,
        height: 720,
        fileSize: 182000,
        sortOrder: 20,
        status: 1,
      });
      const createArtifactRequest = captured.find((request) => request.method === "POST" && request.url === "/backend/v3/api/ecosystem/skills/8101/artifacts");
      assert.ok(createArtifactRequest);
      assert.deepEqual(JSON.parse(createArtifactRequest.body), {
        version: "1.0.1",
        artifactRef: "builtin://sdkwork.skills.research_brief@1.0.1",
        artifactUrl: "data/skills/artifacts/research-brief-1.0.1.json",
        artifactSizeBytes: 4096,
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
      for (const request of captured.filter((item) => item.method === "POST" || item.method === "PUT")) {
        if (!request.url.endsWith("/list")) {
          assert.match(request.headers["x-request-id"], /^admin-skill-/);
        }
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
  await assert.rejects(() => AdminSkillService.createSkillAsset("8101", { assetUrl: "" }), /assetUrl is required/);
  await assert.rejects(
    () => AdminSkillService.createSkillAsset("8101", { assetUrl: "relative/path.png" }),
    /assetUrl must be an http\(s\), builtin, artifact, data\/skills, or absolute path reference/,
  );
  await assert.rejects(() => AdminSkillService.createSkillArtifact("8101", { version: "1.0.0" }), /artifactRef or artifactUrl is required/);
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
