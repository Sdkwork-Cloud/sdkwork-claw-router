const makePackage = (directory, description, derivedFrom = []) => ({
  directory,
  description,
  derivedFrom,
});

const pcReactDomains = [
  {
    domain: "foundation",
    summary: "Application composition, shell, routing, and workspace orchestration.",
    packages: [
      makePackage("sdkwork-appbase-pc-react", "Composable application preset and feature registry.", ["sdkwork-studio", "sdkwork-chat-pc-react"]),
      makePackage("sdkwork-i18n-pc-react", "SDKWork PC React internationalization runtime and message catalog facade.", ["sdkwork-auth-pc-react"]),
      makePackage("sdkwork-shell-pc-react", "AppRoot, providers, startup bootstrap, and shell lifecycle.", ["sdkwork-shell", "sdkwork-notes-shell"]),
      makePackage("sdkwork-router-pc-react", "Route registration, navigation manifests, and access guards.", ["sdkwork-cloud-portal"]),
      makePackage("sdkwork-workspace-pc-react", "Workbench panels, tabs, dock regions, and layout state.", ["sdkwork-studio", "sdkwork-desktop-settings"]),
      makePackage("sdkwork-command-pc-react", "Command palette, keyboard shortcuts, and global actions.", ["sdkwork-studio", "magic-studio-v2"]),
      makePackage("sdkwork-search-pc-react", "Global search orchestration and cross-capability result routing.", ["sdkwork-chat-pc-react", "sdkwork-cloud-portal"]),
    ],
  },
  {
    domain: "host",
    summary: "Host abstraction and desktop runtime adapters.",
    packages: [
      makePackage("sdkwork-host-pc-react", "Host capability contracts shared by all PC React applications.", ["sdkwork-studio", "sdkwork-desktop-settings"]),
      makePackage("sdkwork-host-tauri-pc-react", "Tauri-specific host adapter and plugin wiring.", ["sdkwork-desktop", "sdkwork-notes-desktop", "sdkwork-drive-desktop"]),
      makePackage("sdkwork-desktop-pc-react", "Desktop feature composition for windows, updater, files, and process launch.", ["sdkwork-desktop", "codebox"]),
    ],
  },
  {
    domain: "system",
    summary: "Settings, permissions, dashboard, home, and help surfaces.",
    packages: [
      makePackage("sdkwork-settings-pc-react", "Settings center and desktop preference composition.", ["sdkwork-settings", "sdkwork-desktop-settings"]),
      makePackage("sdkwork-permission-pc-react", "Capability gates and role-aware action checks.", ["sdkwork-cloud-portal"]),
      makePackage("sdkwork-home-pc-react", "Home surfaces, onboarding, and quick launch cards.", ["sdkwork-cloud-portal", "sdkwork-studio"]),
      makePackage("sdkwork-dashboard-pc-react", "Overview dashboards, KPI cards, and activity feeds.", ["sdkwork-dashboard"]),
      makePackage("sdkwork-apps-pc-react", "Application center and installable capability listings.", ["sdkwork-apps", "sdkwork-cloud-portal"]),
      makePackage("sdkwork-support-pc-react", "Feedback center and support workflows.", ["sdkwork-pc-portal-support", "sdkwork-studio"]),
      makePackage("sdkwork-docs-pc-react", "Documentation browsing and in-product guides.", ["sdkwork-docs", "sdkwork-pc-portal-docs"]),
      makePackage("sdkwork-news-pc-react", "Announcements and release highlight feeds.", ["sdkwork-pc-portal-news", "sdkwork-studio"]),
      makePackage("sdkwork-about-pc-react", "About screens and runtime metadata presentation.", ["sdkwork-pc-portal-about", "sdkwork-desktop-settings"]),
    ],
  },
  {
    domain: "notification",
    summary: "Cross-application notification center, inbox, popup, badge, and generated app SDK-backed read state.",
    packages: [
      makePackage("sdkwork-notification-pc-react", "Toast, inbox, badge, popup, and generated app SDK notification orchestration.", ["sdkwork-chat-pc-react", "sdkwork-react-notifications"]),
    ],
  },
  {
    domain: "iam",
    summary: "Tenant, organization, user, authentication, authorization, session, user-center, and security capabilities.",
    packages: [
      makePackage("sdkwork-iam-react", "React provider and hooks over the common IAM runtime.", ["sdkwork-auth-pc-react", "sdkwork-user-center-pc-react"]),
      makePackage("sdkwork-iam-core-pc-react", "Compatibility aggregation package for common IAM contracts, SDK ports, service, and runtime.", []),
      makePackage("sdkwork-user-center-core-pc-react", "Server-safe user-center deployment, runtime bridge, command matrix, seed, and parity contracts.", []),
      makePackage("sdkwork-auth-runtime-pc-react", "Canonical auth-runtime composition and governed development prefill resolution.", ["sdkwork-auth-pc-react", "sdkwork-user-center-core-pc-react"]),
      makePackage("sdkwork-auth-pc-react", "Authentication flows, OAuth entry points, and token-aware guards.", ["sdkwork-auth", "sdkwork-drive-auth", "sdkwork-notes-auth"]),
      makePackage("sdkwork-iam-tenant-pc-react", "Tenant selection, tenant context, and tenant member administration surfaces.", ["sdkwork-cloud-portal"]),
      makePackage("sdkwork-iam-organization-pc-react", "Organization tree, department context, and organization member administration surfaces.", ["sdkwork-cloud-portal"]),
      makePackage("sdkwork-iam-permission-pc-react", "IAM roles, permissions, policies, and authorization hint surfaces.", ["sdkwork-cloud-portal"]),
      makePackage("sdkwork-user-center-pc-react", "Composable user-center UI surfaces over auth and user packages.", ["sdkwork-auth-pc-react", "sdkwork-user-pc-react"]),
      makePackage("sdkwork-user-center-validation-pc-react", "Validation, protected-token precedence, handshake governance, and server-side verification contracts.", ["sdkwork-user-center-core-pc-react"]),
      makePackage("sdkwork-user-pc-react", "User center, profile editing, and account preferences.", ["sdkwork-react-user"]),
    ],
  },
  {
    domain: "communication",
    summary: "Realtime communication, relationships, channels, and social surfaces.",
    packages: [
      makePackage("sdkwork-im-pc-react", "Instant messaging sessions, sync, and conversation surfaces.", ["sdkwork-pc-portal-im"]),
      makePackage("sdkwork-rtc-pc-react", "Realtime audio and video calling, room state, and call controls.", ["sdkwork-react-backend-rtc"]),
      makePackage("sdkwork-contacts-pc-react", "Contacts, address books, and people pickers.", ["sdkwork-chat-mobile-react"]),
      makePackage("sdkwork-social-pc-react", "Moments, feeds, and social discovery.", ["sdkwork-chat-mobile-react"]),
      makePackage("sdkwork-community-pc-react", "Community posts, public discussions, and recommendations.", ["sdkwork-community", "sdkwork-cloud-portal"]),
      makePackage("sdkwork-channel-pc-react", "External channel connectors and routing-ready endpoints.", ["sdkwork-channels"]),
    ],
  },
  {
    domain: "intelligence",
    summary: "AI-first capabilities: chat, models, agents, memory, knowledge, and automation.",
    packages: [
      makePackage("sdkwork-chat-pc-react", "AI chat workbench, sessions, composer, and attachment-aware prompts.", ["sdkwork-chat", "sdkwork-react-chat"]),
      makePackage("sdkwork-local-api-proxy", "Canonical local API gateway capability with capability-driven routing, storage definitions, host integration, and diagnostics surfaces.", ["sdkwork-studio"]),
      makePackage("sdkwork-llm-pc-react", "Large model invocation orchestration and provider routing.", ["sdkwork-react-backend-llm", "sdkwork-studio"]),
      makePackage("sdkwork-models-pc-react", "Model catalogs, provider instances, and purchase states.", ["sdkwork-model-purchase", "sdkwork-pc-portal-models"]),
      makePackage("sdkwork-agent-pc-react", "Agent catalog, install flow, and agent execution views.", ["sdkwork-agent"]),
      makePackage("sdkwork-prompt-pc-react", "Prompt assets, variables, and reusable prompt bundles.", ["sdkwork-react-prompt", "sdkwork-studio"]),
      makePackage("sdkwork-memory-pc-react", "Long-term memory and memory-backed retrieval configuration.", ["sdkwork-pc-portal-memory", "sdkwork-ai-memory-core"]),
      makePackage("sdkwork-knowledge-pc-react", "Knowledge bases, datasets, and indexing views.", ["sdkwork-pc-portal-knowledge", "sdkwork-react-notes"]),
      makePackage("sdkwork-mcp-pc-react", "MCP server management and tool exposure.", ["sdkwork-pc-portal-mcp", "sdkwork-studio"]),
      makePackage("sdkwork-tools-pc-react", "Tool directory, execution surfaces, and reusable tool widgets.", []),
      makePackage("sdkwork-skills-pc-react", "Skill discovery, lifecycle management, and skill manifests.", ["sdkwork-react-skills"]),
      makePackage("sdkwork-workflow-pc-react", "Task flows, automation pipelines, and run history surfaces.", ["sdkwork-tasks"]),
    ],
  },
  {
    domain: "content",
    summary: "Content creation, file systems, editors, media, and generated asset workspaces.",
    packages: [
      makePackage("sdkwork-drive-pc-react", "Cloud drive, file browsing, and storage workspaces.", ["sdkwork-drive"]),
      makePackage("sdkwork-notes-pc-react", "Notes, documents, and structured knowledge pages.", ["sdkwork-notes", "sdkwork-react-notes"]),
      makePackage("sdkwork-editor-pc-react", "Reusable editor contracts for code, markdown, and rich text.", ["sdkwork-react-editor", "sdkwork-desktop-settings"]),
      makePackage("sdkwork-terminal-pc-react", "Embedded terminal sessions and shell-connected actions.", ["codebox"]),
      makePackage("sdkwork-browser-pc-react", "Embedded browser panels and web preview workspaces.", ["sdkwork-react-browser", "codebox"]),
      makePackage("sdkwork-media-pc-react", "Shared media preview contracts for image, audio, video, and rich assets.", ["magic-studio-v2"]),
      makePackage("sdkwork-assets-pc-react", "Asset library and reusable project resources.", ["sdkwork-react-assets", "sdkwork-drive"]),
      makePackage("sdkwork-image-pc-react", "Image generation, editing tasks, and galleries.", ["sdkwork-react-image", "sdkwork-cloud-portal"]),
      makePackage("sdkwork-audio-pc-react", "Audio generation, speech synthesis, and voice capture.", ["sdkwork-react-audio", "sdkwork-pc-portal-voice"]),
      makePackage("sdkwork-video-pc-react", "Video generation, editing, and render history surfaces.", ["sdkwork-react-video"]),
      makePackage("sdkwork-canvas-pc-react", "Canvas workspaces and node-style visual authoring.", ["sdkwork-react-canvas", "sdkwork-studio"]),
      makePackage("sdkwork-generation-pc-react", "Unified generation history and task result provenance.", ["sdkwork-react-generation-history", "sdkwork-studio"]),
    ],
  },
  {
    domain: "commerce",
    summary: "Product, pricing, subscription, billing, wallet, and metered consumption capabilities.",
    packages: [
      makePackage("sdkwork-wallet-pc-react", "Wallet balances, recharge actions, and payment method surfaces.", ["sdkwork-points"]),
      makePackage("sdkwork-points-pc-react", "Points, credits, quota balances, and consumption history.", ["sdkwork-points", "sdkwork-router-portal-credits"]),
      makePackage("sdkwork-vip-pc-react", "Membership tiers, entitlements, and upgrade flows.", ["sdkwork-react-vip"]),
      makePackage("sdkwork-vip-purchase-pc-react", "VIP purchase header entry, package chooser, and reusable membership purchase menu.", ["sdkwork-react-vip"]),
      makePackage("sdkwork-vip-admin-pc-react", "Admin VIP management for levels, packages, memberships, and entitlements.", ["sdkwork-react-vip"]),
      makePackage("sdkwork-entitlement-pc-react", "Commercial access policy, paywall evaluation, and reusable entitlement center surfaces.", ["sdkwork-studio", "sdkwork-react-trade"]),
      makePackage("sdkwork-coupon-pc-react", "Coupon discovery, redemption, points exchange, and checkout-ready discount inventory.", ["sdkwork-studio", "sdkwork-react-trade"]),
      makePackage("sdkwork-offer-pc-react", "Shared commercial offer cards, featured pricing opportunities, and reusable routing into coupon, points, and subscription workspaces.", ["sdkwork-studio", "sdkwork-react-trade"]),
      makePackage("sdkwork-pricing-pc-react", "Price books, plan comparison, bundle strategy, and reusable pricing-center surfaces.", ["sdkwork-studio", "sdkwork-center", "sdkwork-react-trade"]),
      makePackage("sdkwork-checkout-pc-react", "Checkout orchestration, payment-method selection, invoice posture, and reusable transaction-session surfaces.", ["sdkwork-studio", "sdkwork-model-purchase", "sdkwork-react-trade"]),
      makePackage("sdkwork-subscription-pc-react", "Subscription checkout, coupon application, and premium membership selection.", ["sdkwork-studio", "sdkwork-react-vip"]),
      makePackage("sdkwork-order-pc-react", "Orders, billing details, and transaction histories.", ["sdkwork-router-portal-billing"]),
      makePackage("sdkwork-payment-pc-react", "Payment orchestration, payment methods, status tracking, and QR-aware payment center surfaces.", ["sdkwork-studio", "sdkwork-react-trade"]),
      makePackage("sdkwork-invoice-pc-react", "Invoice applications, billing documents, and tax-ready history surfaces.", ["sdkwork-studio", "sdkwork-router-portal-billing"]),
      makePackage("sdkwork-billing-pc-react", "Billing posture, metered usage, budget alerts, and reusable billing-center surfaces.", ["sdkwork-studio", "sdkwork-dashboard"]),
      makePackage("sdkwork-commerce-pc-react", "Commerce workflows, offers, and pricing-aware capability composition.", ["sdkwork-react-trade"]),
    ],
  },
  {
    domain: "device",
    summary: "Local device, install, packaging, and distribution-aware capabilities.",
    packages: [
      makePackage("sdkwork-device-pc-react", "Device catalogs, local hardware state, and machine capability views.", ["sdkwork-devices"]),
      makePackage("sdkwork-iot-pc-react", "IoT device management, edge endpoints, and hardware monitoring.", ["sdkwork-pc-portal-iot", "sdkwork-react-backend-iot"]),
      makePackage("sdkwork-install-pc-react", "Runtime installer surfaces and environment preparation UX.", ["sdkwork-install", "hub-installer"]),
      makePackage("sdkwork-distribution-pc-react", "Version distribution, release packaging, and delivery workflows.", ["sdkwork-distribution", "magic-studio-v2"]),
    ],
  },
  {
    domain: "ecosystem",
    summary: "Ecosystem expansion through plugins and market distribution.",
    packages: [
      makePackage("sdkwork-plugin-pc-react", "Plugin lifecycle, extension contracts, and discovery surfaces.", ["sdkwork-extensions", "sdkwork-react-plugins"]),
      makePackage("sdkwork-market-pc-react", "Marketplace browsing for apps, skills, plugins, and models.", ["sdkwork-market", "sdkwork-pc-portal-apps"]),
    ],
  },
];

const plannedArchitectureDomains = pcReactDomains.map(({ domain, summary }) => ({
  domain,
  summary,
  packages: [],
}));

const commonDomains = [
  {
    domain: "foundation",
    summary: "Framework-independent runtime bootstrap, SDK client injection, and shared request context.",
    packages: [
      makePackage("sdkwork-runtime-bootstrap", "Shared generated app/backend SDK client injection, v3 API base URL normalization, and standard request headers.", []),
    ],
  },
  {
    domain: "iam",
    summary: "Framework-independent IAM contracts, generated SDK ports, service facade, and runtime bootstrap.",
    packages: [
      makePackage("sdkwork-iam-contracts", "Canonical API, database, SDK, security, context, and parity contracts.", []),
      makePackage("sdkwork-iam-sdk-ports", "Generated app/backend SDK client ports for resource-oriented IAM calls.", []),
      makePackage("sdkwork-iam-sdk-adapter", "Adapter boundary that converts generated app/backend SDK clients into standard IAM ports.", []),
      makePackage("sdkwork-iam-service", "Framework-independent IAM service over injected app and backend SDK clients.", []),
      makePackage("sdkwork-iam-runtime", "Deployment mode, environment, token store, and context propagation runtime.", []),
    ],
  },
  {
    domain: "conversation",
    summary: "Framework-independent conversation, turn, message, external identity, and handoff foundation.",
    packages: [
      makePackage("sdkwork-conversation", "Shared conversation contracts and generated SDK method-tree ports for platform, support, user, system, and agent messages.", []),
    ],
  },
  {
    domain: "intelligence",
    summary: "Framework-independent chat, agent, memory, and automation contracts shared by all SDKWork clients.",
    packages: [
      makePackage("sdkwork-agent-contracts", "Agent definition, version, run, step, MCP, skill, memory, and metering contracts.", []),
    ],
  },
  {
    domain: "integration",
    summary: "Framework-independent external platform, provider account, webhook, menu, notice, and delivery modules.",
    packages: [
      makePackage("sdkwork-platform", "Provider-neutral official account, mini app, hook, menu, notice, outbox, payment binding, and generated SDK port module.", []),
    ],
  },
];

const nativeRustDomains = [
  {
    domain: "iam",
    summary: "Rust local/private IAM foundation with Java SaaS API and context parity.",
    packages: [
      makePackage("sdkwork-iam-core-rust", "Rust IAM domain, AppContext, ShardingContext, and dual-token contracts.", []),
      makePackage("sdkwork-iam-http-rust", "Rust IAM HTTP route contracts for /app/v3/api and /backend/v3/api.", []),
      makePackage("sdkwork-iam-storage-sqlx-rust", "Rust IAM SQL storage contract and initial migration catalog.", []),
      makePackage("sdkwork-iam-tauri-rust", "Tauri host adapter contract for the Rust IAM local/private module.", []),
    ],
  },
];

const mobileReactDomains = plannedArchitectureDomains.map((domain) => {
  if (domain.domain !== "foundation") {
    return domain;
  }

  return {
    ...domain,
    packages: [
      makePackage(
        "sdkwork-appbase-mobile-react",
        "Composable mobile application preset and feature registry.",
        ["sdkwork-chat-mobile-react", "sdkwork-chat-mobile-react-regional"]
      ),
      makePackage(
        "sdkwork-router-mobile-react",
        "Canonical mobile route catalogs, deep-link-safe path resolution, and route intents.",
        ["sdkwork-chat-mobile-react", "sdkwork-chat-mobile-react-regional"]
      ),
      makePackage(
        "sdkwork-command-mobile-react",
        "Normalized mobile command registries for spotlight sheets, quick actions, and slash menus.",
        ["sdkwork-chat-mobile-react", "sdkwork-chat-mobile-react-regional"]
      ),
      makePackage(
        "sdkwork-search-mobile-react",
        "Normalized mobile search catalogs and deterministic cross-capability result routing.",
        ["sdkwork-chat-mobile-react", "sdkwork-chat-mobile-react-regional"]
      ),
    ],
  };
});

export const appbaseArchitectureCatalog = [
  {
    architecture: "common",
    packageKind: "typescript",
    summary: "Framework-independent TypeScript packages shared by all frontend architectures.",
    scaffoldPackages: true,
    domains: commonDomains,
  },
  {
    architecture: "native-rust",
    packageKind: "rust",
    summary: "Rust local/private implementation packages with SaaS Java contract parity.",
    scaffoldPackages: true,
    domains: nativeRustDomains,
  },
  {
    architecture: "pc-react",
    packageKind: "typescript",
    summary: "Primary extraction target for React plus Tauri desktop applications.",
    scaffoldPackages: true,
    domains: pcReactDomains,
  },
  {
    architecture: "mobile-react",
    packageKind: "typescript",
    summary: "Progressively scaffolded mobile React capability packages with the same domain taxonomy.",
    scaffoldPackages: true,
    domains: mobileReactDomains,
  },
  {
    architecture: "mobile-flutter",
    packageKind: "reserved",
    summary: "Reserved for future Flutter capability packages with the same domain taxonomy.",
    scaffoldPackages: false,
    domains: plannedArchitectureDomains,
  },
];

export const rootPackageDirectoriesToRemove = [
  "sdkwork-appbase-pc-react",
  "sdkwork-appbase-mobile-react",
  "sdkwork-appbase-mobile-flutter",
  "sdkwork-auth-pc-react",
  "sdkwork-settings-pc-react",
  "sdkwork-trade-pc-react",
  "sdkwork-updator-pc-react",
  "sdkwork-user-pc-react",
  "sdkwork-vip-pc-react",
];

export function toWorkspacePackageName(directory) {
  return `@sdkwork/${directory.replace(/^sdkwork-/, "")}`;
}

export function toCapabilityName(directory) {
  return directory
    .replace(/^sdkwork-/, "")
    .replace(/-(pc-react|mobile-react|mobile-flutter)$/, "");
}
