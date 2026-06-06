import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-clawrouter-pc-commons/src/app-session-token.ts";
import { buildPortalShareUrl } from "./packages/sdkwork-clawrouter-pc-commons/src/share-url.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-clawrouter-pc-commons/src/sdk-clients.ts";
import {
  buildSkillInstallCommand,
  deriveSkillInstallationState,
  deriveSkillCatalogViewModel,
  deriveSkillDetailView,
  filterSkillsForCatalog,
  formatSkillConfigEditorValue,
  formatSkillDateLabel,
  normalizeSkillApiRecord,
  parseSkillConfigEditorValue,
  type InstalledSkill,
  type Skill,
  type SkillCatalogFilters,
} from "./packages/sdkwork-clawrouter-pc-skills-hub/src/skillRuntime.ts";
import { skillService } from "./packages/sdkwork-clawrouter-pc-skills-hub/src/services/skillService.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type CapturedSdkRequest = {
  url: string;
  method: string;
  body: string;
};

async function withAppSdkFetch<T>(
  handler: (url: string, init?: RequestInit) => unknown,
  fn: (captured: CapturedSdkRequest[]) => Promise<T>,
): Promise<T> {
  const captured: CapturedSdkRequest[] = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    enumerable: true,
    value: {},
  });
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    captured.push({
      url,
      method: init?.method ?? "GET",
      body: typeof init?.body === "string" ? init.body : "",
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

const runtimeSkills: Skill[] = [
  {
    id: "skill-1",
    name: "Advanced Data Analysis",
    developer: "Sdkwork Cloud",
    description: "Analyze datasets and create visual dashboards.",
    category: "Data Analysis",
    image: "https://cdn.example.test/data.png",
    rating: 4.9,
    downloads: "12k+",
    features: ["Automated Insights", "Data Visualization"],
    lastUpdated: "2026-03-15",
    clawhubImage: "clawhub.io/sdkwork/data-analysis:v2.1.0",
    version: "2.1.0",
    size: "1.2 GB",
    license: "MIT",
    frameworks: ["Python", "Pandas"],
    screenshots: ["https://cdn.example.test/data-1.png"],
  },
  {
    id: "skill-2",
    name: "Creative Writing Assistant",
    developer: "CreativeAI",
    description: "Write stories and long-form creative content.",
    category: "Content Creation",
    image: "https://cdn.example.test/write.png",
    rating: 4.8,
    downloads: "8.5k+",
    features: ["Plot Generation"],
    lastUpdated: "2026-04-01",
    clawhubImage: "clawhub.io/creativeai/writing-assistant:v1.5.2",
    version: "1.5.2",
    size: "850 MB",
    license: "Apache 2.0",
    frameworks: ["Node.js", "LangChain"],
    screenshots: [],
  },
  {
    id: "skill-3",
    name: "Code Review Pro",
    developer: "DevTools Inc",
    description: "Review pull requests for security and performance.",
    category: "Development",
    image: "https://cdn.example.test/code.png",
    rating: 4.7,
    downloads: "25k+",
    features: ["Security Scanning", "Performance Tips"],
    lastUpdated: "2026-04-05",
    clawhubImage: "clawhub.io/devtools/code-review-pro:v3.0.1",
    version: "3.0.1",
    size: "2.4 GB",
    license: "Commercial",
    frameworks: ["Go", "ESLint"],
    screenshots: [],
  },
];

test("skills runtime normalizes app SDK records with public-safe defaults", () => {
  const skill = normalizeSkillApiRecord({
    id: " skill-unsafe ",
    name: "  Routing Skill  ",
    provider: "  SDKWork  ",
    description: "",
    category: "",
    coverImage: "",
    ratingAvg: "4.95",
    installCount: "13500",
    capabilities: ["Routing", "", "  Policy  "],
    latestPublishedAt: "2026-05-03T10:30:00Z",
    artifactRef: "clawhub.io/sdkwork/routing:v1.0.0",
    artifactSizeBytes: 1288490188,
    licenseName: "",
    frameworks: ["Rust", " Axum "],
    screenshots: ["https://cdn.example.test/screen.png"],
    packages: [
      {
        id: "pkg-routing-100",
        version: "1.0.0",
        artifactRef: "builtin://sdkwork.skills.routing@1.0.0",
        artifactSizeBytes: 1288490188,
        frameworks: ["Rust", "Axum"],
        licenseName: "SDKWork Commercial",
        publishedAt: "2026-05-03T10:30:00Z",
      },
    ],
  });

  assert.equal(skill.id, "skill-unsafe");
  assert.equal(skill.name, "Routing Skill");
  assert.equal(skill.developer, "SDKWork");
  assert.equal(skill.category, "Uncategorized");
  assert.equal(skill.rating, 4.95);
  assert.equal(skill.downloads, "13.5K");
  assert.deepEqual(skill.features, ["Routing", "Policy"]);
  assert.equal(skill.lastUpdated, "2026-05-03");
  assert.equal(skill.clawhubImage, "clawhub.io/sdkwork/routing:v1.0.0");
  assert.equal(skill.size, "1.2 GB");
  assert.equal(skill.license, "SDKWork Commercial");
  assert.equal(skill.packages[0].artifactRef, "builtin://sdkwork.skills.routing@1.0.0");
});

test("skills runtime filters and sorts without mutating source skills", () => {
  const filters: SkillCatalogFilters = {
    searchQuery: " security ",
    categories: ["  Development  "],
    sortBy: "Most Popular",
  };

  const filtered = filterSkillsForCatalog(runtimeSkills, filters);

  assert.deepEqual(filtered.map((skill) => skill.id), ["skill-3"]);
  assert.notEqual(filtered, runtimeSkills);
  assert.deepEqual(runtimeSkills.map((skill) => skill.id), ["skill-1", "skill-2", "skill-3"]);
  assert.deepEqual(
    filterSkillsForCatalog(runtimeSkills, { searchQuery: "", categories: [], sortBy: "Newest" }).map((skill) => skill.id),
    ["skill-3", "skill-2", "skill-1"],
  );
  assert.deepEqual(
    filterSkillsForCatalog(runtimeSkills, { searchQuery: "", categories: [], sortBy: "Highest Rated" }).map((skill) => skill.id),
    ["skill-1", "skill-2", "skill-3"],
  );
});

test("skills catalog view model derives categories sort tabs cards and empty state", () => {
  const view = deriveSkillCatalogViewModel({
    skills: runtimeSkills,
    categories: ["Development", "Data Analysis"],
    installedSkills: [
      {
        id: "install-skill-1",
        skillId: "skill-1",
        enabled: true,
        config: { mode: "strict" },
        installedAt: "2026-05-09 10:00:00",
        lastEnabledAt: "2026-05-09 10:00:00",
        skill: runtimeSkills[0],
      },
    ],
    filters: {
      searchQuery: "cloud",
      categories: [],
      sortBy: "Most Popular",
    },
  });

  assert.deepEqual(view.categoryOptions.map((category) => category.id), ["All", "Data Analysis", "Development"]);
  assert.deepEqual(view.sortOptions, ["Most Popular", "Highest Rated", "Newest"]);
  assert.deepEqual(view.skillCards.map((skill) => skill.id), ["skill-1"]);
  assert.equal(view.skillCards[0].descriptionPreview, "Analyze datasets and create visual dashboards.");
  assert.equal(view.skillCards[0].installationLabel, "Enabled");
  assert.equal(view.skillCards[0].installed, true);
  assert.equal(view.skillCards[0].enabled, true);
  assert.equal(view.resultCount, 1);
  assert.equal(view.emptyStateVisible, false);
});

test("skills catalog keeps SDKWork Official first in category options", () => {
  const officialSkill: Skill = {
    ...runtimeSkills[2],
    id: "skill-official",
    name: "Prompt Optimizer",
    developer: "SDKWork",
    category: "SDKWork Official",
  };
  const communitySkill: Skill = {
    ...runtimeSkills[0],
    id: "skill-community",
    name: "Browser Use",
    developer: "ClawHub",
    category: "ClawHub Community",
  };

  const view = deriveSkillCatalogViewModel({
    skills: [communitySkill, officialSkill],
    categories: ["ClawHub Community", "SDKWork Official"],
    installedSkills: [],
    filters: {
      searchQuery: "",
      categories: [],
      sortBy: "Most Popular",
    },
  });

  assert.deepEqual(view.categoryOptions.map((category) => category.id), [
    "All",
    "SDKWork Official",
    "ClawHub Community",
  ]);
});

test("skills catalog cards derive installed and disabled states from user installations", () => {
  const view = deriveSkillCatalogViewModel({
    skills: runtimeSkills,
    categories: ["Development", "Data Analysis", "Content Creation"],
    installedSkills: [
      {
        id: "install-skill-1",
        skillId: "skill-1",
        enabled: true,
        config: {},
        installedAt: "2026-05-09 10:00:00",
        lastEnabledAt: "2026-05-09 10:00:00",
        skill: runtimeSkills[0],
      },
      {
        id: "install-skill-2",
        skillId: "skill-2",
        enabled: false,
        config: {},
        installedAt: "2026-05-09 11:00:00",
        lastEnabledAt: "2026-05-09 11:00:00",
        skill: runtimeSkills[1],
      },
    ],
    filters: {
      searchQuery: "",
      categories: [],
      sortBy: "Most Popular",
    },
  });

  assert.deepEqual(
    view.skillCards.map((skill) => [skill.id, skill.installationLabel, skill.installed, skill.enabled]),
    [
      ["skill-3", "Not installed", false, false],
      ["skill-1", "Enabled", true, true],
      ["skill-2", "Installed", true, false],
    ],
  );
});

test("skills hub page exposes installed skill state through generated app SDK data", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-skills-hub/src/pages/SkillsHub.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /skillService\.getMySkills/);
  assert.match(source, /hasStoredPortalSession/);
  assert.match(source, /if \(!hasStoredPortalSession\(\)\) \{\s*setInstalledSkills\(\[\]\);\s*setInstalledLoadError\(null\);\s*return;\s*\}/u);
  assert.match(source, /installedSkills/);
  assert.match(source, /installedLoadError/);
  assert.match(source, /installationLabel/);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(source, /\baxios\b/);
});

test("skills detail view derives route lookup labels and install commands deterministically", () => {
  const detail = deriveSkillDetailView(
    [
      {
        ...runtimeSkills[1],
        packages: [
          {
            id: "pkg-writing-152",
            version: "1.5.2",
            artifactRef: "builtin://creativeai.writing_assistant@1.5.2",
            artifactSizeBytes: 891289600,
            frameworks: ["Node.js", "LangChain"],
            licenseName: "Apache 2.0",
            publishedAt: "2026-04-01T00:00:00Z",
          },
        ],
      },
    ],
    "skill-2",
  );

  assert.equal(detail?.skill.id, "skill-2");
  assert.equal(detail?.lastUpdatedLabel, "2026-04-01");
  assert.equal(detail?.packageName, "builtin://creativeai.writing_assistant@1.5.2");
  assert.equal(detail?.registryOptions.defaultUrl, "https://registry.clawhub.io");
  assert.equal(
    buildSkillInstallCommand({
      packageName: detail?.packageName ?? "",
      packageManager: "pnpm",
      registry: "china",
    }),
    "pnpm dlx clawhub@latest install builtin://creativeai.writing_assistant@1.5.2 --registry=https://cn.clawhub-mirror.com",
  );
  assert.equal(deriveSkillDetailView(runtimeSkills, "missing"), null);
});

test("skills detail share URL is canonical and origin-safe", () => {
  assert.equal(
    buildPortalShareUrl("/skills-hub/skill-2", "https://portal.example.test/skills-hub/old?tab=debug#state"),
    "https://portal.example.test/skills-hub/skill-2",
  );
  assert.equal(buildPortalShareUrl("skills-hub/skill-2", "https://portal.example.test"), "https://portal.example.test/skills-hub/skill-2");
  assert.equal(buildPortalShareUrl("/skills-hub/skill-2", ""), "/skills-hub/skill-2");
});

test("skills runtime derives installed enabled and action states deterministically", () => {
  const installedSkills: InstalledSkill[] = [
    {
      id: "install-skill-1",
      skillId: "skill-1",
      enabled: true,
      config: { mode: "strict" },
      installedAt: "2026-05-09 10:00:00",
      lastEnabledAt: "2026-05-09 10:00:00",
      skill: runtimeSkills[0],
    },
    {
      id: "install-skill-2",
      skillId: "skill-2",
      enabled: false,
      config: {},
      installedAt: "2026-05-09 11:00:00",
      lastEnabledAt: "2026-05-09 11:00:00",
      skill: runtimeSkills[1],
    },
  ];

  assert.deepEqual(deriveSkillInstallationState("skill-1", installedSkills), {
    installed: true,
    enabled: true,
    action: "disable",
    label: "Enabled",
  });
  assert.deepEqual(deriveSkillInstallationState("skill-2", installedSkills), {
    installed: true,
    enabled: false,
    action: "enable",
    label: "Installed",
  });
  assert.deepEqual(deriveSkillInstallationState("skill-3", installedSkills), {
    installed: false,
    enabled: false,
    action: "enable",
    label: "Not installed",
  });
});

test("skills runtime formats and parses installed skill configuration editor values", () => {
  const installedSkill: InstalledSkill = {
    id: "install-skill-1",
    skillId: "skill-1",
    enabled: true,
    config: {
      mode: "strict",
      thresholds: {
        risk: 0.7,
      },
    },
    installedAt: "2026-05-09 10:00:00",
    lastEnabledAt: "2026-05-09 10:00:00",
    skill: runtimeSkills[0],
  };

  assert.equal(
    formatSkillConfigEditorValue(installedSkill),
    '{\n  "mode": "strict",\n  "thresholds": {\n    "risk": 0.7\n  }\n}',
  );
  const requestBodyBoundaryConfig: Record<string, string> = {};
  for (let index = 0; index < 490; index += 1) {
    requestBodyBoundaryConfig[`key${index}`] = "x".repeat(120);
  }
  requestBodyBoundaryConfig.tail = "x".repeat(949);
  const requestBodyBoundaryValue = JSON.stringify(requestBodyBoundaryConfig);
  assert.ok(Buffer.byteLength(requestBodyBoundaryValue) <= 65536);
  assert.ok(Buffer.byteLength(JSON.stringify({ config: requestBodyBoundaryConfig })) > 65536);

  assert.deepEqual(parseSkillConfigEditorValue('{"mode":"balanced"}'), { mode: "balanced" });
  assert.deepEqual(parseSkillConfigEditorValue(" \n\t "), {});
  assert.throws(() => parseSkillConfigEditorValue("{"), /skill config must be valid JSON/);
  assert.throws(() => parseSkillConfigEditorValue("[]"), /config must be a plain object/);
  assert.throws(
    () => parseSkillConfigEditorValue(requestBodyBoundaryValue),
    /skill config request body must be at most 65536 bytes/,
  );
  assert.throws(
    () => parseSkillConfigEditorValue('{"portal":{"hidden":true}}'),
    /config.portal is reserved portal metadata/,
  );
});

test("skills runtime counts config key and string limits by Unicode scalar values", () => {
  const emoji = "\u{1F600}";
  const maxScalarKey = emoji.repeat(128);
  const maxScalarString = emoji.repeat(4096);

  assert.deepEqual(parseSkillConfigEditorValue(JSON.stringify({ [maxScalarKey]: "ok" })), {
    [maxScalarKey]: "ok",
  });
  assert.deepEqual(parseSkillConfigEditorValue(JSON.stringify({ value: maxScalarString })), {
    value: maxScalarString,
  });
  assert.throws(
    () => parseSkillConfigEditorValue(JSON.stringify({ [emoji.repeat(129)]: "too-long" })),
    /config keys must be non-empty and at most 128 characters/,
  );
  assert.throws(
    () => parseSkillConfigEditorValue(JSON.stringify({ value: emoji.repeat(4097) })),
    /config string values must be at most 4096 characters/,
  );
});

test("skills detail page exposes SDK-backed installed skill configuration management", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-skills-hub/src/pages/SkillDetails.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /useLocation/u);
  assert.match(source, /useNavigate/u);
  assert.match(source, /hasStoredPortalSession/u);
  assert.match(source, /buildPortalAuthLoginRedirect/u);
  assert.match(source, /requirePortalLoginForAction/u);
  assert.match(source, /skillService\.updateSkillConfig/);
  assert.match(source, /parseSkillConfigEditorValue/);
  assert.match(source, /formatSkillConfigEditorValue/);
  assert.match(source, /Skill configuration JSON/);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(source, /\baxios\b/);
});

test("skills detail private actions require login before generated SDK mutations", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-skills-hub/src/pages/SkillDetails.tsx", import.meta.url),
    "utf8",
  );

  for (const guardedCall of [
    "skillService.disableSkill",
    "skillService.enableSkill",
    "skillService.updateSkillConfig",
  ]) {
    const callIndex = source.indexOf(guardedCall);
    assert.notEqual(callIndex, -1, `${guardedCall} must remain wired`);
    const precedingSource = source.slice(Math.max(0, callIndex - 500), callIndex);
    assert.match(
      precedingSource,
      /requirePortalLoginForAction\(\)/u,
      `${guardedCall} must be guarded before the SDK mutation`,
    );
  }
});

test("skills detail page wires visible share control to canonical copy behavior", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-skills-hub/src/pages/SkillDetails.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /CopyButton/u);
  assert.match(source, /buildPortalShareUrl\(`\/skills-hub\/\$\{detailSkill\.id\}`/u);
  assert.doesNotMatch(source, /<button className="p-3 rounded-xl[\s\S]*?<Share2/u);
  assert.doesNotMatch(source, /\bfetch\s*\(/u);
  assert.doesNotMatch(source, /\baxios\b/u);
});

test("skills runtime date and install helpers are stable across locales", () => {
  assert.equal(formatSkillDateLabel("2026-05-03T10:30:00+08:00"), "2026-05-03");
  assert.equal(formatSkillDateLabel("2026-05-03 10:30:00"), "2026-05-03");
  assert.equal(formatSkillDateLabel(""), "Unpublished");
  assert.equal(
    buildSkillInstallCommand({
      packageName: "agent-skill",
      packageManager: "agent",
      registry: "default",
    }),
    "Install agent-skill from https://registry.clawhub.io through the Agent skill installer.",
  );
});

test("skills service normalizes catalog filters before generated app SDK call", async () => {
  await withAppSdkFetch(
    (url) => {
      const requestUrl = new URL(url, "http://localhost");
      assert.equal(requestUrl.pathname, "/app/v3/api/ecosystem/skills");
      assert.equal(requestUrl.searchParams.get("page"), "3");
      assert.equal(requestUrl.searchParams.get("page_size"), "50");
      assert.equal(requestUrl.searchParams.get("q"), "data analysis");
      assert.equal(requestUrl.searchParams.has("search_query"), false);
      assert.equal(requestUrl.searchParams.has("searchQuery"), false);
      assert.equal(requestUrl.searchParams.get("status"), "published");
      assert.equal(requestUrl.searchParams.get("start_time"), "2026-05-01T00:00:00Z");
      assert.equal(requestUrl.searchParams.get("end_time"), "2026-05-31T23:59:59Z");
      assert.equal(requestUrl.searchParams.has("search"), false);
      assert.equal(requestUrl.searchParams.has("categories"), false);
      assert.equal(requestUrl.searchParams.has("sortBy"), false);
      assert.equal(requestUrl.searchParams.has("ignored"), false);
      assert.equal(requestUrl.searchParams.has("empty"), false);
      return {
        items: [
          {
            id: "skill-1",
            name: "Advanced Data Analysis",
            provider: "Sdkwork Cloud",
            category: "Data Analysis",
            latestPublishedAt: "2026-03-15",
          },
          {
            id: "skill-2",
            name: "Creative Writing Assistant",
            provider: "CreativeAI",
            category: "Content Creation",
            latestPublishedAt: "2026-04-01",
          },
        ],
      };
    },
    async (captured) => {
      const result = await skillService.getSkills({
        searchQuery: " data analysis ",
        page: "3",
        pageSize: "50",
        status: " published ",
        startTime: " 2026-05-01T00:00:00Z ",
        endTime: " 2026-05-31T23:59:59Z ",
        categories: ["Data Analysis"],
        sortBy: "Newest",
        ignored: "drop-me",
        empty: "",
      } as any);

      assert.equal(captured.length, 1);
      assert.deepEqual(result.map((skill) => skill.id), ["skill-1"]);
    },
  );
});

test("skills service rejects invalid catalog query filters before generated app SDK call", async () => {
  await withAppSdkFetch(
    () => {
      throw new Error("app SDK must not be called for invalid skill catalog filters");
    },
    async (captured) => {
      await assert.rejects(() => skillService.getSkills({ page: 0 } as any), /page must be a positive integer/);
      await assert.rejects(() => skillService.getSkills({ page: "abc" } as any), /page must be a positive integer/);
      await assert.rejects(() => skillService.getSkills({ pageSize: 0 } as any), /pageSize must be between 1 and 100/);
      await assert.rejects(() => skillService.getSkills({ pageSize: 101 } as any), /pageSize must be between 1 and 100/);
      await assert.rejects(
        () => skillService.getSkills({ searchQuery: "x".repeat(129) } as any),
        /searchQuery must be at most 128 characters/,
      );
      await assert.rejects(
        () => skillService.getSkills({ endTime: { value: "2026-05-31T23:59:59Z" } } as any),
        /endTime must be a string/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("skills service rejects unsafe skill detail ids before generated app SDK call", async () => {
  await withAppSdkFetch(
    () => {
      throw new Error("app SDK must not be called for invalid skill detail ids");
    },
    async (captured) => {
      await assert.rejects(() => skillService.getSkillById(""), /skillId is required/);
      await assert.rejects(() => skillService.getSkillById(" skill-1 "), /skillId must be a safe path segment/);
      await assert.rejects(() => skillService.getSkillById("../admin"), /skillId must be a safe path segment/);
      await assert.rejects(() => skillService.getSkillById("skill/1"), /skillId must be a safe path segment/);
      await assert.rejects(() => skillService.getSkillById("skill?debug=true"), /skillId must be a safe path segment/);
      assert.equal(captured.length, 0);
    },
  );
});

test("skills service returns undefined when detail response data is null", async () => {
  await withAppSdkFetch(
    (url, init) => {
      assert.equal(url, "/app/v3/api/ecosystem/skills/missing-skill");
      assert.equal(init?.method ?? "GET", "GET");
      return null;
    },
    async (captured) => {
      const result = await skillService.getSkillById("missing-skill");

      assert.equal(result, undefined);
      assert.equal(captured.length, 1);
    },
  );
});

test("skills service loads installed user skills through generated app SDK", async () => {
  await withAppSdkFetch(
    (url, init) => {
      assert.equal(url, "/app/v3/api/ecosystem/users/current/skills");
      assert.equal(init?.method ?? "GET", "GET");
      return {
        items: [
          {
            id: "install-skill-1",
            skillId: "skill-1",
            enabled: true,
            config: { mode: "strict" },
            installedAt: "2026-05-09 10:00:00",
            lastEnabledAt: "2026-05-09 10:00:00",
            skill: {
              id: "skill-1",
              name: "Advanced Data Analysis",
              provider: "Sdkwork Cloud",
              category: "Data Analysis",
              latestPublishedAt: "2026-03-15",
            },
          },
        ],
      };
    },
    async (captured) => {
      const result = await skillService.getMySkills();

      assert.equal(captured.length, 1);
      assert.equal(result.length, 1);
      assert.equal(result[0].id, "install-skill-1");
      assert.equal(result[0].skillId, "skill-1");
      assert.equal(result[0].enabled, true);
      assert.deepEqual(result[0].config, { mode: "strict" });
      assert.equal(result[0].skill.name, "Advanced Data Analysis");
    },
  );
});

test("skills service enables disables and updates config through generated app SDK", async () => {
  await withAppSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ecosystem/skills/skill-1/enable" && init?.method === "POST") {
        assert.deepEqual(JSON.parse(String(init.body)), { config: { mode: "strict" } });
        return {
          item: installedSkillApiRecord({
            enabled: true,
            config: { mode: "strict" },
          }),
        };
      }
        if (url === "/app/v3/api/ecosystem/skills/skill-1/disable" && init?.method === "POST") {
          assert.ok(init?.body == null || init.body === "", "disableSkill must send an empty request body");
          return {
            item: installedSkillApiRecord({
              enabled: false,
              config: { mode: "strict" },
          }),
        };
      }
      if (url === "/app/v3/api/ecosystem/skills/skill-1/config" && init?.method === "PUT") {
        assert.deepEqual(JSON.parse(String(init.body)), { config: { mode: "balanced" } });
        return {
          item: installedSkillApiRecord({
            enabled: false,
            config: { mode: "balanced" },
          }),
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async (captured) => {
      const enabled = await skillService.enableSkill("skill-1", { mode: "strict" });
      const disabled = await skillService.disableSkill("skill-1");
      const configured = await skillService.updateSkillConfig("skill-1", { mode: "balanced" });

      assert.deepEqual(
        captured.map((item) => `${item.method} ${item.url}`),
        [
          "POST /app/v3/api/ecosystem/skills/skill-1/enable",
          "POST /app/v3/api/ecosystem/skills/skill-1/disable",
          "PUT /app/v3/api/ecosystem/skills/skill-1/config",
        ],
      );
      assert.equal(enabled.enabled, true);
      assert.equal(disabled.enabled, false);
      assert.equal(configured.enabled, false);
      assert.deepEqual(configured.config, { mode: "balanced" });
    },
  );
});

test("skills service rejects unsafe command ids and non-object configs before generated app SDK call", async () => {
  await withAppSdkFetch(
    () => {
      throw new Error("app SDK must not be called for invalid skill command input");
    },
    async (captured) => {
      await assert.rejects(() => skillService.enableSkill("../admin", {}), /skillId must be a safe path segment/);
      await assert.rejects(() => skillService.disableSkill("skill/1"), /skillId must be a safe path segment/);
      await assert.rejects(() => skillService.updateSkillConfig("skill-1", [] as any), /config must be a plain object/);
      await assert.rejects(() => skillService.enableSkill("skill-1", null as any), /config must be a plain object/);
      await assert.rejects(
        () => skillService.enableSkill("skill-1", { portal: { features: ["hidden"] } }),
        /config.portal is reserved portal metadata/,
      );
      const oversizedConfig: Record<string, string> = {};
      for (let index = 0; index < 490; index += 1) {
        oversizedConfig[`key${index}`] = "x".repeat(120);
      }
      oversizedConfig.tail = "x".repeat(949);
      await assert.rejects(
        () => skillService.updateSkillConfig("skill-1", oversizedConfig),
        /skill config request body must be at most 65536 bytes/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("skills service fails closed when detail response does not contain a skill entity", async () => {
  await withAppSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ecosystem/skills/skill-1" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              id: "wrong-list-row",
              name: "Wrong List Row",
              provider: "SDKWork Skills",
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => skillService.getSkillById("skill-1"),
        /Skill detail response is missing data/,
      );
    },
  );
});

function installedSkillApiRecord({
  enabled,
  config,
}: {
  enabled: boolean;
  config: Record<string, unknown>;
}): Record<string, unknown> {
  return {
    id: "install-skill-1",
    skillId: "skill-1",
    enabled,
    config,
    installedAt: "2026-05-09 10:00:00",
    lastEnabledAt: "2026-05-09 10:00:00",
    skill: {
      id: "skill-1",
      name: "Advanced Data Analysis",
      provider: "Sdkwork Cloud",
      category: "Data Analysis",
      latestPublishedAt: "2026-03-15",
    },
  };
}

test("skills service fails closed when catalog response contains malformed skill rows", async () => {
  await withAppSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/ecosystem/skills" && (init?.method ?? "GET") === "GET") {
        return { items: ["not-a-skill-record"] };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => skillService.getSkills(),
        /Skill record is required/,
      );
    },
  );
});

test("skills service fails closed when catalog response omits required skill identity fields", async () => {
  for (const [field, message] of [
    ["id", /Skill id is required/],
    ["name", /Skill name is required/],
    ["provider", /Skill developer is required/],
  ] as const) {
    await withAppSdkFetch(
      (url, init) => {
        if (url === "/app/v3/api/ecosystem/skills" && (init?.method ?? "GET") === "GET") {
          const skill = {
            id: "skill-1",
            name: "Advanced Data Analysis",
            provider: "Sdkwork Cloud",
            category: "Data Analysis",
            latestPublishedAt: "2026-03-15",
          } as Record<string, unknown>;
          delete skill[field];
          return { items: [skill] };
        }
        throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
      },
      async () => {
        await assert.rejects(
          () => skillService.getSkills(),
          message,
        );
      },
    );
  }
});

test("skills runtime fails closed when package artifact contract drifts", () => {
  assert.throws(
    () =>
      normalizeSkillApiRecord({
        id: "skill-1",
        name: "Advanced Data Analysis",
        provider: "Sdkwork Cloud",
        category: "Data Analysis",
        packages: ["not-a-package-record"],
      }),
    /Skill package record is required/,
  );
});
