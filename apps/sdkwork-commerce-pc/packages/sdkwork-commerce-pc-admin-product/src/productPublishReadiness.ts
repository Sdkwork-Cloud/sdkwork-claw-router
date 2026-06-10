export type ProductReadinessSeverity = 'blocker' | 'warning' | 'complete';

export type ProductReadinessSection =
  | 'basic'
  | 'category'
  | 'detail'
  | 'attribute'
  | 'sku'
  | 'store'
  | 'inventory'
  | 'pricing'
  | 'publishing';

export interface ProductReadinessIssue {
  id: string;
  message: string;
  section: ProductReadinessSection;
  severity: ProductReadinessSeverity;
  target?: string;
}

export interface ProductReadinessReport {
  blockers: ProductReadinessIssue[];
  completed: number;
  issues: ProductReadinessIssue[];
  publishable: boolean;
  total: number;
  warnings: ProductReadinessIssue[];
}

export interface ProductCommercialSignals {
  detailComplete: boolean;
  enabledSkuCount: number;
  inventoryReady: boolean;
  minPriceAmount: string;
  priceComplete: boolean;
  readinessLabel: string;
  readinessStatus: 'ready' | 'blocked' | 'draft';
  skuAttributeComplete: boolean;
  storeVisible: boolean;
  totalStockQuantity: number;
}

export type ProductPublishReadinessSeverity = ProductReadinessSeverity;
export type ProductPublishReadinessSection = ProductReadinessSection;
export type ProductPublishReadinessIssue = ProductReadinessIssue;
export type ProductPublishReadinessReport = ProductReadinessReport;
export type ProductPublishCommercialSignals = ProductCommercialSignals;
export type ProductPublishDraftState = Record<string, unknown>;
export type ProductPublishSubmitMode = 'draft' | 'active';

type ProductRecord = Record<string, unknown>;

const READINESS_TOTAL_SECTIONS = 8;

export function buildCommercialProductMetadata(
  source: ProductPublishDraftState,
  mode: ProductPublishSubmitMode = 'draft',
): Record<string, unknown> {
  const categoryIds = readStringArray(source, ['selectedCategoryIds', 'categoryIds']);
  const shopCategoryIds = readStringArray(source, ['shopCategoryIds', 'storeCategoryIds']);
  const parameters = normalizeParameterDrafts(readFirstArray(source, ['parameters', 'categoryAttributeValues']));
  const specGroups = normalizeSpecGroups(readFirstArray(source, ['specGroups']));
  const skuDrafts = normalizeSkuDrafts(readFirstArray(source, ['skuDrafts']));
  const productDetailConfig = normalizeProductDetailConfig(readFirstObject(source, ['detailConfig', 'productDetailConfig']), source);
  const commercialDraft = {
    ...source,
    categoryIds,
    parameters,
    productDetailConfig,
    selectedCategoryIds: categoryIds,
    shopCategoryIds,
    skuDrafts,
    specGroups,
  };
  const readiness = evaluateProductReadiness(commercialDraft);
  const signals = readProductCommercialSignals({
    commercialProductCenter: {
      categoryIds,
      parameters,
      productDetailConfig,
      shopCategoryIds,
      skuDrafts,
      specGroups,
    },
  });

  return {
    schemaVersion: 1,
    source: 'sdkwork-commerce-pc-admin-product',
    statusIntent: mode,
    categoryIds,
    shopCategoryIds,
    categoryAttributeValues: parameters,
    parameters,
    specGroups,
    skuAttributeDefinitions: specGroups.map((group) => ({
      attributeId: readString(group, ['attributeId', 'id']),
      name: readString(group, ['name']),
      valueType: 'enum',
      values: readFirstArray(group, ['values']).map((value) => ({
        code: readString(toRecord(value), ['code', 'id']),
        name: readString(toRecord(value), ['name']),
      })),
    })),
    skuDrafts,
    productDetailConfig,
    detailSections: buildDetailSections(productDetailConfig, parameters),
    detailComplete: signals.detailComplete,
    inventoryReady: signals.inventoryReady,
    priceComplete: signals.priceComplete,
    skuAttributeComplete: signals.skuAttributeComplete,
    storeVisible: signals.storeVisible,
    enabledSkuCount: signals.enabledSkuCount,
    totalStockQuantity: signals.totalStockQuantity,
    minPriceAmount: signals.minPriceAmount,
    readiness,
    readinessLabel: signals.readinessLabel,
    readinessStatus: signals.readinessStatus,
    publishable: readiness.publishable,
  };
}

export function evaluateProductReadiness(source: unknown): ProductReadinessReport {
  const record = readCommercialSource(source);
  const issues: ProductReadinessIssue[] = [];
  const title = readString(record, ['title', 'name']);
  const spuNo = readString(record, ['spuNo', 'spu_no', 'code']);
  const description = readString(record, ['description']);
  const categoryIds = readStringArray(record, ['selectedCategoryIds', 'categoryIds']);
  const shopCategoryIds = readStringArray(record, ['shopCategoryIds', 'storeCategoryIds']);
  const parameters = normalizeParameterDrafts(readFirstArray(record, ['parameters', 'categoryAttributeValues']));
  const specGroups = normalizeSpecGroups(readFirstArray(record, ['specGroups']));
  const skuDrafts = normalizeSkuDrafts(readFirstArray(record, ['skuDrafts', 'skus']));
  const productDetailConfig = normalizeProductDetailConfig(readFirstObject(record, ['detailConfig', 'productDetailConfig']), record);
  const enabledSkuDrafts = skuDrafts.filter((sku) => sku.enabled !== false && readString(sku, ['status']) !== 'archived');

  if (!title) {
    issues.push(createIssue('basic-title', '请填写商品标题。', 'basic', 'blocker', 'title'));
  }
  if (!spuNo) {
    issues.push(createIssue('basic-spu-no', '请填写 SPU 编码。', 'basic', 'blocker', 'spuNo'));
  }
  if (categoryIds.length === 0) {
    issues.push(createIssue('category-leaf', '请至少选择一个叶子类目。', 'category', 'blocker', 'categoryIds'));
  }
  if (!description && readStringArray(productDetailConfig, ['sellingPoints']).length === 0) {
    issues.push(createIssue('detail-copy', '请补齐商品描述或核心卖点。', 'detail', 'blocker', 'description'));
  }
  if (readFirstArray(productDetailConfig, ['detailImages']).length === 0) {
    issues.push(createIssue('detail-images', '建议配置至少一张详情图。', 'detail', 'warning', 'detailImages'));
  }
  if (parameters.filter((item) => readString(item, ['label']) && readString(item, ['value'])).length === 0) {
    issues.push(createIssue('attribute-parameters', '请维护类目属性或商品参数。', 'attribute', 'warning', 'parameters'));
  }
  if (specGroups.length === 0) {
    issues.push(createIssue('sku-attributes', '请维护 SKU 规格属性。', 'sku', 'blocker', 'specGroups'));
  }
  if (enabledSkuDrafts.length === 0) {
    issues.push(createIssue('sku-enabled', '请至少启用一个可售 SKU。', 'sku', 'blocker', 'skuDrafts'));
  }
  if (enabledSkuDrafts.some((sku) => !readString(sku, ['skuNo', 'sku_no']))) {
    issues.push(createIssue('sku-no', '请补齐所有可售 SKU 编码。', 'sku', 'blocker', 'skuNo'));
  }
  if (enabledSkuDrafts.some((sku) => !isPositiveAmount(readString(sku, ['priceAmount', 'defaultPriceAmount'])))) {
    issues.push(createIssue('pricing-sku', '请补齐所有可售 SKU 售价。', 'pricing', 'blocker', 'priceAmount'));
  }
  if (enabledSkuDrafts.some((sku) => readNumber(sku, ['stockQuantity', 'availableQuantity']) <= 0)) {
    issues.push(createIssue('inventory-sku', '请补齐所有可售 SKU 库存运营数量。', 'inventory', 'warning', 'stockQuantity'));
  }
  if (shopCategoryIds.length === 0) {
    issues.push(createIssue('store-category', '建议配置店铺首页展示分类。', 'store', 'warning', 'shopCategoryIds'));
  }

  const blockerSections = new Set(issues.filter((issue) => issue.severity === 'blocker').map((issue) => issue.section));
  const warningSections = new Set(issues.filter((issue) => issue.severity === 'warning').map((issue) => issue.section));
  const incompleteSections = new Set([...blockerSections, ...warningSections]);
  const completed = Math.max(0, READINESS_TOTAL_SECTIONS - incompleteSections.size);
  const blockers = issues.filter((issue) => issue.severity === 'blocker');
  const warnings = issues.filter((issue) => issue.severity === 'warning');

  return {
    blockers,
    completed,
    issues,
    publishable: blockers.length === 0,
    total: READINESS_TOTAL_SECTIONS,
    warnings,
  };
}

export function isProductPublishable(source: unknown): boolean {
  return evaluateProductReadiness(source).publishable;
}

export function readProductCommercialSignals(source: unknown): ProductCommercialSignals {
  const record = readCommercialSource(source);
  const skuDrafts = normalizeSkuDrafts(readFirstArray(record, ['skuDrafts', 'skus']));
  const enabledSkuDrafts = skuDrafts.filter((sku) => sku.enabled !== false && readString(sku, ['status']) !== 'archived');
  const report = evaluateProductReadiness(record);
  const priceAmounts = enabledSkuDrafts
    .map((sku) => Number(readString(sku, ['priceAmount', 'defaultPriceAmount'])))
    .filter((value) => Number.isFinite(value) && value > 0);
  const totalStockQuantity = enabledSkuDrafts.reduce(
    (total, sku) => total + readNumber(sku, ['stockQuantity', 'availableQuantity']),
    0,
  );

  const detailComplete = readBoolean(record, ['detailComplete'])
    ?? !report.issues.some((issue) => issue.section === 'detail' && issue.severity === 'blocker');
  const inventoryReady = readBoolean(record, ['inventoryReady'])
    ?? (enabledSkuDrafts.length > 0 && enabledSkuDrafts.every((sku) => readNumber(sku, ['stockQuantity', 'availableQuantity']) > 0));
  const priceComplete = readBoolean(record, ['priceComplete'])
    ?? (enabledSkuDrafts.length > 0 && enabledSkuDrafts.every((sku) => isPositiveAmount(readString(sku, ['priceAmount', 'defaultPriceAmount']))));
  const skuAttributeComplete = readBoolean(record, ['skuAttributeComplete'])
    ?? readFirstArray(record, ['specGroups']).length > 0;
  const storeVisible = readBoolean(record, ['storeVisible'])
    ?? readStringArray(record, ['shopCategoryIds', 'storeCategoryIds']).length > 0;
  const readinessStatus = report.blockers.length > 0
    ? 'blocked'
    : report.warnings.length > 0
      ? 'draft'
      : 'ready';

  return {
    detailComplete,
    enabledSkuCount: enabledSkuDrafts.length,
    inventoryReady,
    minPriceAmount: priceAmounts.length > 0 ? Math.min(...priceAmounts).toFixed(2) : '',
    priceComplete,
    readinessLabel: `${report.completed}/${report.total}`,
    readinessStatus,
    skuAttributeComplete,
    storeVisible,
    totalStockQuantity,
  };
}

function createIssue(
  id: string,
  message: string,
  section: ProductReadinessSection,
  severity: ProductReadinessSeverity,
  target?: string,
): ProductReadinessIssue {
  return { id, message, section, severity, target };
}

function readCommercialSource(source: unknown): ProductRecord {
  const record = toRecord(source);
  const metadata = toRecord(record.metadata);
  const commercialProductCenter = toRecord(metadata.commercialProductCenter ?? record.commercialProductCenter);
  if (Object.keys(commercialProductCenter).length === 0) {
    return record;
  }
  return {
    ...record,
    ...commercialProductCenter,
    detailConfig: commercialProductCenter.productDetailConfig ?? commercialProductCenter.detailConfig ?? record.detailConfig,
    parameters: commercialProductCenter.parameters ?? commercialProductCenter.categoryAttributeValues ?? record.parameters,
    selectedCategoryIds: commercialProductCenter.categoryIds ?? record.selectedCategoryIds ?? record.categoryIds,
    shopCategoryIds: commercialProductCenter.shopCategoryIds ?? record.shopCategoryIds,
    skuDrafts: commercialProductCenter.skuDrafts ?? record.skuDrafts ?? record.skus,
    specGroups: commercialProductCenter.specGroups ?? record.specGroups,
  };
}

function normalizeProductDetailConfig(detailConfig: ProductRecord, source: ProductRecord): ProductRecord {
  const detailImages = readFirstArray(detailConfig, ['detailImages'])
    .map(toRecord)
    .filter((item) => Object.keys(item).length > 0);
  const introVideo = toRecord(detailConfig.introVideo ?? detailConfig.video);
  return {
    scheduledSaleEnabled: readBoolean(detailConfig, ['scheduledSaleEnabled']) ?? false,
    scheduledSaleAt: readString(detailConfig, ['scheduledSaleAt']),
    customizationEnabled: readBoolean(detailConfig, ['customizationEnabled']) ?? false,
    qualityAssuranceEnabled: readBoolean(detailConfig, ['qualityAssuranceEnabled']) ?? true,
    exchangeEnabled: readBoolean(detailConfig, ['exchangeEnabled']) ?? true,
    afterSaleEnabled: readBoolean(detailConfig, ['afterSaleEnabled']) ?? true,
    sellingPoints: readStringArray(detailConfig, ['sellingPoints']),
    detailImages,
    introVideo: Object.keys(introVideo).length > 0 ? introVideo : null,
    shippingTemplate: readString(detailConfig, ['shippingTemplate']) || '默认运费模板 / 今日发 / 全国可配送',
    shippingPromise: readString(detailConfig, ['shippingPromise']) || '下单后 24 小时内发货',
    serviceCommitments: readStringArray(detailConfig, ['serviceCommitments']),
    seoTitle: readString(detailConfig, ['seoTitle']) || readString(source, ['title', 'name']),
    seoKeywords: readString(detailConfig, ['seoKeywords']) || readString(source, ['brand']),
  };
}

function normalizeParameterDrafts(values: unknown[]): ProductRecord[] {
  return values
    .map(toRecord)
    .map((item) => ({
      id: readString(item, ['id']) || slugCode(readString(item, ['label', 'name'])),
      label: readString(item, ['label', 'name']),
      value: readString(item, ['value', 'displayValue', 'customValue']),
    }))
    .filter((item) => item.label || item.value);
}

function normalizeSpecGroups(values: unknown[]): ProductRecord[] {
  return values
    .map(toRecord)
    .map((group) => ({
      id: readString(group, ['id', 'attributeId']),
      attributeId: readString(group, ['attributeId']),
      name: readString(group, ['name', 'attributeName']),
      values: readFirstArray(group, ['values']).map((value) => {
        const valueRecord = toRecord(value);
        return {
          id: readString(valueRecord, ['id', 'valueId']),
          code: readString(valueRecord, ['code', 'valueCode']),
          enabled: readBoolean(valueRecord, ['enabled']) ?? true,
          name: readString(valueRecord, ['name', 'valueName', 'displayValue']),
        };
      }),
    }))
    .filter((group) => group.name);
}

function normalizeSkuDrafts(values: unknown[]): ProductRecord[] {
  return values
    .map(toRecord)
    .map((sku) => ({
      ...sku,
      enabled: readBoolean(sku, ['enabled']) ?? readString(sku, ['status']) !== 'inactive',
      priceAmount: readString(sku, ['priceAmount', 'defaultPriceAmount']),
      skuNo: readString(sku, ['skuNo', 'sku_no']),
      stockQuantity: readNumber(sku, ['stockQuantity', 'availableQuantity']),
    }))
    .filter((sku) => readString(sku, ['skuNo']) || readString(sku, ['title', 'name']));
}

function buildDetailSections(productDetailConfig: ProductRecord, parameters: ProductRecord[]): ProductRecord[] {
  return [
    {
      key: 'sellingPoints',
      title: '核心卖点',
      items: readStringArray(productDetailConfig, ['sellingPoints']),
    },
    {
      key: 'parameters',
      title: '商品参数',
      items: parameters,
    },
    {
      key: 'media',
      title: '图文详情',
      images: readFirstArray(productDetailConfig, ['detailImages']),
      video: productDetailConfig.introVideo ?? null,
    },
    {
      key: 'service',
      title: '履约与售后',
      shippingPromise: readString(productDetailConfig, ['shippingPromise']),
      serviceCommitments: readStringArray(productDetailConfig, ['serviceCommitments']),
    },
  ];
}

function readStringArray(record: ProductRecord, keys: string[]): string[] {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === 'string' || typeof item === 'number' ? String(item).trim() : ''))
        .filter(Boolean);
    }
  }
  return [];
}

function readFirstArray(record: ProductRecord, keys: string[]): unknown[] {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value;
    }
  }
  return [];
}

function readFirstObject(record: ProductRecord, keys: string[]): ProductRecord {
  for (const key of keys) {
    const value = toRecord(record[key]);
    if (Object.keys(value).length > 0) {
      return value;
    }
  }
  return {};
}

function readString(record: ProductRecord, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }
  }
  return '';
}

function readNumber(record: ProductRecord, keys: string[]): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return 0;
}

function readBoolean(record: ProductRecord, keys: string[]): boolean | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true') {
        return true;
      }
      if (normalized === 'false') {
        return false;
      }
    }
  }
  return null;
}

function toRecord(value: unknown): ProductRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as ProductRecord : {};
}

function isPositiveAmount(value: string): boolean {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0;
}

function slugCode(value: string): string {
  return value
    .trim()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/_+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}
