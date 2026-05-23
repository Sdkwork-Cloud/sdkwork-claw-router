import { describe, expect, it } from "vitest";
import { reduceLlmStreamEvents } from "@sdkwork/llm-pc-react";
import {
  appendChatMessageToSession,
  applyLlmSummaryToAssistantChatMessage,
  composeOutgoingChatMessageText,
  createChatLlmMessages,
  createChatSession,
  createChatSessionDigest,
  createChatSessionDetailRouteIntent,
  createChatWorkspaceManifest,
  createChatWorkspaceRouteIntent,
  createOptimisticAssistantChatMessage,
  evaluateChatComposerSendState,
  evaluateChatExecutionReadiness,
  getChatSessionDisplayTitle,
  resolveInitialChatSessionTitle,
  summarizeChatSessionDigests,
} from "../src";

const attachments = [
  {
    id: "att-1",
    kind: "image",
    mimeType: "image/png",
    name: "Architecture Diagram.png",
    url: "https://example.com/diagram.png",
  },
] as const;

const fileAttachment = {
  id: "att-2",
  kind: "document",
  mimeType: "application/pdf",
  name: "Execution Spec.pdf",
  url: "https://example.com/spec.pdf",
} as const;

const model = {
  capabilities: ["reasoning", "structured-output", "tool-calling", "vision"],
  contextWindowTokens: 400_000,
  id: "gpt-5.4",
  providerId: "openai",
} as const;

const localFallbackRoute = {
  allowedModelIds: ["gpt-5.4"],
  averageLatencyMs: 120,
  enabled: true,
  health: "healthy",
  id: "local-fallback",
  label: "Local Fallback",
  priority: 40,
  protocol: "openai-chat-completions",
  providerId: "openai",
  supportsReasoning: false,
  supportsStreaming: false,
  supportsStructuredOutput: false,
  supportsToolCalling: true,
  supportsVision: false,
} as const;

describe("sdkwork-chat-pc-react", () => {
  it("maps chat history and draft attachments into llm message contracts", () => {
    expect(
      createChatLlmMessages({
        draftAttachments: [fileAttachment],
        draftText: "Summarize the rollout plan.",
        messages: [
          {
            attachments,
            content: "Review this architecture diagram.",
            role: "user",
          },
          {
            attachments: [],
            content: "The system looks stable.",
            role: "assistant",
          },
        ],
        systemPrompt: "Be concise.",
      }),
    ).toEqual([
      {
        parts: [{ text: "Be concise.", type: "text" }],
        role: "system",
      },
      {
        parts: [
          { text: "Review this architecture diagram.", type: "text" },
          { mimeType: "image/png", type: "image", url: "https://example.com/diagram.png" },
        ],
        role: "user",
      },
      {
        parts: [{ text: "The system looks stable.", type: "text" }],
        role: "assistant",
      },
      {
        parts: [
          { text: "Summarize the rollout plan.", type: "text" },
          {
            fileId: "att-2",
            mimeType: "application/pdf",
            type: "file",
            url: "https://example.com/spec.pdf",
          },
        ],
        role: "user",
      },
    ]);
  });

  it("derives readable session titles from the first user message and preserves display fallbacks", () => {
    const session = createChatSession({
      createdAt: 100,
      id: "session-1",
      title: "thread:sdkwork-studio:opaque",
    });

    const nextSession = appendChatMessageToSession(session, {
      attachments,
      content: "  Design a desktop AI cockpit for finance teams  ",
      createdAt: 200,
      id: "message-1",
      role: "user",
      status: "completed",
      toolCalls: [],
      updatedAt: 200,
    });

    expect(
      resolveInitialChatSessionTitle({
        attachments,
        existingTitle: "thread:sdkwork-studio:opaque",
        isFirstUserMessage: true,
        text: "  Design a desktop AI cockpit for finance teams  ",
      }),
    ).toBe("Design a desktop AI cockpit for finance teams");

    expect(nextSession.title).toBe("Design a desktop AI cockpit for finance teams");
    expect(nextSession.lastMessagePreview).toBe("Design a desktop AI cockpit for finance teams");
    expect(
      getChatSessionDisplayTitle({
        ...nextSession,
        title: "thread:sdkwork-studio:opaque",
      }),
    ).toBe("Design a desktop AI cockpit for finance teams");
  });

  it("composes outgoing text with attachment summaries and reports explicit send blockers", () => {
    expect(composeOutgoingChatMessageText("", attachments)).toBe(
      "The user sent attachments without additional text.\n\nAttachments:\n1. [image] Architecture Diagram.png\nMIME: image/png\nURL: https://example.com/diagram.png",
    );

    expect(
      evaluateChatComposerSendState({
        attachmentCount: attachments.length,
        hasActiveModel: false,
        isStreaming: true,
        isUploadingAttachments: true,
        text: "   ",
      }),
    ).toEqual({
      attachmentCount: 1,
      blockers: ["no-model", "uploading-attachments", "streaming"],
      canSend: false,
      hasContent: true,
      textLength: 0,
    });

    expect(
      evaluateChatComposerSendState({
        attachmentCount: 0,
        hasActiveModel: true,
        text: "Ship the release notes.",
      }).canSend,
    ).toBe(true);
  });

  it("evaluates unified chat execution readiness from composer state plus llm route readiness", () => {
    expect(
      evaluateChatExecutionReadiness({
        attachments,
        draftText: "Describe the image and answer in JSON.",
        hasActiveModel: true,
        messages: [
          {
            attachments: [],
            content: "You are a precise assistant.",
            role: "system",
          },
        ],
        mode: "stream",
        model,
        outputFormat: "json-schema",
        reasoningEffort: "deep",
        routes: [localFallbackRoute],
        tools: [{ id: "web-search", name: "web_search", type: "function" }],
      }),
    ).toMatchObject({
      composer: {
        attachmentCount: 1,
        blockers: [],
        canSend: true,
        hasContent: true,
      },
      degraded: true,
      execution: {
        candidateRouteIds: ["local-fallback"],
        degraded: true,
        issues: [
          "streaming-degraded",
          "structured-output-degraded",
          "reasoning-degraded",
          "vision-degraded",
        ],
        plan: {
          mode: "sync",
          routeId: "local-fallback",
        },
        ready: true,
      },
      issues: [
        "streaming-degraded",
        "structured-output-degraded",
        "reasoning-degraded",
        "vision-degraded",
      ],
      ready: true,
    });
  });

  it("creates optimistic assistant messages and finalizes them from llm summaries", () => {
    const optimisticMessage = createOptimisticAssistantChatMessage({
      createdAt: 1_000,
      id: "assistant-1",
      modelId: "gpt-5.4",
    });

    const summary = reduceLlmStreamEvents([
      {
        modelId: "gpt-5.4",
        requestId: "req-1",
        routeId: "openai-primary",
        startedAt: 1_050,
        type: "start",
      },
      {
        at: 1_200,
        delta: "Here is the rollout plan.",
        type: "text-delta",
      },
      {
        at: 1_250,
        delta: "Thinking through the edge cases.",
        type: "reasoning-delta",
      },
      {
        argumentsText: "{\"query\":\"release checklist\"}",
        at: 1_300,
        name: "web_search",
        toolCallId: "tool-1",
        type: "tool-call",
      },
      {
        at: 1_600,
        finishReason: "completed",
        type: "finish",
      },
    ]);

    expect(optimisticMessage).toEqual({
      attachments: [],
      content: "",
      createdAt: 1_000,
      id: "assistant-1",
      modelId: "gpt-5.4",
      role: "assistant",
      status: "streaming",
      toolCalls: [],
      updatedAt: 1_000,
    });

    expect(applyLlmSummaryToAssistantChatMessage(optimisticMessage, summary)).toEqual({
      attachments: [],
      content: "Here is the rollout plan.",
      createdAt: 1_000,
      id: "assistant-1",
      modelId: "gpt-5.4",
      reasoningText: "Thinking through the edge cases.",
      requestId: "req-1",
      role: "assistant",
      status: "completed",
      toolCalls: [
        {
          argumentsText: "{\"query\":\"release checklist\"}",
          id: "tool-1",
          name: "web_search",
        },
      ],
      updatedAt: 1_600,
    });
  });

  it("creates stable session digests and digest summaries for sidebars and launchers", () => {
    const session = appendChatMessageToSession(
      appendChatMessageToSession(
        createChatSession({
          createdAt: 100,
          id: "session-2",
          modelId: "gpt-5.4",
        }),
        {
          attachments,
          content: "Review the uploaded architecture.",
          createdAt: 120,
          id: "message-1",
          role: "user",
          status: "completed",
          toolCalls: [],
          updatedAt: 120,
        },
      ),
      {
        attachments: [],
        content: "The deployment path is blocked by permissions.",
        createdAt: 180,
        error: {
          code: "permission-denied",
          message: "The deployment command was denied.",
        },
        id: "message-2",
        role: "assistant",
        status: "failed",
        toolCalls: [],
        updatedAt: 180,
      },
    );

    const digest = createChatSessionDigest(session);

    expect(digest).toEqual({
      hasAttachments: true,
      id: "session-2",
      messageCount: 2,
      modelId: "gpt-5.4",
      preview: "The deployment path is blocked by permissions.",
      state: "failed",
      title: "Review the uploaded architecture.",
      updatedAt: 180,
    });

    expect(summarizeChatSessionDigests([digest])).toEqual({
      failedSessions: 1,
      sessionsWithAttachments: 1,
      streamingSessions: 0,
      totalMessages: 2,
      totalSessions: 1,
    });
  });

  it("creates chat workspace manifests and route intents", () => {
    expect(
      createChatWorkspaceManifest({
        packageNames: [
          "@sdkwork/chat-pc-react",
          "@sdkwork/llm-pc-react",
          "@sdkwork/chat-pc-react",
        ],
        title: "Chat",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "chat",
      description: "Chat workspace for sessions, attachment-aware composition, and assistant execution state.",
      host: "tauri",
      id: "sdkwork-chat",
      packageNames: ["@sdkwork/chat-pc-react", "@sdkwork/llm-pc-react"],
      routePath: "/chat",
      sessionRoutePattern: "/chat/sessions/:sessionId",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Chat",
      workspaceRoutePattern: "/chat",
    });

    expect(
      createChatWorkspaceRouteIntent({
        modelId: "gpt-5.4",
        sessionId: "session-1",
      }),
    ).toEqual({
      focusWindow: true,
      modelId: "gpt-5.4",
      route: "/chat?model=gpt-5.4&session=session-1",
      sessionId: "session-1",
      source: "chat-workspace",
      type: "chat-workspace-route-intent",
    });

    expect(createChatSessionDetailRouteIntent("session-1")).toEqual({
      focusWindow: true,
      route: "/chat/sessions/session-1",
      sessionId: "session-1",
      source: "chat-workspace",
      type: "chat-session-detail-route-intent",
    });
  });
});
