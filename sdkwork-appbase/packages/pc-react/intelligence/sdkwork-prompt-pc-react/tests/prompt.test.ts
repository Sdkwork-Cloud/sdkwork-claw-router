import { describe, expect, it } from "vitest";
import {
  compilePromptAsset,
  compilePromptBundle,
  createPromptAssetDigest,
  createPromptDetailRouteIntent,
  createPromptLibraryRouteIntent,
  createPromptWorkspaceManifest,
  evaluatePromptBundleExecutionReadiness,
  evaluatePromptExecutionReadiness,
  filterPromptCatalog,
  renderPromptTemplate,
  resolvePromptVersion,
  summarizePromptAssetDigests,
} from "../src";

const promptAssets = [
  {
    id: "ops-system",
    kind: "system",
    name: "Ops System Prompt",
    summary: "Shared incident-response system instructions.",
    tags: ["ops", "incident"],
    usageCount: 42,
    variables: [
      {
        defaultValue: "sev-2",
        id: "severity",
        label: "Severity",
        required: false,
        type: "string",
      },
      {
        id: "team",
        label: "Team",
        required: true,
        type: "string",
      },
      {
        id: "context",
        label: "Context",
        required: true,
        type: "string",
      },
    ],
    versions: [
      {
        createdAt: 100,
        id: "ops-system-v1",
        labels: ["prod"],
        messages: [
          {
            id: "ops-system-message",
            role: "system",
            template:
              "You support the {{team}} team for a {{severity}} incident. Use this context: {{context}}",
          },
        ],
        status: "published",
        version: 1,
      },
      {
        createdAt: 200,
        id: "ops-system-v2",
        labels: ["staging"],
        messages: [
          {
            id: "ops-system-message-v2",
            role: "system",
            template:
              "You are the incident commander for {{team}}. Severity: {{severity}}. Context: {{context}}",
          },
        ],
        status: "draft",
        version: 2,
      },
    ],
    visibility: "shared",
  },
  {
    id: "incident-task",
    kind: "chat",
    name: "Incident Task Prompt",
    summary: "Reusable task prompt for chat and handoff requests.",
    tags: ["ops", "chat"],
    usageCount: 18,
    variables: [
      {
        id: "question",
        label: "Question",
        required: true,
        type: "string",
      },
    ],
    versions: [
      {
        createdAt: 150,
        id: "incident-task-v1",
        labels: ["prod"],
        messages: [
          {
            id: "incident-task-message",
            role: "user",
            template: "Question: {{question}}",
          },
        ],
        status: "published",
        version: 1,
      },
    ],
    visibility: "public",
  },
  {
    id: "research-review",
    kind: "workflow",
    name: "Research Review Prompt",
    summary: "Draft-only review prompt for workflow experiments.",
    tags: ["workflow", "review"],
    usageCount: 3,
    variables: [
      {
        id: "topic",
        label: "Topic",
        required: true,
        type: "string",
      },
      {
        id: "sources",
        label: "Sources",
        required: false,
        type: "string-list",
      },
    ],
    versions: [
      {
        createdAt: 250,
        id: "research-review-v1",
        labels: ["preview"],
        messages: [
          {
            id: "research-review-message",
            role: "system",
            template: "Review {{topic}} using sources: {{sources}}",
          },
        ],
        status: "draft",
        version: 1,
      },
    ],
    visibility: "private",
  },
] as const;

describe("sdkwork-prompt-pc-react", () => {
  it("filters prompt catalog entries and resolves prompt versions by label or explicit version", () => {
    expect(
      filterPromptCatalog(promptAssets, {
        labels: ["prod"],
        query: "incident",
        sort: "popular",
        tags: ["ops"],
      }).map((asset) => asset.id),
    ).toEqual(["ops-system", "incident-task"]);

    expect(resolvePromptVersion(promptAssets[0], { label: "prod" })).toEqual(
      promptAssets[0].versions[0],
    );
    expect(resolvePromptVersion(promptAssets[0])).toEqual(promptAssets[0].versions[0]);
    expect(resolvePromptVersion(promptAssets[0], { version: 2 })).toEqual(
      promptAssets[0].versions[1],
    );
  });

  it("renders prompt templates with defaults and reports missing required variables", () => {
    expect(
      renderPromptTemplate(
        "Handle {{team}} with {{severity}} priority. Context: {{context}}",
        {
          team: "Platform",
        },
        promptAssets[0].variables,
      ),
    ).toEqual({
      missingVariables: ["context"],
      output: "Handle Platform with sev-2 priority. Context: {{context}}",
      ready: false,
      usedVariables: ["team", "severity", "context"],
    });
  });

  it("compiles prompt assets and bundles into provider-neutral message stacks", () => {
    expect(
      compilePromptAsset(promptAssets[0], {
        label: "prod",
        values: {
          context: "Payment API latency increased after the latest deploy.",
          team: "SRE",
        },
      }),
    ).toEqual({
      assetId: "ops-system",
      label: "prod",
      messages: [
        {
          parts: [
            {
              text:
                "You support the SRE team for a sev-2 incident. Use this context: Payment API latency increased after the latest deploy.",
              type: "text",
            },
          ],
          role: "system",
        },
      ],
      missingVariables: [],
      ready: true,
      usedVariables: ["team", "severity", "context"],
      version: 1,
      versionId: "ops-system-v1",
    });

    expect(
      compilePromptBundle(
        {
          entries: [
            {
              assetId: "ops-system",
              label: "prod",
              slot: "system",
            },
            {
              assetId: "incident-task",
              slot: "task",
            },
          ],
          id: "incident-review",
          name: "Incident Review",
        },
        promptAssets,
        {
          values: {
            "incident-task": {
              question: "Summarize the last deploy and propose a rollback decision.",
            },
            "ops-system": {
              context: "Payment API latency increased after the latest deploy.",
              team: "SRE",
            },
          },
        },
      ),
    ).toEqual({
      bundleId: "incident-review",
      entries: [
        {
          compiled: {
            assetId: "ops-system",
            label: "prod",
            messages: [
              {
                parts: [
                  {
                    text:
                      "You support the SRE team for a sev-2 incident. Use this context: Payment API latency increased after the latest deploy.",
                    type: "text",
                  },
                ],
                role: "system",
              },
            ],
            missingVariables: [],
            ready: true,
            usedVariables: ["team", "severity", "context"],
            version: 1,
            versionId: "ops-system-v1",
          },
          slot: "system",
        },
        {
          compiled: {
            assetId: "incident-task",
            messages: [
              {
                parts: [
                  {
                    text: "Question: Summarize the last deploy and propose a rollback decision.",
                    type: "text",
                  },
                ],
                role: "user",
              },
            ],
            missingVariables: [],
            ready: true,
            usedVariables: ["question"],
            version: 1,
            versionId: "incident-task-v1",
          },
          slot: "task",
        },
      ],
      messages: [
        {
          parts: [
            {
              text:
                "You support the SRE team for a sev-2 incident. Use this context: Payment API latency increased after the latest deploy.",
              type: "text",
            },
          ],
          role: "system",
        },
        {
          parts: [
            {
              text: "Question: Summarize the last deploy and propose a rollback decision.",
              type: "text",
            },
          ],
          role: "user",
        },
      ],
      missingVariables: [],
      ready: true,
    });
  });

  it("creates prompt asset digests and summarizes prompt libraries", () => {
    expect(createPromptAssetDigest(promptAssets[0])).toEqual({
      defaultVersion: 1,
      defaultVersionId: "ops-system-v1",
      defaultVersionStatus: "published",
      id: "ops-system",
      kind: "system",
      labels: ["prod", "staging"],
      latestVersion: 2,
      latestVersionStatus: "draft",
      name: "Ops System Prompt",
      optionalVariableCount: 1,
      publishedVersion: 1,
      publishedVersionId: "ops-system-v1",
      requiredVariableCount: 2,
      tagCount: 2,
      updatedAt: 200,
      usageCount: 42,
      variableCount: 3,
      versionCount: 2,
      visibility: "shared",
    });

    expect(summarizePromptAssetDigests(promptAssets.map(createPromptAssetDigest))).toEqual({
      archivedDefaultAssets: 0,
      assetCount: 3,
      draftDefaultAssets: 1,
      kindCounts: {
        agent: 0,
        chat: 1,
        system: 1,
        workflow: 1,
      },
      latestUpdatedAt: 250,
      privateAssets: 1,
      publicAssets: 1,
      publishedDefaultAssets: 2,
      sharedAssets: 1,
      totalRequiredVariables: 4,
      totalUsageCount: 63,
      totalVersions: 4,
      uniqueLabelCount: 3,
    });
  });

  it("evaluates prompt execution readiness without throwing for draft or versionless prompts", () => {
    expect(
      evaluatePromptExecutionReadiness(promptAssets[0], {
        label: "staging",
        values: {
          team: "Platform",
        },
      }),
    ).toEqual({
      assetId: "ops-system",
      compiled: {
        assetId: "ops-system",
        label: "staging",
        messages: [
          {
            parts: [
              {
                text: "You are the incident commander for Platform. Severity: sev-2. Context: {{context}}",
                type: "text",
              },
            ],
            role: "system",
          },
        ],
        missingVariables: ["context"],
        ready: false,
        usedVariables: ["team", "severity", "context"],
        version: 2,
        versionId: "ops-system-v2",
      },
      degraded: true,
      issues: ["draft-version", "missing-variables"],
      ready: false,
      status: "draft",
      version: 2,
      versionId: "ops-system-v2",
    });

    expect(
      evaluatePromptExecutionReadiness({
        id: "versionless-note",
        kind: "system",
        name: "Versionless Note",
        tags: [],
        variables: [],
        versions: [],
        visibility: "private",
      }),
    ).toEqual({
      assetId: "versionless-note",
      degraded: false,
      issues: ["no-version"],
      ready: false,
    });
  });

  it("evaluates prompt bundle execution readiness across degraded, incomplete, and missing entries", () => {
    expect(
      evaluatePromptBundleExecutionReadiness(
        {
          entries: [
            {
              assetId: "ops-system",
              label: "staging",
              slot: "system",
            },
            {
              assetId: "incident-task",
              slot: "task",
            },
            {
              assetId: "missing-checklist",
              slot: "checklist",
            },
          ],
          id: "incident-follow-up",
          name: "Incident Follow Up",
        },
        promptAssets,
        {
          values: {
            "incident-task": {},
            "ops-system": {
              context: "Payment API latency increased after the latest deploy.",
              team: "SRE",
            },
          },
        },
      ),
    ).toEqual({
      bundle: {
        bundleId: "incident-follow-up",
        entries: [
          {
            compiled: {
              assetId: "ops-system",
              label: "staging",
              messages: [
                {
                  parts: [
                    {
                      text: "You are the incident commander for SRE. Severity: sev-2. Context: Payment API latency increased after the latest deploy.",
                      type: "text",
                    },
                  ],
                  role: "system",
                },
              ],
              missingVariables: [],
              ready: true,
              usedVariables: ["team", "severity", "context"],
              version: 2,
              versionId: "ops-system-v2",
            },
            slot: "system",
          },
          {
            compiled: {
              assetId: "incident-task",
              messages: [
                {
                  parts: [
                    {
                      text: "Question: {{question}}",
                      type: "text",
                    },
                  ],
                  role: "user",
                },
              ],
              missingVariables: ["question"],
              ready: false,
              usedVariables: ["question"],
              version: 1,
              versionId: "incident-task-v1",
            },
            slot: "task",
          },
        ],
        messages: [
          {
            parts: [
              {
                text: "You are the incident commander for SRE. Severity: sev-2. Context: Payment API latency increased after the latest deploy.",
                type: "text",
              },
            ],
            role: "system",
          },
          {
            parts: [
              {
                text: "Question: {{question}}",
                type: "text",
              },
            ],
            role: "user",
          },
        ],
        missingVariables: [
          {
            assetId: "incident-task",
            variableId: "question",
          },
        ],
        ready: false,
      },
      bundleId: "incident-follow-up",
      degraded: true,
      entries: [
        {
          assetId: "ops-system",
          compiled: {
            assetId: "ops-system",
            label: "staging",
            messages: [
              {
                parts: [
                  {
                    text: "You are the incident commander for SRE. Severity: sev-2. Context: Payment API latency increased after the latest deploy.",
                    type: "text",
                  },
                ],
                role: "system",
              },
            ],
            missingVariables: [],
            ready: true,
            usedVariables: ["team", "severity", "context"],
            version: 2,
            versionId: "ops-system-v2",
          },
          degraded: true,
          issues: ["draft-version"],
          ready: true,
          slot: "system",
          status: "draft",
          version: 2,
          versionId: "ops-system-v2",
        },
        {
          assetId: "incident-task",
          compiled: {
            assetId: "incident-task",
            messages: [
              {
                parts: [
                  {
                    text: "Question: {{question}}",
                    type: "text",
                  },
                ],
                role: "user",
              },
            ],
            missingVariables: ["question"],
            ready: false,
            usedVariables: ["question"],
            version: 1,
            versionId: "incident-task-v1",
          },
          degraded: false,
          issues: ["missing-variables"],
          ready: false,
          slot: "task",
          status: "published",
          version: 1,
          versionId: "incident-task-v1",
        },
        {
          assetId: "missing-checklist",
          degraded: false,
          issues: ["missing-asset"],
          ready: false,
          slot: "checklist",
        },
      ],
      issues: ["draft-version", "missing-variables", "missing-asset"],
      ready: false,
    });
  });

  it("creates prompt workspace manifests and route intents", () => {
    expect(
      createPromptWorkspaceManifest({
        packageNames: [
          "@sdkwork/prompt-pc-react",
          "@sdkwork/llm-pc-react",
          "@sdkwork/prompt-pc-react",
        ],
        title: "Prompts",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "prompt",
      description: "Prompt workspace for versioned assets, runtime labels, and reusable prompt bundles.",
      detailRoutePattern: "/prompts/:promptId",
      editorRoutePattern: "/prompts/:promptId/versions/:version",
      host: "tauri",
      id: "sdkwork-prompt",
      packageNames: ["@sdkwork/prompt-pc-react", "@sdkwork/llm-pc-react"],
      routePath: "/prompts",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Prompts",
    });

    expect(
      createPromptLibraryRouteIntent({
        kind: "chat",
        label: "prod",
        tag: "ops",
      }),
    ).toEqual({
      focusWindow: true,
      kind: "chat",
      label: "prod",
      route: "/prompts?kind=chat&label=prod&tag=ops",
      source: "prompt-library",
      tag: "ops",
      type: "prompt-library-route-intent",
    });

    expect(
      createPromptDetailRouteIntent("ops-system", {
        version: 2,
      }),
    ).toEqual({
      focusWindow: true,
      promptId: "ops-system",
      route: "/prompts/ops-system/versions/2",
      source: "prompt-library",
      type: "prompt-detail-route-intent",
      version: 2,
    });
  });
});
