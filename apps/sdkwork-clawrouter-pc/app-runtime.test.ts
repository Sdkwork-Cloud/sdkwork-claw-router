import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-clawrouter-pc-commons/src/app-session-token.ts";
import {
  readMediaResourceUrl,
  toExternalUrlMediaResource,
} from "./packages/sdkwork-clawrouter-pc-commons/src/media-resource.ts";
import { buildPortalShareUrl } from "./packages/sdkwork-clawrouter-pc-commons/src/share-url.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-clawrouter-pc-commons/src/sdk-clients.ts";
import {
  deriveAppCatalogViewModel,
  deriveAppDetailView,
  filterAppsForCatalog,
  formatAppCount,
  formatAppDateLabel,
  getReleaseDownloadHref,
  isReleaseDownloadable,
  normalizeAppApiRecord,
  type App,
  type AppCatalogFilters,
} from "./packages/sdkwork-clawrouter-pc-app-center/src/appRuntime.ts";
import { appService } from "./packages/sdkwork-clawrouter-pc-app-center/src/services/appService.ts";

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

function imageResource(url: string) {
  return toExternalUrlMediaResource(url, "image")!;
}

function artifactResource(url: string) {
  return toExternalUrlMediaResource(url, "archive")!;
}

const runtimeApps: App[] = [
  {
    id: "app-1",
    name: "Data Lens",
    developer: "SDKWork Apps",
    category: "Data Analysis",
    image: imageResource("https://cdn.example.test/data.png"),
    rating: 4.9,
    downloads: "1.2M",
    description: "Analyze model usage and business metrics.",
    screenshots: [imageResource("https://cdn.example.test/data-1.png")],
    features: ["Forecasting", "Dashboards"],
    releases: [
      {
        id: "app-1-web",
        platformType: "Web",
        os: "PC Web",
        version: "2026.05",
        size: "N/A",
        releaseDate: "2026-05-03",
        artifact: artifactResource("https://apps.example.test/data-lens"),
        whatsNew: "Realtime model usage explorer.",
      },
      {
        id: "app-1-win",
        platformType: "Desktop",
        os: "Windows",
        version: "1.4.0",
        size: "128 MB",
        releaseDate: "2026-04-25",
        whatsNew: "Local cache support.",
      },
    ],
  },
  {
    id: "app-2",
    name: "Prompt Studio",
    developer: "CreativeAI",
    category: "Content Creation",
    image: imageResource("https://cdn.example.test/prompt.png"),
    rating: 4.7,
    downloads: "850K",
    description: "Design reusable prompts and team workflows.",
    screenshots: [],
    features: ["Templates"],
    releases: [
      {
        id: "app-2-ios",
        platformType: "Mobile",
        os: "iOS",
        version: "3.2.1",
        size: "78 MB",
        releaseDate: "2026-04-01",
        whatsNew: "Team prompt library.",
      },
    ],
  },
  {
    id: "app-3",
    name: "Gateway Console",
    developer: "DevTools Inc",
    category: "Development",
    image: imageResource("https://cdn.example.test/gateway.png"),
    rating: 4.8,
    downloads: "2.5M",
    description: "Operate routing channels and inspect traffic.",
    screenshots: [],
    features: ["Routing", "Observability"],
    releases: [
      {
        id: "app-3-linux",
        platformType: "Desktop",
        os: "Linux",
        version: "2.0.0",
        size: "96 MB",
        releaseDate: "2026-05-01",
        artifact: artifactResource("https://apps.example.test/gateway.AppImage"),
        whatsNew: "Provider health probes.",
      },
    ],
  },
];

test("app runtime normalizes app SDK records with catalog artifacts and public-safe defaults", () => {
  const app = normalizeAppApiRecord({
    appId: " app-analytics ",
    name: "  Data Lens  ",
    provider: " SDKWork Apps ",
    description: "  Analyze usage trends.  ",
    categoryName: "",
    iconUrl: "",
    ratingAvg: "4.85",
    installCount: "1234567",
    resourceList: ["Forecasting", "", " Dashboards "],
    assets: [
      { assetType: "cover", asset: imageResource("https://cdn.example.test/cover.png") },
      { assetType: "screenshot", asset: imageResource("https://cdn.example.test/screen-1.png") },
      { type: "screenshot", assetResourceSnapshot: imageResource("https://cdn.example.test/screen-2.png") },
    ],
    artifacts: [
      {
        id: "rel-web",
        platformType: "Web",
        osName: "PC Web",
        version: "2026.05",
        artifact: artifactResource("https://apps.example.test/data"),
        publishedAt: "2026-05-03T10:30:00Z",
        releaseNotes: "Realtime dashboards.",
      },
      {
        id: "rel-win",
        platform_type: "Desktop",
        os_name: "Windows",
        version: "1.2.3",
        artifact_size_bytes: 134217728,
        published_at: "2026-04-01 08:00:00",
      },
    ],
  });

  assert.equal(app.id, "app-analytics");
  assert.equal(app.name, "Data Lens");
  assert.equal(app.developer, "SDKWork Apps");
  assert.equal(app.category, "Uncategorized");
  assert.equal(readMediaResourceUrl(app.image), "https://cdn.example.test/cover.png");
  assert.equal(app.rating, 4.85);
  assert.equal(app.downloads, "1.2M");
  assert.deepEqual(app.features, ["Forecasting", "Dashboards"]);
  assert.deepEqual(app.screenshots.map(readMediaResourceUrl), [
    "https://cdn.example.test/screen-1.png",
    "https://cdn.example.test/screen-2.png",
  ]);
  assert.deepEqual(app.releases.map((release) => release.id), ["rel-web", "rel-win"]);
  assert.equal(readMediaResourceUrl(app.releases[0].artifact), "https://apps.example.test/data");
  assert.equal(readMediaResourceUrl(app.releases[1].artifact), "");
  assert.equal(app.releases[0].releaseDate, "2026-05-03");
  assert.equal(app.releases[1].size, "128 MB");
});

test("app runtime filters and sorts without mutating source apps", () => {
  const filters: AppCatalogFilters = {
    searchQuery: " routing ",
    platformTypes: ["Desktop"],
    categories: ["Development"],
    sortBy: "Most Popular",
  };

  const filtered = filterAppsForCatalog(runtimeApps, filters);

  assert.deepEqual(filtered.map((app) => app.id), ["app-3"]);
  assert.notEqual(filtered, runtimeApps);
  assert.deepEqual(runtimeApps.map((app) => app.id), ["app-1", "app-2", "app-3"]);
  assert.deepEqual(
    filterAppsForCatalog(runtimeApps, {
      searchQuery: "",
      platformTypes: [],
      categories: [],
      sortBy: "Newest",
    }).map((app) => app.id),
    ["app-1", "app-3", "app-2"],
  );
  assert.deepEqual(
    filterAppsForCatalog(runtimeApps, {
      searchQuery: "",
      platformTypes: [],
      categories: [],
      sortBy: "Highest Rated",
    }).map((app) => app.id),
    ["app-1", "app-3", "app-2"],
  );
});

test("app catalog view model derives categories platform badges cards and empty state", () => {
  const view = deriveAppCatalogViewModel({
    apps: runtimeApps,
    categories: ["Development", "Data Analysis"],
    filters: {
      searchQuery: "model usage",
      platformTypes: [],
      categories: [],
      sortBy: "Most Popular",
    },
  });

  assert.deepEqual(view.categoryOptions.map((category) => category.id), ["All", "Data Analysis", "Development"]);
  assert.deepEqual(view.platformOptions.map((platform) => platform.id), ["Desktop", "Mobile", "Web", "Mini Program"]);
  assert.deepEqual(view.sortOptions, ["Most Popular", "Highest Rated", "Newest"]);
  assert.deepEqual(view.appCards.map((app) => app.id), ["app-1"]);
  assert.deepEqual(view.appCards[0].displayOSes, ["PC Web", "Windows"]);
  assert.equal(view.appCards[0].extraOSCount, 0);
  assert.equal(view.resultCount, 1);
  assert.equal(view.emptyStateVisible, false);
});

test("app service sends catalog filters to generated app SDK and preserves server pagination metadata", async () => {
  await withAppSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/app/v3/api/platform/apps/store?page=2&page_size=20&q=studio&category=Content%20Creation&platform_types=Web&sort=rating_desc" && method === "GET") {
        return {
          items: [
            {
              id: "prompt-studio",
              name: "Prompt Studio",
              developer: "SDKWork",
              category: "Content Creation",
              image: "https://cdn.example.test/prompt.png",
              rating: 4.9,
              description: "Build prompt workflows.",
              downloads: "1200",
              screenshots: [],
              features: ["Prompts"],
              releases: [
                {
                  id: "prompt-studio-web",
                  platformType: "Web",
                  os: "PC Web",
                  version: "1.0.0",
                  size: "N/A",
                  releaseDate: "2026-05-20",
                  artifact: artifactResource("https://apps.example.test/prompt-studio"),
                  whatsNew: "Initial release",
                },
              ],
            },
          ],
          total: 21,
          page: 2,
          pageSize: 20,
          hasNextPage: false,
        };
      }
      throw new Error(`Unexpected request ${method} ${url}`);
    },
    async (captured) => {
      const result = await appService.getApps({
        searchQuery: "studio",
        categories: ["Content Creation"],
        platformTypes: ["Web"],
        sortBy: "Highest Rated",
        page: 2,
        pageSize: 20,
      });

      assert.deepEqual(result.items.map((app) => app.id), ["prompt-studio"]);
      assert.equal(result.total, 21);
      assert.equal(result.page, 2);
      assert.equal(result.pageSize, 20);
      assert.equal(result.hasNextPage, false);
      assert.deepEqual(captured.map((request) => `${request.method} ${request.url}`), [
        "GET /app/v3/api/platform/apps/store?page=2&page_size=20&q=studio&category=Content%20Creation&platform_types=Web&sort=rating_desc",
      ]);
    },
  );
});

test("app service preserves multi-platform catalog filters in generated SDK query params", async () => {
  await withAppSdkFetch(
    (url) => {
      const requestUrl = new URL(url, "http://localhost");
      assert.equal(requestUrl.pathname, "/app/v3/api/platform/apps/store");
      assert.equal(requestUrl.searchParams.get("platform_types"), "Desktop,Web");
      assert.equal(requestUrl.searchParams.has("platform_type"), false);
      return {
        items: [
          {
            appId: "desktop-console",
            name: "Desktop Console",
            provider: "SDKWork Apps",
            artifacts: [{ platformType: "Desktop", osName: "Windows", publishedAt: "2026-05-03" }],
          },
          {
            appId: "web-console",
            name: "Web Console",
            provider: "SDKWork Apps",
            artifacts: [{ platformType: "Web", osName: "PC Web", publishedAt: "2026-05-04" }],
          },
        ],
      };
    },
    async () => {
      const result = await appService.getApps({
        platformTypes: ["Desktop", "Web"],
      });

      assert.deepEqual(result.items.map((app) => app.id), ["desktop-console", "web-console"]);
    },
  );
});

test("app detail view derives selected release and download availability deterministically", () => {
  const detail = deriveAppDetailView(runtimeApps, "app-1", "app-1-win");

  assert.equal(detail?.app.id, "app-1");
  assert.equal(detail?.selectedRelease.id, "app-1-win");
  assert.equal(detail?.releaseDateLabel, "2026-04-25");
  assert.equal(detail?.availablePlatformReleases.map((release) => release.id).join(","), "app-1-web");
  assert.equal(isReleaseDownloadable(detail?.selectedRelease), false);
  assert.equal(getReleaseDownloadHref(detail?.selectedRelease), "");
  assert.equal(isReleaseDownloadable(detail?.availablePlatformReleases[0]), true);
  assert.equal(deriveAppDetailView(runtimeApps, "missing"), null);
});

test("app runtime count and date helpers are stable across locales", () => {
  assert.equal(formatAppDateLabel("2026-05-03T10:30:00+08:00"), "2026-05-03");
  assert.equal(formatAppDateLabel("2026-05-03 10:30:00"), "2026-05-03");
  assert.equal(formatAppDateLabel("Continuous"), "Continuous");
  assert.equal(formatAppDateLabel(""), "Unpublished");
  assert.equal(formatAppCount(1234567), "1.2M");
  assert.equal(formatAppCount(8500), "8.5K");
});

test("app detail share URL is canonical and origin-safe", () => {
  assert.equal(
    buildPortalShareUrl("/apps/app-1", "https://portal.example.test/workspace/ignored?debug=true#state"),
    "https://portal.example.test/apps/app-1",
  );
  assert.equal(buildPortalShareUrl("apps/app-1", "https://portal.example.test"), "https://portal.example.test/apps/app-1");
  assert.equal(buildPortalShareUrl("/apps/app-1", ""), "/apps/app-1");
});

test("app service normalizes catalog filters before generated app SDK call", async () => {
  await withAppSdkFetch(
    (url) => {
      const requestUrl = new URL(url, "http://localhost");
      assert.equal(requestUrl.pathname, "/app/v3/api/platform/apps/store");
      assert.equal(requestUrl.searchParams.get("page"), "2");
      assert.equal(requestUrl.searchParams.get("page_size"), "25");
      assert.equal(requestUrl.searchParams.get("q"), "data lens");
      assert.equal(requestUrl.searchParams.get("category"), "Data Analysis");
      assert.equal(requestUrl.searchParams.get("platform_types"), "Web");
      assert.equal(requestUrl.searchParams.has("platform_type"), false);
      assert.equal(requestUrl.searchParams.get("sort"), "newest_desc");
      assert.equal(requestUrl.searchParams.has("search_query"), false);
      assert.equal(requestUrl.searchParams.get("status"), "ACTIVE");
      assert.equal(requestUrl.searchParams.get("start_time"), "2026-05-01T00:00:00Z");
      assert.equal(requestUrl.searchParams.get("end_time"), "2026-05-31T23:59:59Z");
      assert.equal(requestUrl.searchParams.has("search"), false);
      assert.equal(requestUrl.searchParams.has("platformTypes"), false);
      assert.equal(requestUrl.searchParams.has("categories"), false);
      assert.equal(requestUrl.searchParams.has("sortBy"), false);
      assert.equal(requestUrl.searchParams.has("ignored"), false);
      assert.equal(requestUrl.searchParams.has("empty"), false);
      return {
        items: [
          {
            appId: "app-1",
            name: "Data Lens",
            provider: "SDKWork Apps",
            categoryName: "Data Analysis",
            artifacts: [{ platformType: "Web", osName: "PC Web", publishedAt: "2026-05-03" }],
          },
          {
            appId: "app-2",
            name: "Prompt Studio",
            provider: "CreativeAI",
            categoryName: "Content Creation",
            artifacts: [{ platformType: "Mobile", osName: "iOS", publishedAt: "2026-04-01" }],
          },
        ],
      };
    },
    async (captured) => {
      const result = await appService.getApps({
        searchQuery: " data lens ",
        page: "2",
        pageSize: "25",
        status: "ACTIVE",
        startTime: " 2026-05-01T00:00:00Z ",
        endTime: " 2026-05-31T23:59:59Z ",
        platformTypes: ["Web"],
        categories: ["Data Analysis"],
        sortBy: "Newest",
        ignored: "drop-me",
        empty: "",
      } as any);

      assert.equal(captured.length, 1);
      assert.deepEqual(result.items.map((app) => app.id), ["app-1", "app-2"]);
    },
  );
});

test("app service rejects invalid catalog query filters before generated app SDK call", async () => {
  await withAppSdkFetch(
    () => {
      throw new Error("app SDK must not be called for invalid app catalog filters");
    },
    async (captured) => {
      await assert.rejects(() => appService.getApps({ page: 0 } as any), /page must be a positive integer/);
      await assert.rejects(() => appService.getApps({ page: "abc" } as any), /page must be a positive integer/);
      await assert.rejects(() => appService.getApps({ pageSize: 0 } as any), /pageSize must be between 1 and 100/);
      await assert.rejects(() => appService.getApps({ pageSize: 101 } as any), /pageSize must be between 1 and 100/);
      await assert.rejects(
        () => appService.getApps({ searchQuery: "x".repeat(129) } as any),
        /searchQuery must be at most 128 characters/,
      );
      await assert.rejects(
        () => appService.getApps({ startTime: { value: "2026-05-01T00:00:00Z" } } as any),
        /startTime must be a string/,
      );
      for (const status of ["active", "ENABLED", "DISABLED", "1", "0", "PUBLISHED", "OFFLINE"]) {
        await assert.rejects(
          () => appService.getApps({ status } as any),
          /status must be ACTIVE or INACTIVE/,
        );
      }
      assert.equal(captured.length, 0);
    },
  );
});

test("app service rejects unsafe app detail ids before generated app SDK call", async () => {
  await withAppSdkFetch(
    () => {
      throw new Error("app SDK must not be called for invalid app detail ids");
    },
    async (captured) => {
      await assert.rejects(() => appService.getAppById(""), /appId is required/);
      await assert.rejects(() => appService.getAppById(" app-1 "), /appId must be a safe path segment/);
      await assert.rejects(() => appService.getAppById("../admin"), /appId must be a safe path segment/);
      await assert.rejects(() => appService.getAppById("app/1"), /appId must be a safe path segment/);
      await assert.rejects(() => appService.getAppById("app?debug=true"), /appId must be a safe path segment/);
      assert.equal(captured.length, 0);
    },
  );
});

test("app service returns undefined when detail response data is null", async () => {
  await withAppSdkFetch(
    (url, init) => {
      assert.equal(url, "/app/v3/api/platform/apps/store/missing-app");
      assert.equal(init?.method ?? "GET", "GET");
      return null;
    },
    async (captured) => {
      const result = await appService.getAppById("missing-app");

      assert.equal(result, undefined);
      assert.equal(captured.length, 1);
    },
  );
});

test("app service fails closed when detail response does not contain an app entity", async () => {
  await withAppSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/platform/apps/store/app-1" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              appId: "wrong-list-row",
              name: "Wrong List Row",
              provider: "SDKWork Apps",
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => appService.getAppById("app-1"),
        /App detail response is missing data/,
      );
    },
  );
});

test("app service fails closed when catalog response contains malformed app rows", async () => {
  await withAppSdkFetch(
    (url, init) => {
      if (url === "/app/v3/api/platform/apps/store" && (init?.method ?? "GET") === "GET") {
        return { items: ["not-an-app-record"] };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => appService.getApps(),
        /App record is required/,
      );
    },
  );
});

test("app service fails closed when catalog response omits required app identity fields", async () => {
  for (const [field, message] of [
    ["appId", /App id is required/],
    ["name", /App name is required/],
    ["provider", /App developer is required/],
  ] as const) {
    await withAppSdkFetch(
      (url, init) => {
        if (url === "/app/v3/api/platform/apps/store" && (init?.method ?? "GET") === "GET") {
          const app = {
            appId: "app-1",
            name: "Data Lens",
            provider: "SDKWork Apps",
            categoryName: "Data Analysis",
            artifacts: [{ platformType: "Web", osName: "PC Web", publishedAt: "2026-05-03" }],
          } as Record<string, unknown>;
          delete app[field];
          return { items: [app] };
        }
        throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
      },
      async () => {
        await assert.rejects(
          () => appService.getApps(),
          message,
        );
      },
    );
  }
});

test("app runtime fails closed when release platform contract drifts", () => {
  assert.throws(
    () =>
      normalizeAppApiRecord({
        appId: "app-1",
        name: "Data Lens",
        provider: "SDKWork Apps",
        categoryName: "Data Analysis",
        artifacts: [{ platformType: "Console", osName: "PC Web", publishedAt: "2026-05-03" }],
      }),
    /Unsupported app platform type: Console/,
  );
  assert.throws(
    () =>
      normalizeAppApiRecord({
        appId: "app-1",
        name: "Data Lens",
        provider: "SDKWork Apps",
        categoryName: "Data Analysis",
        artifacts: [{ platformType: "Web", osName: "Solaris", publishedAt: "2026-05-03" }],
      }),
    /Unsupported app operating system: Solaris/,
  );
});

test("app detail page wires visible share control to canonical copy behavior", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-app-center/src/pages/AppDetails.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /CopyButton/u);
  assert.match(source, /buildPortalShareUrl\(`\/apps\/\$\{detailApp\.id\}`/u);
  assert.doesNotMatch(source, /<button className="p-3 rounded-xl[\s\S]*?<Share2/u);
  assert.doesNotMatch(source, /\bfetch\s*\(/u);
  assert.doesNotMatch(source, /\baxios\b/u);
});

test("app runtime release models keep artifacts as media resources until the download boundary", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-clawrouter-pc-app-center/src/appRuntime.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /artifact\?: ClawRouterMediaResource/u);
  assert.match(source, /readMediaResource\(item\.artifact\)/u);
  assert.match(source, /readMediaResourceUrl\(release\?\.artifact\)/u);
  assert.doesNotMatch(source, /\bdownloadUrl:\s*string\b/u);
  assert.doesNotMatch(source, /downloadUrl:\s*readString\(item,\s*'downloadUrl'\)/u);
  assert.doesNotMatch(source, /readString\(item,\s*'downloadUrl'\)/u);
});
