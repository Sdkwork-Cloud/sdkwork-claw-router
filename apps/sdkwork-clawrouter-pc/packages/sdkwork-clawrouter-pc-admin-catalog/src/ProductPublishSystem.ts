export type ProductPublishDraftState = Record<string, unknown>;
export type ProductPublishSubmitMode = "draft" | "active";
export type ProductPublishReadinessSeverity = "blocker" | "warning" | "complete";

export type ProductPublishReadinessSection =
  | "basic"
  | "category"
  | "detail"
  | "attribute"
  | "sku"
  | "store"
  | "inventory"
  | "pricing"
  | "publishing";

export interface ProductPublishReadinessIssue {
  id: string;
  message: string;
  section: ProductPublishReadinessSection;
  severity: ProductPublishReadinessSeverity;
  target?: string;
}

export interface ProductPublishReadinessReport {
  blockers: ProductPublishReadinessIssue[];
  completed: number;
  issues: ProductPublishReadinessIssue[];
  publishable: boolean;
  total: number;
  warnings: ProductPublishReadinessIssue[];
}

export interface ProductPublishCommercialSignals {
  detailComplete: boolean;
  inventoryReady: boolean;
  priceComplete: boolean;
  readinessLabel: string;
  readinessStatus: "ready" | "blocked" | "draft";
  skuAttributeComplete: boolean;
  storeVisible: boolean;
}

export type ProductPublishStage =
  | "drafting"
  | "quality_gate"
  | "ready"
  | "publishing"
  | "published"
  | "blocked";

export type ProductPublishGateId =
  | "basic"
  | "category"
  | "attributes"
  | "detail"
  | "sku"
  | "pricing"
  | "store"
  | "inventory";

export type ProductPublishActionId =
  | "save_draft"
  | "complete_quality_gate"
  | "publish_active"
  | "review_projection"
  | "rollback_to_draft";

export interface ProductPublishGate {
  blockerCount: number;
  complete: boolean;
  description: string;
  id: ProductPublishGateId;
  issues: ProductPublishReadinessIssue[];
  label: string;
  warningCount: number;
}

export interface ProductPublishAction {
  enabled: boolean;
  id: ProductPublishActionId;
  label: string;
  mode?: ProductPublishSubmitMode;
  reason: string;
}

export interface ProductPublishSystemSnapshot {
  actions: ProductPublishAction[];
  completenessPercent: number;
  gates: ProductPublishGate[];
  metadata: Record<string, unknown>;
  publishable: boolean;
  readiness: ProductPublishReadinessReport;
  stage: ProductPublishStage;
  stageLabel: string;
}

export interface ProductPublishRecordProjection {
  actions: ProductPublishAction[];
  completenessPercent: number;
  publishable: boolean;
  signals: ProductPublishCommercialSignals;
  stage: ProductPublishStage;
  stageLabel: string;
}

export function buildProductPublishSystemSnapshot(
  draft: ProductPublishDraftState,
): ProductPublishSystemSnapshot {
  const readiness = evaluateProductPublishReadiness(draft);
  const gates = buildProductPublishGates(readiness);
  const stage = resolveDraftPublishStage(readiness);

  return {
    actions: buildProductPublishActions(stage, readiness),
    completenessPercent: calculateReadinessPercent(readiness),
    gates,
    metadata: buildProductPublishMetadata(draft, readiness, stage),
    publishable: readiness.publishable,
    readiness,
    stage,
    stageLabel: productPublishStageLabel(stage),
  };
}

export function buildProductPublishRecordProjection(
  record: Record<string, unknown>,
): ProductPublishRecordProjection {
  const signals = readProductPublishCommercialSignals(record);
  const stage = resolveRecordPublishStage(record, signals);
  const completenessPercent = calculateSignalCompletenessPercent(signals);

  return {
    actions: buildRecordPublishActions(stage, signals),
    completenessPercent,
    publishable: signals.readinessStatus === "ready",
    signals,
    stage,
    stageLabel: productPublishStageLabel(stage),
  };
}

export function buildProductPublishMetadata(
  draft: ProductPublishDraftState,
  readiness = evaluateProductPublishReadiness(draft),
  stage = resolveDraftPublishStage(readiness),
): Record<string, unknown> {
  const metadata = readObject(draft, "metadata");
  const commercialProductCenter = readObject(metadata, "commercialProductCenter");
  const signals = buildDraftProductPublishSignals(draft, readiness);

  return {
    ...metadata,
    commercialProductCenter: {
      ...commercialProductCenter,
      detailComplete: signals.detailComplete,
      inventoryReady: signals.inventoryReady,
      priceComplete: signals.priceComplete,
      skuAttributeComplete: signals.skuAttributeComplete,
      storeVisible: signals.storeVisible,
    },
    clawRouterProductPublishSystem: {
      completenessPercent: calculateReadinessPercent(readiness),
      gateCount: PRODUCT_PUBLISH_GATE_DEFINITIONS.length,
      publishable: readiness.publishable,
      stage,
      stageLabel: productPublishStageLabel(stage),
      updatedAt: new Date().toISOString(),
    },
  };
}

export function buildProductPublishGates(
  readiness: ProductPublishReadinessReport,
): ProductPublishGate[] {
  return PRODUCT_PUBLISH_GATE_DEFINITIONS.map((definition) => {
    const issues = readiness.issues.filter((issue) => definition.sections.includes(issue.section));
    const blockerCount = issues.filter((issue) => issue.severity === "blocker").length;
    const warningCount = issues.filter((issue) => issue.severity === "warning").length;

    return {
      blockerCount,
      complete: blockerCount === 0,
      description: definition.description,
      id: definition.id,
      issues,
      label: definition.label,
      warningCount,
    };
  });
}

export function evaluateProductPublishReadiness(
  draft: ProductPublishDraftState,
): ProductPublishReadinessReport {
  const source = asRecord(draft);
  const issues = [
    ...evaluateBasicIssues(source),
    ...evaluateCategoryIssues(source),
    ...evaluateAttributeIssues(source),
    ...evaluateDetailIssues(source),
    ...evaluateSkuIssues(source),
    ...evaluatePricingIssues(source),
    ...evaluateStoreIssues(source),
    ...evaluateInventoryIssues(source),
    ...evaluatePublishingIssues(source),
  ];
  const blockers = issues.filter((issue) => issue.severity === "blocker");
  const warnings = issues.filter((issue) => issue.severity === "warning");
  const completed = PRODUCT_PUBLISH_GATE_DEFINITIONS.filter((definition) => (
    !issues.some((issue) => issue.severity === "blocker" && definition.sections.includes(issue.section))
  )).length;

  return {
    blockers,
    completed,
    issues,
    publishable: blockers.length === 0,
    total: PRODUCT_PUBLISH_GATE_DEFINITIONS.length,
    warnings,
  };
}

export function readProductPublishCommercialSignals(
  record: Record<string, unknown>,
): ProductPublishCommercialSignals {
  const source = asRecord(record);
  const commercialProductCenter = readCommercialProductCenter(source);

  const detailComplete = readBooleanFlag(commercialProductCenter, ["detailComplete", "detail_complete"])
    ?? hasProductDetail(source);
  const inventoryReady = readBooleanFlag(commercialProductCenter, ["inventoryReady", "inventory_ready"])
    ?? hasInventoryPolicy(source);
  const priceComplete = readBooleanFlag(commercialProductCenter, ["priceComplete", "price_complete"])
    ?? hasProductPrice(source);
  const skuAttributeComplete = readBooleanFlag(
    commercialProductCenter,
    ["skuAttributeComplete", "sku_attribute_complete"],
  ) ?? hasSkuAttributeCoverage(source);
  const storeVisible = readBooleanFlag(commercialProductCenter, ["storeVisible", "store_visible"])
    ?? hasStoreVisibility(source);
  const readinessStatus = resolveSignalsReadinessStatus(source, {
    detailComplete,
    inventoryReady,
    priceComplete,
    skuAttributeComplete,
    storeVisible,
  });

  return {
    detailComplete,
    inventoryReady,
    priceComplete,
    readinessLabel: productPublishReadinessStatusLabel(readinessStatus),
    readinessStatus,
    skuAttributeComplete,
    storeVisible,
  };
}

export function productPublishStageLabel(stage: ProductPublishStage): string {
  return PRODUCT_PUBLISH_STAGE_LABELS[stage];
}

function buildDraftProductPublishSignals(
  draft: ProductPublishDraftState,
  readiness: ProductPublishReadinessReport,
): ProductPublishCommercialSignals {
  const source = asRecord(draft);
  const readinessStatus = readiness.publishable ? "ready" : "blocked";

  return {
    detailComplete: !hasBlockingSectionIssue(readiness, "detail"),
    inventoryReady: !hasBlockingSectionIssue(readiness, "inventory"),
    priceComplete: !hasBlockingSectionIssue(readiness, "pricing"),
    readinessLabel: productPublishReadinessStatusLabel(readinessStatus),
    readinessStatus,
    skuAttributeComplete: !hasBlockingSectionIssue(readiness, "attribute")
      && !hasBlockingSectionIssue(readiness, "sku")
      && hasSkuAttributeCoverage(source),
    storeVisible: !hasBlockingSectionIssue(readiness, "store"),
  };
}

function evaluateBasicIssues(source: Record<string, unknown>): ProductPublishReadinessIssue[] {
  return compactIssues([
    hasStringValue(source, ["title", "name", "productName", "product_name"])
      ? null
      : blocker("basic.title", "Product title is required before publication.", "basic", "title"),
    hasStringValue(source, ["spuNo", "spu_no", "spuCode", "spu_code", "productNo", "product_no", "code"])
      ? null
      : blocker("basic.spu", "SPU code is required for product identity and downstream SKU routing.", "basic", "spuNo"),
    hasStringValue(source, ["productType", "product_type", "type"])
      ? null
      : blocker("basic.type", "Product type is required to determine fulfillment, inventory, and detail rules.", "basic", "productType"),
  ]);
}

function evaluateCategoryIssues(source: Record<string, unknown>): ProductPublishReadinessIssue[] {
  return hasCategorySelection(source)
    ? []
    : [
      blocker(
        "category.selection",
        "Select at least one leaf category before publishing the product.",
        "category",
        "selectedCategoryIds",
      ),
    ];
}

function evaluateAttributeIssues(source: Record<string, unknown>): ProductPublishReadinessIssue[] {
  const issues: ProductPublishReadinessIssue[] = [];
  if (!hasCategoryAttributeValues(source)) {
    issues.push(blocker(
      "attribute.category-values",
      "Category attribute values are required for search, filtering, and professional catalog quality.",
      "attribute",
      "parameters",
    ));
  }
  if (!hasSpecGroupCoverage(source)) {
    issues.push(blocker(
      "attribute.spec-groups",
      "SKU attribute groups must have names and enabled values before SKU publication.",
      "attribute",
      "specGroups",
    ));
  }
  if (!hasSkuAttributeCoverage(source)) {
    issues.push(blocker(
      "attribute.sku-values",
      "Every sellable SKU must include complete SKU attribute selections.",
      "attribute",
      "skuDrafts",
    ));
  }
  return issues;
}

function evaluateDetailIssues(source: Record<string, unknown>): ProductPublishReadinessIssue[] {
  const issues: ProductPublishReadinessIssue[] = [];
  if (!hasProductDetail(source)) {
    issues.push(blocker(
      "detail.description",
      "Product detail content or description is required before publication.",
      "detail",
      "description",
    ));
  }
  if (!hasDetailConfiguration(source)) {
    issues.push(warning(
      "detail.configuration",
      "Product detail configuration should include media, selling points, service promises, shipping, and after-sale content.",
      "detail",
      "metadata.commercialProductCenter.productDetailConfig",
    ));
  }
  if (!hasMediaProjection(source)) {
    issues.push(warning(
      "detail.media",
      "Add product media projection for storefront inspection and detail-page conversion.",
      "detail",
      "media",
    ));
  }
  return issues;
}

function evaluateSkuIssues(source: Record<string, unknown>): ProductPublishReadinessIssue[] {
  const skus = readProductSkus(source);
  const sellableSkus = skus.filter(isSellableSku);

  if (sellableSkus.length === 0) {
    return [
      blocker("sku.rows", "At least one sellable SKU is required before active publication.", "sku", "skuDrafts"),
    ];
  }

  return compactIssues([
    sellableSkus.some((sku) => !hasStringValue(asRecord(sku), ["skuNo", "sku_no", "code", "id"]))
      ? blocker("sku.code", "Every sellable SKU must have a stable SKU code.", "sku", "skuDrafts")
      : null,
    sellableSkus.some((sku) => !hasStringValue(asRecord(sku), ["title", "name", "skuName", "sku_name"]))
      ? blocker("sku.title", "Every sellable SKU must have a display title.", "sku", "skuDrafts")
      : null,
  ]);
}

function evaluatePricingIssues(source: Record<string, unknown>): ProductPublishReadinessIssue[] {
  return hasProductPrice(source)
    ? []
    : [
      blocker(
        "pricing.amount",
        "A positive product or SKU price is required before active publication.",
        "pricing",
        "defaultPriceAmount",
      ),
    ];
}

function evaluateStoreIssues(source: Record<string, unknown>): ProductPublishReadinessIssue[] {
  return hasStoreVisibility(source)
    ? []
    : [
      blocker(
        "store.visibility",
        "Store visibility or channel exposure must be configured before publication.",
        "store",
        "shopCategoryIds",
      ),
    ];
}

function evaluateInventoryIssues(source: Record<string, unknown>): ProductPublishReadinessIssue[] {
  return hasInventoryPolicy(source)
    ? []
    : [
      blocker(
        "inventory.policy",
        "Inventory source, stock quantity, or explicit inventory policy is required before publication.",
        "inventory",
        "skuDrafts",
      ),
    ];
}

function evaluatePublishingIssues(source: Record<string, unknown>): ProductPublishReadinessIssue[] {
  const status = readNormalizedStatus(source, ["status", "publishStatus", "publish_status"]);
  if (status === "archived" || status === "deleted") {
    return [
      blocker(
        "publishing.status",
        "Archived or deleted products must be restored before publication.",
        "publishing",
        "status",
      ),
    ];
  }
  return [];
}

function resolveDraftPublishStage(readiness: ProductPublishReadinessReport): ProductPublishStage {
  if (readiness.blockers.length > 0) {
    return "blocked";
  }
  if (readiness.publishable) {
    return "ready";
  }
  return "quality_gate";
}

function resolveRecordPublishStage(
  record: Record<string, unknown>,
  signals: ProductPublishCommercialSignals,
): ProductPublishStage {
  const status = readNormalizedStatus(record, ["status", "publishStatus", "publish_status"]);
  if (status === "active" && signals.readinessStatus === "ready") {
    return "published";
  }
  if (status === "publishing") {
    return "publishing";
  }
  if (signals.readinessStatus === "blocked") {
    return "blocked";
  }
  if (signals.readinessStatus === "ready") {
    return "ready";
  }
  return "drafting";
}

function buildProductPublishActions(
  stage: ProductPublishStage,
  readiness: ProductPublishReadinessReport,
): ProductPublishAction[] {
  return [
    {
      enabled: true,
      id: "save_draft",
      label: "Save draft",
      mode: "draft",
      reason: "Draft saves preserve product data while operators finish publish gates.",
    },
    {
      enabled: readiness.blockers.length > 0,
      id: "complete_quality_gate",
      label: "Complete publish gate",
      reason: readiness.blockers.length > 0
        ? `${readiness.blockers.length} blocker(s) must be resolved before publishing.`
        : "All blocking publish gates are complete.",
    },
    {
      enabled: stage === "ready",
      id: "publish_active",
      label: "Publish active product",
      mode: "active",
      reason: stage === "ready"
        ? "Product is ready for active publishing."
        : "Publishing is locked until every required gate is complete.",
    },
    {
      enabled: stage === "ready" || stage === "published",
      id: "review_projection",
      label: "Review publish projection",
      reason: "Review the category, store, SKU, price, inventory, and detail projection before storefront exposure.",
    },
  ];
}

function buildRecordPublishActions(
  stage: ProductPublishStage,
  signals: ProductPublishCommercialSignals,
): ProductPublishAction[] {
  return [
    {
      enabled: stage !== "published",
      id: "complete_quality_gate",
      label: "Open quality gate",
      reason: signals.readinessLabel,
    },
    {
      enabled: stage === "ready",
      id: "publish_active",
      label: "Publish",
      mode: "active",
      reason: stage === "ready" ? "Commercial publish signals are ready." : "Commercial signals still block publish.",
    },
    {
      enabled: stage === "published",
      id: "rollback_to_draft",
      label: "Rollback to draft",
      mode: "draft",
      reason: "Published products can be returned to draft through the Commerce product workflow.",
    },
  ];
}

function calculateReadinessPercent(readiness: ProductPublishReadinessReport): number {
  if (readiness.total <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round((readiness.completed / readiness.total) * 100)));
}

function calculateSignalCompletenessPercent(signals: ProductPublishCommercialSignals): number {
  const checks = [
    signals.detailComplete,
    signals.inventoryReady,
    signals.priceComplete,
    signals.skuAttributeComplete,
    signals.storeVisible,
  ];
  const completed = checks.filter(Boolean).length;
  return Math.max(0, Math.min(100, Math.round((completed / checks.length) * 100)));
}

function productPublishReadinessStatusLabel(status: ProductPublishCommercialSignals["readinessStatus"]): string {
  if (status === "ready") {
    return "Commercial publish signals are ready.";
  }
  if (status === "blocked") {
    return "Commercial publish signals have blocking gaps.";
  }
  return "Product is still in drafting.";
}

function resolveSignalsReadinessStatus(
  source: Record<string, unknown>,
  signals: Omit<ProductPublishCommercialSignals, "readinessLabel" | "readinessStatus">,
): ProductPublishCommercialSignals["readinessStatus"] {
  if (
    signals.detailComplete
    && signals.inventoryReady
    && signals.priceComplete
    && signals.skuAttributeComplete
    && signals.storeVisible
  ) {
    return "ready";
  }

  const status = readNormalizedStatus(source, ["status", "publishStatus", "publish_status"]);
  return status === "draft" || status === "" ? "draft" : "blocked";
}

function hasBlockingSectionIssue(
  readiness: ProductPublishReadinessReport,
  section: ProductPublishReadinessSection,
): boolean {
  return readiness.blockers.some((issue) => issue.section === section);
}

function hasCategorySelection(source: Record<string, unknown>): boolean {
  return readFirstArray(source, [
    "selectedCategoryIds",
    "categoryIds",
    "category_ids",
    "categories",
    "categoryPath",
    "category_path",
  ]).length > 0;
}

function hasCategoryAttributeValues(source: Record<string, unknown>): boolean {
  const commercialProductCenter = readCommercialProductCenter(source);
  const rows = [
    ...readFirstArray(source, ["parameters", "categoryAttributeValues", "category_attribute_values", "attributes"]),
    ...readFirstArray(commercialProductCenter, ["categoryAttributeValues", "category_attribute_values", "parameters"]),
  ];
  return rows.length > 0 && rows.every(isCompleteAttributeRow);
}

function hasSpecGroupCoverage(source: Record<string, unknown>): boolean {
  const specGroups = readFirstArray(source, ["specGroups", "spec_groups", "skuAttributeGroups", "sku_attribute_groups"]);
  if (specGroups.length === 0) {
    return true;
  }
  return specGroups.every((item) => {
    const group = asRecord(item);
    const values = readFirstArray(group, ["values", "items", "options"]).filter((value) => {
      const valueRecord = asRecord(value);
      return valueRecord.enabled !== false && valueRecord.status !== "inactive";
    });
    return hasStringValue(group, ["name", "label", "attributeName", "attribute_name"]) && values.length > 0;
  });
}

function hasSkuAttributeCoverage(source: Record<string, unknown>): boolean {
  const specGroups = readFirstArray(source, ["specGroups", "spec_groups", "skuAttributeGroups", "sku_attribute_groups"]);
  const enabledGroupCount = specGroups.filter((group) => {
    const groupRecord = asRecord(group);
    return groupRecord.enabled !== false && groupRecord.status !== "inactive";
  }).length;
  const skus = readProductSkus(source).filter(isSellableSku);

  if (skus.length === 0) {
    return false;
  }
  if (enabledGroupCount === 0 && skus.length <= 1) {
    return true;
  }

  return skus.every((sku) => {
    const skuRecord = asRecord(sku);
    const selections = readFirstArray(skuRecord, ["specSelections", "spec_selections", "attributes", "skuAttributes"]);
    if (selections.length === 0) {
      return false;
    }
    if (enabledGroupCount === 0) {
      return selections.every(isCompleteAttributeRow);
    }
    return selections.length >= enabledGroupCount && selections.every(isCompleteAttributeRow);
  });
}

function hasProductDetail(source: Record<string, unknown>): boolean {
  return hasStringValue(source, ["description", "detail", "detailDescription", "detail_description", "content", "body"])
    || hasDetailConfiguration(source);
}

function hasDetailConfiguration(source: Record<string, unknown>): boolean {
  const commercialProductCenter = readCommercialProductCenter(source);
  const detailConfig = firstNonEmptyObject([
    readObject(source, "productDetailConfig"),
    readObject(source, "detailConfig"),
    readObject(commercialProductCenter, "productDetailConfig"),
    readObject(commercialProductCenter, "detailConfig"),
  ]);

  if (Object.keys(detailConfig).length > 0) {
    return true;
  }

  return readFirstArray(source, ["detailSections", "detail_sections", "sellingPoints", "selling_points"]).length > 0
    || readFirstArray(commercialProductCenter, ["detailSections", "detail_sections", "sellingPoints"]).length > 0;
}

function hasMediaProjection(source: Record<string, unknown>): boolean {
  if (
    hasObjectValue(source, ["cover", "mainImage", "main_image", "image"])
    || readFirstArray(source, ["images", "galleryImages", "gallery_images", "media", "mediaResources"]).length > 0
  ) {
    return true;
  }
  return readProductSkus(source).some((sku) => hasObjectValue(asRecord(sku), ["image", "cover", "media"]));
}

function hasProductPrice(source: Record<string, unknown>): boolean {
  if (hasPositiveAmountValue(source, [
    "defaultPriceAmount",
    "default_price_amount",
    "priceAmount",
    "price_amount",
    "minPriceAmount",
    "min_price_amount",
  ])) {
    return true;
  }

  const skus = readProductSkus(source).filter(isSellableSku);
  return skus.length > 0 && skus.every((sku) => hasPositiveAmountValue(asRecord(sku), [
    "defaultPriceAmount",
    "default_price_amount",
    "priceAmount",
    "price_amount",
  ]));
}

function hasStoreVisibility(source: Record<string, unknown>): boolean {
  const commercialProductCenter = readCommercialProductCenter(source);
  return hasStringValue(source, ["primaryStoreId", "primary_store_id", "storeId", "store_id"])
    || readFirstArray(source, [
      "shopCategoryIds",
      "shop_category_ids",
      "storeIds",
      "store_ids",
      "visibleStoreIds",
      "visible_store_ids",
      "channelIds",
      "channel_ids",
      "salesChannels",
      "sales_channels",
    ]).length > 0
    || readFirstArray(commercialProductCenter, ["storeIds", "channelIds", "visibleStoreIds"]).length > 0
    || hasObjectValue(source, ["storeVisibility", "store_visibility", "channelVisibility", "channel_visibility"]);
}

function hasInventoryPolicy(source: Record<string, unknown>): boolean {
  const commercialProductCenter = readCommercialProductCenter(source);
  if (
    readBooleanFlag(commercialProductCenter, ["inventoryReady", "inventory_ready"]) === true
    || hasObjectValue(source, ["inventoryPolicy", "inventory_policy", "inventorySource", "inventory_source"])
  ) {
    return true;
  }

  const skus = readProductSkus(source).filter(isSellableSku);
  return skus.length > 0 && skus.every((sku) => hasNonNegativeNumberValue(asRecord(sku), [
    "stockQuantity",
    "stock_quantity",
    "inventoryQuantity",
    "inventory_quantity",
    "availableStock",
    "available_stock",
  ]));
}

function readProductSkus(source: Record<string, unknown>): unknown[] {
  return readFirstArray(source, ["skuDrafts", "sku_drafts", "skus", "skuRecords", "sku_records", "items"]);
}

function isSellableSku(sku: unknown): boolean {
  const skuRecord = asRecord(sku);
  const status = readNormalizedStatus(skuRecord, ["status", "publishStatus", "publish_status"]);
  return skuRecord.enabled !== false && status !== "inactive" && status !== "archived" && status !== "deleted";
}

function isCompleteAttributeRow(row: unknown): boolean {
  if (typeof row === "string" || typeof row === "number" || typeof row === "boolean") {
    return String(row).trim().length > 0;
  }

  const record = asRecord(row);
  if (Object.keys(record).length === 0) {
    return false;
  }

  return hasStringValue(record, [
    "label",
    "name",
    "attributeName",
    "attribute_name",
    "groupName",
    "group_name",
    "attributeId",
    "attribute_id",
    "id",
  ]) && (
    hasStringValue(record, [
      "value",
      "displayValue",
      "display_value",
      "customValue",
      "custom_value",
      "valueCode",
      "value_code",
      "attributeValueId",
      "attribute_value_id",
      "valueName",
      "value_name",
    ])
    || typeof record.value === "boolean"
    || typeof record.customValue === "boolean"
  );
}

function readCommercialProductCenter(source: Record<string, unknown>): Record<string, unknown> {
  const metadata = readObject(source, "metadata");
  return readObject(metadata, "commercialProductCenter");
}

function readFirstArray(source: Record<string, unknown>, keys: string[]): unknown[] {
  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) {
      return value;
    }
  }
  return [];
}

function readObject(source: Record<string, unknown>, key: string): Record<string, unknown> {
  return asRecord(source[key]);
}

function firstNonEmptyObject(objects: Record<string, unknown>[]): Record<string, unknown> {
  return objects.find((object) => Object.keys(object).length > 0) ?? {};
}

function hasStringValue(source: Record<string, unknown>, keys: string[]): boolean {
  return keys.some((key) => readString(source, key).length > 0);
}

function hasObjectValue(source: Record<string, unknown>, keys: string[]): boolean {
  return keys.some((key) => Object.keys(asRecord(source[key])).length > 0);
}

function hasPositiveAmountValue(source: Record<string, unknown>, keys: string[]): boolean {
  return keys.some((key) => {
    const value = source[key];
    const amount = typeof value === "number" ? value : Number(readString(source, key));
    return Number.isFinite(amount) && amount > 0;
  });
}

function hasNonNegativeNumberValue(source: Record<string, unknown>, keys: string[]): boolean {
  return keys.some((key) => {
    const value = source[key];
    const amount = typeof value === "number" ? value : Number(readString(source, key));
    return Number.isFinite(amount) && amount >= 0;
  });
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return "";
}

function readBooleanFlag(source: Record<string, unknown>, keys: string[]): boolean | undefined {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "boolean") {
      return value;
    }
  }
  return undefined;
}

function readNormalizedStatus(source: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = readString(source, key).toLowerCase();
    if (value) {
      return value;
    }
  }
  return "";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function compactIssues(
  issues: Array<ProductPublishReadinessIssue | null>,
): ProductPublishReadinessIssue[] {
  return issues.filter((issue): issue is ProductPublishReadinessIssue => issue !== null);
}

function blocker(
  id: string,
  message: string,
  section: ProductPublishReadinessSection,
  target?: string,
): ProductPublishReadinessIssue {
  return {
    id,
    message,
    section,
    severity: "blocker",
    target,
  };
}

function warning(
  id: string,
  message: string,
  section: ProductPublishReadinessSection,
  target?: string,
): ProductPublishReadinessIssue {
  return {
    id,
    message,
    section,
    severity: "warning",
    target,
  };
}

const PRODUCT_PUBLISH_GATE_DEFINITIONS: Array<{
  description: string;
  id: ProductPublishGateId;
  label: string;
  sections: ProductPublishReadinessSection[];
}> = [
  {
    description: "SPU title, code, type, and base publish identity are ready.",
    id: "basic",
    label: "Basic identity",
    sections: ["basic", "publishing"],
  },
  {
    description: "Leaf category selection and storefront taxonomy are ready.",
    id: "category",
    label: "Category",
    sections: ["category"],
  },
  {
    description: "Category attributes and SKU attributes required for filtering, search, and variant matching are complete.",
    id: "attributes",
    label: "Attributes",
    sections: ["attribute"],
  },
  {
    description: "Media, selling points, parameter table, SEO, service promise, shipping, and after-sale content are complete.",
    id: "detail",
    label: "Detail content",
    sections: ["detail"],
  },
  {
    description: "Sellable SKU rows, SKU numbers, variant combinations, and SKU attribute values are ready.",
    id: "sku",
    label: "SKU matrix",
    sections: ["sku"],
  },
  {
    description: "Default price and per-SKU price readiness are complete.",
    id: "pricing",
    label: "Pricing",
    sections: ["pricing"],
  },
  {
    description: "Store visibility, channel exposure, and primary store routing are configured.",
    id: "store",
    label: "Store visibility",
    sections: ["store"],
  },
  {
    description: "Physical inventory source policy, safety stock, and backorder posture are configured.",
    id: "inventory",
    label: "Inventory",
    sections: ["inventory"],
  },
];

const PRODUCT_PUBLISH_STAGE_LABELS: Record<ProductPublishStage, string> = {
  blocked: "Blocked",
  drafting: "Drafting",
  published: "Published",
  publishing: "Publishing",
  quality_gate: "Quality gate",
  ready: "Ready to publish",
};
