import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function readCommerceProductAdminFile(relativePath: string): string {
  return readFileSync(
    new URL(
      `../../.sdkwork/dependencies/sdkwork-commerce/apps/sdkwork-commerce-pc/packages/sdkwork-commerce-pc-admin-product/src/${relativePath}`,
      import.meta.url,
    ),
    "utf8",
  );
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("admin catalog adapter re-exports Commerce product admin without Claw Router catalog SDK calls", () => {
  const indexSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-catalog/src/index.tsx");
  const productListAdapterSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-catalog/src/ProductListPage.tsx");
  const serviceAdapterSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-catalog/src/catalogService.ts");

  assert.match(indexSource, /from "sdkwork-commerce-pc-admin-product"/);
  assert.match(productListAdapterSource, /from "sdkwork-commerce-pc-admin-product"/);
  assert.match(serviceAdapterSource, /from "sdkwork-commerce-pc-admin-product"/);
  assert.match(indexSource, /CatalogAdmin/);
  assert.match(indexSource, /CommerceProductAdmin/);
  assert.match(serviceAdapterSource, /createCommerceProductAdminService/);
  assert.doesNotMatch(indexSource + productListAdapterSource + serviceAdapterSource, /getClawRouterBackendSdkClient/);
  assert.doesNotMatch(indexSource + productListAdapterSource + serviceAdapterSource, /createIdempotencyParams/);
  assert.doesNotMatch(indexSource + productListAdapterSource + serviceAdapterSource, /\bfetch\s*\(|axios|XMLHttpRequest/);
});

test("admin catalog products route uses a Commerce-owned Weixin-style product list page", () => {
  const indexSource = readCommerceProductAdminFile("index.tsx");
  const productListSource = readCommerceProductAdminFile("ProductListPage.tsx");
  const serviceSource = readCommerceProductAdminFile("catalogService.ts");

  assert.match(indexSource, /import \{ ProductListPage \} from '\.\/ProductListPage'/);
  assert.match(indexSource, /activeSectionId === 'products'/);
  assert.match(indexSource, /<ProductListPage \/>/);
  assert.match(productListSource, /to="\/admin\/catalog\/products\/new"/);

  for (const label of [
    "全部",
    "销售中",
    "已下架",
    "审核中",
    "审核待处理",
    "草稿箱",
    "回收站",
    "商品ID",
    "多个以空格/逗号/分号分隔",
    "商家编码",
    "SKU/商家编码/条形码，空格/逗号分隔",
    "商品名称",
    "多个词用空格分割",
    "查询",
    "重置",
    "更多筛选",
    "运费模板新增「今日发」发货时效，设置后可获专属标识，多场景透传，可提升下单转化。",
    "去设置",
    "价格",
    "库存",
    "近30天经营概览",
    "商品状态/时间",
    "操作",
    "暂无数据",
    "每页",
    "条/页",
    "上一页",
    "下一页",
    "跳至",
    "页",
    "批量",
    "上架",
    "下架",
    "运费",
    "删除",
    "隐藏",
    "取消隐藏",
    "新增商品",
  ]) {
    assert.match(productListSource, new RegExp(escapeRegExp(label)));
  }

  for (const marker of [
    "PRODUCT_STATUS_TABS",
    "ProductListFilters",
    "ProductListNotice",
    "ProductListTable",
    "ProductTablePagination",
    "ProductBatchToolbar",
    "ProductFilterInput",
    "SortableHeader",
    "data-admin-product-create-button",
    "data-admin-product-list-page",
    "data-admin-product-list-card",
    "data-admin-product-list-tabs",
    "data-admin-product-list-filters",
    "data-admin-product-list-notice",
    "data-admin-product-list-table",
    "data-admin-product-list-pagination",
    "data-admin-product-pagination-page-size",
    "data-admin-product-pagination-jump-input",
    "data-admin-product-list-batch-toolbar",
  ]) {
    assert.match(productListSource, new RegExp(escapeRegExp(marker)));
  }

  assert.match(productListSource, /listCommerceProducts\(\{[\s\S]*page:\s*(?:String\()?pagination\.page/);
  assert.match(productListSource, /pageSize:\s*(?:String\()?pagination\.pageSize/);
  assert.match(productListSource, /q:\s*queryText\s*\|\|\s*undefined/);
  assert.match(productListSource, /status:\s*activeTab\.status/);
  assert.match(productListSource, /buildProductQueryText\(appliedFilters\)/);
  assert.match(serviceSource, /createCommerceProductAdminService/);
  assert.match(serviceSource, /catalog\.products\.list\(params\)/);
  assert.doesNotMatch(serviceSource, /getClawRouterBackendSdkClient/);
  assert.doesNotMatch(productListSource, /\bfetch\s*\(|axios|XMLHttpRequest/);
  assert.doesNotMatch(serviceSource, /\bfetch\s*\(|axios|XMLHttpRequest/);
});

test("admin catalog product create flow exposes the two-step publish experience", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const indexSource = readCommerceProductAdminFile("index.tsx");
  const createSource = readCommerceProductAdminFile("ProductCreatePage.tsx");

  assert.match(appSource, /path="catalog\/products\/new"/);
  assert.match(appSource, /<CatalogAdmin sectionId="productCreate" \/>/);
  assert.match(indexSource, /import \{ ProductCreatePage \} from '\.\/ProductCreatePage'/);
  assert.match(indexSource, /activeSectionId === 'productCreate'/);
  assert.match(indexSource, /<ProductCreatePage mode="create" \/>/);

  for (const label of [
    "新增商品",
    "填写助手",
    "重新上架可更新信息质量",
    "基础信息",
    "主图",
    "商品标题",
    "商品类目",
    "选择商品类目",
    "类目搜索",
    "一级类目",
    "二级类目",
    "三级类目",
    "四级类目",
    "已选类目",
    "一个商品可以选择多个叶子类目",
    "选择更多分类",
    "确定",
    "取消",
    "店铺首页展示分类",
    "下一步",
    "商品信息",
    "6处待调整",
    "商品参数",
    "商品详情图",
    "商品描述",
    "商品展示与介绍",
    "视频",
    "规格和库存价格",
    "规格",
    "创建新规格",
    "价格与库存",
    "发货方式",
    "现货",
    "按商品预售",
    "按规格预售",
    "更多设置",
    "定时开售",
    "定制",
    "保障",
    "支持换货",
    "物流配送",
    "售后及服务",
    "保存草稿",
    "上架",
  ]) {
    assert.match(createSource, new RegExp(escapeRegExp(label)));
  }

  for (const marker of [
    "ProductCreatePage",
    "ProductCreateStepOne",
    "ProductCreateStepTwo",
    "CreateAssistantPanel",
    "CreateBottomBar",
    "ProductCategoryModal",
    "ProductCategoryPicker",
    "ProductCategoryPathList",
    "formatCategoryPath",
    "DEFAULT_SELECTED_CATEGORY_IDS",
    "data-admin-product-create-page",
    "data-admin-product-create-step-one",
    "data-admin-product-create-step-two",
    "data-admin-product-create-assistant",
    "data-admin-product-category-modal",
    "data-admin-product-category-picker",
    "data-admin-product-category-path-list",
    "data-admin-product-category-open",
    "data-admin-product-category-confirm",
    "data-admin-product-create-next",
    "data-admin-product-create-save-draft",
    "data-admin-product-create-publish",
  ]) {
    assert.match(createSource, new RegExp(escapeRegExp(marker)));
  }

  assert.match(createSource, /const \[step, setStep\] = useState<ProductCreateStep>\(\(\) => initialProductCreateStep\(mode\)\)/);
  assert.match(createSource, /<ProductCreateStepOne[\s\S]*onNext=\{\(\) => setStep\('detail'\)\}/);
  assert.match(createSource, /<ProductCreateStepTwo[\s\S]*onBack=\{\(\) => setStep\('basic'\)\}/);
  assert.match(createSource, /onPrimaryClick=\{onNext\}/);
  assert.match(createSource, /onClick=\{onBack\}/);
  assert.match(createSource, /const \[selectedCategoryIds, setSelectedCategoryIds\] = useState<string\[\]>\(DEFAULT_SELECTED_CATEGORY_IDS\)/);
  assert.match(createSource, /selectedCategoryIds={selectedCategoryIds}/);
  assert.match(createSource, /onSelectedCategoryIdsChange={setSelectedCategoryIds}/);
  assert.doesNotMatch(createSource, /\bfetch\s*\(|axios|XMLHttpRequest/);
});

test("admin catalog categories route uses a dedicated category CRUD and seed initialization page", () => {
  const indexSource = readCommerceProductAdminFile("index.tsx");
  const categorySource = readCommerceProductAdminFile("CategoryManagementPage.tsx");
  const serviceSource = readCommerceProductAdminFile("catalogService.ts");

  assert.match(indexSource, /import \{ CategoryManagementPage \} from '\.\/CategoryManagementPage'/);
  assert.match(indexSource, /activeSectionId === 'categories'/);
  assert.match(indexSource, /<CategoryManagementPage \/>/);

  for (const marker of [
    "CategoryManagementPage",
    "CATEGORY_SEED_DATASETS",
    "CategorySeedInitializePanel",
    "CategoryTreeTable",
    "CategoryCascadeColumns",
    "CategoryMutationModal",
    "CategoryParentCascader",
    "buildCategoryRows",
    "buildCategoryColumns",
    "buildCategoryParentColumns",
    "findCategoryPathIds",
    "generateCategoryNo",
    "data-admin-category-management-page",
    "data-admin-category-initialize-button",
    "data-admin-category-create-button",
    "data-admin-category-action-edit",
    "data-admin-category-action-delete",
    "data-admin-category-refresh",
    "data-admin-category-seed-summary",
    "data-admin-category-cascade-manager",
    "data-admin-category-cascade-column",
    "data-admin-category-create-modal",
    "data-admin-category-parent-cascader",
    "data-admin-category-context-menu",
    "data-admin-category-action-create-child",
    "initializeCommerceCategorySeeds",
    "createCommerceCategory",
    "updateCommerceCategory",
    "deleteCommerceCategory",
    "listCommerceCategories",
  ]) {
    assert.match(categorySource + serviceSource, new RegExp(escapeRegExp(marker)));
  }

  assert.match(serviceSource, /export async function initializeCommerceCategorySeeds/);
  assert.match(serviceSource, /categorySeeds\.create\(body\)/);
  assert.doesNotMatch(serviceSource, /getClawRouterBackendSdkClient/);
  assert.doesNotMatch(serviceSource, /createIdempotencyParams/);
  assert.match(categorySource, /datasets:\s*\[\.\.\.CATEGORY_SEED_DATASETS\]/);
  assert.match(categorySource, /mode:\s*'admin_button'/);
  assert.match(categorySource, /await listCommerceCategories\(\{ page:\s*['"]1['"],\s*pageSize:\s*String\(CATEGORY_LIST_PAGE_SIZE\) \}\)/);
  assert.match(categorySource, /await createCommerceCategory\(/);
  assert.match(categorySource, /await updateCommerceCategory\(/);
  assert.match(categorySource, /await deleteCommerceCategory\(/);
  assert.doesNotMatch(categorySource, /CategoryEditorPanel/);
  assert.doesNotMatch(categorySource, /categorySeedDatasetLabel/);
  assert.doesNotMatch(categorySource, /selectedDatasets/);
  assert.doesNotMatch(categorySource, /data-admin-category-seed-dataset/);
  assert.doesNotMatch(categorySource, /\bfetch\s*\(|axios|XMLHttpRequest/);
  assert.doesNotMatch(serviceSource, /\bfetch\s*\(|axios|XMLHttpRequest/);
});

test("admin catalog category readers handle generated SDK unwrapped responses", async () => {
  const categoryPage = await import("./packages/sdkwork-clawrouter-pc-admin-catalog/src/CategoryManagementPage.tsx");

  const records = categoryPage.readCategoryRecords({
    items: [
      {
        id: "seed-category-wx-food",
        categoryNo: "WX-FOOD",
        parentId: null,
        name: "食品饮料",
        path: "食品饮料",
        levelNo: 0,
        status: "active",
        sortOrder: 1000,
      },
    ],
    total: 1,
    page: 1,
    pageSize: 200,
  });

  assert.equal(records.length, 1);
  assert.equal(records[0].categoryNo, "WX-FOOD");
  assert.equal(records[0].name, "食品饮料");

  const summaries = categoryPage.readSeedSummaries({
    items: [
      {
        dataset: "product",
        targetTable: "commerce_product_category",
        requested: 3710,
        upserted: 3710,
        skipped: 0,
        installDefaultEnabled: false,
        configKey: "SDKWORK_CLAW_INSTALL_CATEGORY_SEEDS",
      },
    ],
  });

  assert.equal(summaries.length, 1);
  assert.equal(summaries[0].dataset, "product");
  assert.equal(summaries[0].upserted, 3710);
});

test("admin catalog attributes route manages category attribute bindings", () => {
  const indexSource = readCommerceProductAdminFile("index.tsx");
  const attributeSource = readCommerceProductAdminFile("AttributeManagementPage.tsx");
  const serviceSource = readCommerceProductAdminFile("catalogService.ts");

  assert.match(indexSource, /import \{ AttributeManagementPage \} from '\.\/AttributeManagementPage'/);
  assert.match(indexSource, /activeSectionId === 'attributes'/);
  assert.match(indexSource, /<AttributeManagementPage \/>/);

  for (const marker of [
    "AttributeManagementPage",
    "data-admin-catalog-attribute-management-page",
    "data-admin-catalog-attribute-create",
    "data-admin-catalog-category-attribute-create",
    "data-admin-catalog-category-attribute-required",
    "data-admin-catalog-category-attribute-searchable",
    "data-admin-catalog-category-attribute-filterable",
    "data-admin-catalog-category-attribute-sort-order",
    "CommerceCategoryAttributeBindingForm",
    "listCommerceCategoryAttributes",
    "createCommerceCategoryAttribute",
    "updateCommerceCategoryAttribute",
    "deleteCommerceCategoryAttribute",
    "listCommerceCategories",
    "listCommerceAttributes",
  ]) {
    assert.match(attributeSource + serviceSource, new RegExp(escapeRegExp(marker)));
  }

  assert.match(serviceSource, /categoryAttributes\.list\(params\)/);
  assert.match(serviceSource, /categoryAttributes\.create\(body\)/);
  assert.match(serviceSource, /categoryAttributes\.update\(bindingId, body\)/);
  assert.match(serviceSource, /categoryAttributes\.delete\(bindingId\)/);
  assert.doesNotMatch(serviceSource, /getClawRouterBackendSdkClient/);
  assert.doesNotMatch(serviceSource, /createIdempotencyParams/);
  assert.match(attributeSource, /searchable:\s*form\.searchable/);
  assert.match(attributeSource, /filterable:\s*form\.filterable/);
  assert.doesNotMatch(attributeSource, /鍟|鎬|�/);
  assert.doesNotMatch(attributeSource, /Attribute center failed to load|Category and attribute are required|Category attribute binding (created|updated|save failed|archived|archive failed)/);
  assert.doesNotMatch(attributeSource, /\bfetch\s*\(|axios|XMLHttpRequest/);
  assert.doesNotMatch(serviceSource, /\bfetch\s*\(|axios|XMLHttpRequest/);
});

test("admin catalog product create category helpers support multiple deep leaf paths", async () => {
  const createPage = await import("./packages/sdkwork-clawrouter-pc-admin-catalog/src/ProductCreatePage.tsx");

  assert.equal(createPage.formatCategoryPath(["家装建材", "厨房卫浴", "水槽"]), "家装建材>厨房卫浴>水槽");
  assert.equal(createPage.formatCategoryPath(["手机通讯", "手机", "智能手机", "折叠屏手机"], " / "), "手机通讯 / 手机 / 智能手机 / 折叠屏手机");
  assert.deepEqual(
    createPage.readSelectedCategoryPaths(["home-kitchen-sink", "phone-foldable"]).map((path: string[]) => path.join("/")),
    ["家装建材/厨房卫浴/水槽", "手机通讯/手机/智能手机/折叠屏手机"],
  );
});

test("admin catalog product create category modal supports usable category selection interactions", async () => {
  const createSource = readCommerceProductAdminFile("ProductCreatePage.tsx");
  const createPage = await import("./packages/sdkwork-clawrouter-pc-admin-catalog/src/ProductCreatePage.tsx");

  for (const marker of [
    "data-admin-product-category-path-open",
    "data-admin-product-category-path-remove",
    "data-admin-product-category-search",
    "data-admin-product-category-search-results",
    "data-admin-product-category-column-empty",
    "data-admin-product-category-column-scroll",
    "data-admin-product-category-footer-selected",
    "h-[min(1040px,96vh)]",
    "grid-flow-col",
    "min-h-[560px]",
    "overflow-y-auto",
    "filterCategoryPathEntries",
    "normalizeSelectedCategoryIds",
    "normalizeProductCategoryTree",
    "listCommerceCategories",
    "categoryTree",
    "categorySearchText",
    "onCategoryRemove",
    "MAX_SELECTED_CATEGORY_COUNT",
    "最多选择 3 个类目",
    "data-admin-product-category-limit",
    "aria-disabled",
    "sm:flex-row",
  ]) {
    assert.match(createSource, new RegExp(escapeRegExp(marker)));
  }
  assert.doesNotMatch(createSource, /h-\[min\(480px,50vh\)\]/);
  assert.doesNotMatch(createSource, /data-admin-product-category-selected-panel/);
  assert.doesNotMatch(createSource, /xl:grid-cols-\[minmax\(0,1fr\)_360px\]/);
  assert.match(createSource, /draftCategoryIds\.length >= MAX_SELECTED_CATEGORY_COUNT/);

  assert.deepEqual(
    createPage.filterCategoryPathEntries("折叠屏").map((entry: { id: string; path: string[] }) => ({
      id: entry.id,
      path: entry.path.join("/"),
    })),
    [{ id: "phone-foldable", path: "手机通讯/手机/智能手机/折叠屏手机" }],
  );
  assert.deepEqual(createPage.filterCategoryPathEntries("不存在的类目"), []);
  const normalizedTree = createPage.normalizeProductCategoryTree([
    { id: "root", name: "家装建材", parentId: null, sortOrder: 1 },
    { id: "child", name: "厨房卫浴", parentId: "root", sortOrder: 1 },
    { id: "leaf", name: "水槽", parentId: "child", sortOrder: 1 },
  ]);
  assert.deepEqual(createPage.readSelectedCategoryPaths(["leaf"], normalizedTree), [["家装建材", "厨房卫浴", "水槽"]]);

  const limitTree = createPage.normalizeProductCategoryTree([
    { id: "root", name: "家装建材", parentId: null, sortOrder: 1 },
    { id: "kitchen", name: "厨房卫浴", parentId: "root", sortOrder: 1 },
    { id: "sink", name: "水槽", parentId: "kitchen", sortOrder: 1 },
    { id: "cabinet", name: "浴室柜", parentId: "kitchen", sortOrder: 2 },
    { id: "shower", name: "淋浴花洒", parentId: "kitchen", sortOrder: 3 },
    { id: "toilet", name: "马桶", parentId: "kitchen", sortOrder: 4 },
  ]);
  assert.deepEqual(
    createPage.normalizeSelectedCategoryIds(["missing", "root", "sink", "cabinet", "sink", "shower", "toilet"], limitTree),
    ["sink", "cabinet", "shower"],
  );
});

test("admin catalog product create flow adapts to dark mode and app theme color palettes", () => {
  const createSource = readCommerceProductAdminFile("ProductCreatePage.tsx");

  for (const marker of [
    "bg-slate-50 dark:bg-[#0a0a0a]",
    "rounded-lg border border-slate-200 bg-white",
    "dark:border-white/10 dark:bg-[#171717]",
    "bg-lobster-600",
    "hover:bg-lobster-700",
    "text-lobster-600",
    "dark:text-lobster-300",
    "border-lobster-200",
    "dark:border-lobster-500/20",
    "focus:border-lobster-400",
    "focus:ring-lobster-500/10",
    "accent-lobster-600",
    "dark:accent-lobster-400",
    "dark:bg-[#1e1e1e]",
    "dark:divide-white/10",
    "dark:text-slate-300",
    "dark:placeholder:text-slate-500",
    "sticky bottom-0",
  ]) {
    assert.match(createSource, new RegExp(escapeRegExp(marker)));
  }

  assert.doesNotMatch(createSource, /#2b6de8|#426ea6|#1d56a3|#18a8f5|#e5f7ff/);
  assert.doesNotMatch(createSource, /hover:text-\[#|focus:border-\[#|bg-\[#e|text-\[#4/);
});

test("admin catalog product create flow models a complete create draft and SDK submit pipeline", async () => {
  const createSource = readCommerceProductAdminFile("ProductCreatePage.tsx");
  const serviceSource = readCommerceProductAdminFile("catalogService.ts");
  const createPage = await import("./packages/sdkwork-clawrouter-pc-admin-catalog/src/ProductCreatePage.tsx");

  for (const marker of [
    "ProductDraftState",
    "ProductSpecGroup",
    "ProductSpecValue",
    "ProductSkuDraft",
    "ProductAttributeDefinition",
    "ProductSubmitMode",
    "DEFAULT_PRODUCT_DRAFT",
    "data-admin-product-category-manager",
    "data-admin-product-attribute-manager",
    "data-admin-product-sku-attribute-manager",
    "data-admin-product-spec-group",
    "data-admin-product-spec-value",
    "data-admin-product-sku-draft-row",
    "data-admin-product-sku-barcode",
    "data-admin-product-sku-image",
    "data-admin-product-create-submit-status",
    "createCommerceProduct",
    "createCommerceSku",
    "createCommerceAttribute",
    "createCommerceCategory",
    "listCommerceAttributes",
    "submitProductDraft",
  ]) {
    assert.match(createSource + serviceSource, new RegExp(escapeRegExp(marker)));
  }

  assert.match(createSource, /const \[draft, setDraft\] = useState<ProductDraftState>\(/);
  assert.match(createSource, /value=\{draft\.title\}/);
  assert.match(createSource, /onChange=\{\(value\) => updateDraft\(\{ title: value \}\)\}/);
  assert.match(createSource, /onSaveDraft=\{\(\) => void handleSubmit\('draft'\)\}/);
  assert.match(createSource, /onPublish=\{\(\) => void handleSubmit\('active'\)\}/);
  assert.match(createSource, /await createCommerceProduct\(/);
  assert.match(createSource, /await Promise\.all\(\s*skuPayloads\.map\(\(sku\) => \(/);
  assert.match(createSource, /sku\.backendSkuId\s*\?\s*updateCommerceSku\(sku\.backendSkuId,\s*sku\.body\)/);
  assert.match(createSource, /:\s*createCommerceSku\(sku\.body\)/);
  assert.match(createSource, /await ensureSkuAttributeDefinitions\(/);
  assert.match(createSource, /stockQuantity/);
  assert.match(createSource, /barcode/);
  assert.match(createSource, /image:\s*sku\.image/);
  assert.match(createSource, /商品条形码/);
  assert.match(createSource, /SKU 配图/);
  assert.match(createSource, /import \{[\s\S]*readMediaResource[\s\S]*\} from '\.\/commerce-media-resource'/);
  assert.match(createSource, /readMediaResource\(value\)/);
  assert.doesNotMatch(createSource, /return value as unknown as ClawRouterMediaResource/);
  assert.match(createSource, /库存创建接口待补齐/);
  assert.doesNotMatch(createSource, /\bfetch\s*\(|axios|XMLHttpRequest/);

  const specGroups = createPage.normalizeSpecGroups([
    { id: "version", name: "版本", values: [{ id: "basic", name: "基础版" }, { id: "pro", name: "专业版" }] },
    { id: "cycle", name: "服务周期", values: [{ id: "year", name: "年度" }, { id: "month", name: "月度" }] },
  ]);
  const skuDrafts = createPage.generateSkuDraftsFromSpecGroups(specGroups, {
    title: "企业版 AI 助手",
    baseSkuNo: "SKU-AI",
    defaultPriceAmount: "1999.00",
    defaultCurrencyCode: "CNY",
  });
  assert.equal(skuDrafts.length, 4);
  assert.equal(skuDrafts[0].barcode, "BAR-SKU-AI-BASIC-YEAR");
  assert.equal(skuDrafts[0].image, undefined);
  assert.deepEqual(
    skuDrafts.map((sku: { title: string; specPath: string }) => `${sku.title}#${sku.specPath}`),
    [
      "企业版 AI 助手 基础版 年度#基础版 / 年度",
      "企业版 AI 助手 基础版 月度#基础版 / 月度",
      "企业版 AI 助手 专业版 年度#专业版 / 年度",
      "企业版 AI 助手 专业版 月度#专业版 / 月度",
    ],
  );

  const draft = createPage.createDefaultProductDraft();
  const readyDraft = {
    ...draft,
    title: "企业版 AI 助手年度订阅服务",
    selectedCategoryIds: ["home-kitchen-sink", "phone-foldable"],
    specGroups,
    skuDrafts,
  };

  assert.deepEqual(createPage.validateProductDraft(readyDraft), []);
  assert.deepEqual(createPage.buildProductCreatePayload(readyDraft, "active"), {
    brand: "SdkWork",
    categoryIds: ["home-kitchen-sink", "phone-foldable"],
    description: "适用于企业团队的 AI 助手服务，支持知识库问答、流程自动化、数据分析和多端协作。",
    productType: "subscription",
    spuNo: "SPU-AI-ASSISTANT",
    status: "active",
    subtitle: "知识库问答、流程自动化、数据分析和多端协作",
    title: "企业版 AI 助手年度订阅服务",
  });

  const attributeIdByName = new Map([
    ["版本", "attr-version"],
    ["服务周期", "attr-cycle"],
  ]);
  assert.deepEqual(createPage.buildSkuCreatePayloads(readyDraft, "product-1", "active", attributeIdByName), [
    {
      attributes: [
        { attributeId: "attr-version", attributeName: "版本", customValue: "基础版", displayValue: "基础版", valueCode: "basic" },
        { attributeId: "attr-cycle", attributeName: "服务周期", customValue: "年度", displayValue: "年度", valueCode: "year" },
      ],
      defaultCurrencyCode: "CNY",
      defaultPriceAmount: "1999.00",
      fulfillmentType: "subscription_activation",
      barcode: "BAR-SKU-AI-BASIC-YEAR",
      image: undefined,
      productId: "product-1",
      salesUnit: "件",
      skuNo: "SKU-AI-BASIC-YEAR",
      status: "active",
      taxCategory: "standard",
      title: "企业版 AI 助手 基础版 年度",
    },
    {
      attributes: [
        { attributeId: "attr-version", attributeName: "版本", customValue: "基础版", displayValue: "基础版", valueCode: "basic" },
        { attributeId: "attr-cycle", attributeName: "服务周期", customValue: "月度", displayValue: "月度", valueCode: "month" },
      ],
      defaultCurrencyCode: "CNY",
      defaultPriceAmount: "1999.00",
      fulfillmentType: "subscription_activation",
      barcode: "BAR-SKU-AI-BASIC-MONTH",
      image: undefined,
      productId: "product-1",
      salesUnit: "件",
      skuNo: "SKU-AI-BASIC-MONTH",
      status: "active",
      taxCategory: "standard",
      title: "企业版 AI 助手 基础版 月度",
    },
    {
      attributes: [
        { attributeId: "attr-version", attributeName: "版本", customValue: "专业版", displayValue: "专业版", valueCode: "pro" },
        { attributeId: "attr-cycle", attributeName: "服务周期", customValue: "年度", displayValue: "年度", valueCode: "year" },
      ],
      defaultCurrencyCode: "CNY",
      defaultPriceAmount: "3999.00",
      fulfillmentType: "subscription_activation",
      barcode: "BAR-SKU-AI-PRO-YEAR",
      image: undefined,
      productId: "product-1",
      salesUnit: "件",
      skuNo: "SKU-AI-PRO-YEAR",
      status: "active",
      taxCategory: "standard",
      title: "企业版 AI 助手 专业版 年度",
    },
    {
      attributes: [
        { attributeId: "attr-version", attributeName: "版本", customValue: "专业版", displayValue: "专业版", valueCode: "pro" },
        { attributeId: "attr-cycle", attributeName: "服务周期", customValue: "月度", displayValue: "月度", valueCode: "month" },
      ],
      defaultCurrencyCode: "CNY",
      defaultPriceAmount: "3999.00",
      fulfillmentType: "subscription_activation",
      barcode: "BAR-SKU-AI-PRO-MONTH",
      image: undefined,
      productId: "product-1",
      salesUnit: "件",
      skuNo: "SKU-AI-PRO-MONTH",
      status: "active",
      taxCategory: "standard",
      title: "企业版 AI 助手 专业版 月度",
    },
  ]);
});

test("admin catalog product list keeps the screenshot-matched operational layout", () => {
  const productListSource = readCommerceProductAdminFile("ProductListPage.tsx");

  for (const marker of [
    "bg-slate-50 dark:bg-[#0a0a0a]",
    "rounded-lg border border-slate-200 bg-white",
    "dark:border-white/10 dark:bg-[#171717]",
    "shadow-sm",
    "grid-cols-[minmax(220px,413px)_minmax(220px,413px)_minmax(220px,413px)_140px_auto_auto]",
    "bg-lobster-50",
    "dark:bg-lobster-500/10",
    "bg-slate-50",
    "h-[352px]",
    "absolute bottom-8 left-8",
    "dark:bg-[#1e1e1e]",
    "dark:shadow-black/40",
  ]) {
    assert.match(productListSource, new RegExp(escapeRegExp(marker)));
  }

  assert.doesNotMatch(productListSource, /<h1[^>]*>商品列表<\/h1>/);
  assert.doesNotMatch(productListSource, /fixed bottom-10 left-\[56px\]/);
  assert.match(productListSource, /<Plus className="h-4 w-4" \/>/);
  assert.match(productListSource, /aria-label="关闭提示"/);
  assert.match(productListSource, /aria-label="选择全部商品"/);
  assert.match(productListSource, /selectedCount={selectedProductIds\.size}/);
  assert.match(productListSource, /const hasSelection = selectedCount > 0/);
  assert.match(productListSource, /disabled=\{!hasSelection \|\| index === 0\}/);
  assert.match(productListSource, /已选 \{selectedCount\} 件/);
  assert.match(productListSource, /function productRecordKey\(record: ProductRecord, index: number\): string/);
  assert.match(productListSource, /readProductString\(record, \['id', 'spuNo'\]\) \|\| String\(index\)/);
  assert.match(productListSource, /data-admin-product-list-table-viewport/);
  assert.match(productListSource, /className="min-h-0 flex-1 overflow-auto"/);
  assert.match(productListSource, /data-admin-product-list-pagination/);
  assert.match(productListSource, /renderProductPageWindow\(page, totalPages\)\.map/);
  assert.doesNotMatch(productListSource, /发布商品|ProductCreate|CreateProduct/);
});

test("admin catalog product list adapts to dark mode and app theme color palettes", () => {
  const productListSource = readCommerceProductAdminFile("ProductListPage.tsx");
  const themePreferenceSource = readPortalFile("./src/themePreference.ts");

  for (const marker of [
    "ThemeColorPreference = 'lobster' | 'blue' | 'emerald' | 'violet' | 'amber'",
    "applyThemeColorPreference",
    "--color-lobster-500",
  ]) {
    assert.match(themePreferenceSource, new RegExp(escapeRegExp(marker)));
  }

  for (const marker of [
    "bg-lobster-600",
    "hover:bg-lobster-700",
    "text-lobster-600",
    "dark:text-lobster-300",
    "border-lobster-200",
    "dark:border-lobster-500/20",
    "focus-within:border-lobster-400",
    "focus-within:ring-lobster-500/10",
    "accent-lobster-600",
    "dark:accent-lobster-400",
    "dark:bg-[#171717]",
    "dark:bg-[#1e1e1e]",
    "dark:hover:bg-white/[0.03]",
    "dark:divide-white/10",
    "dark:text-slate-300",
    "dark:placeholder:text-slate-500",
  ]) {
    assert.match(productListSource, new RegExp(escapeRegExp(marker)));
  }

  assert.doesNotMatch(productListSource, /#2b6de8|#426ea6|#1d56a3|#18a8f5|#e5f7ff/);
  assert.doesNotMatch(productListSource, /hover:text-\[#|focus-within:border-\[#|bg-\[#e|text-\[#4/);
});

test("admin catalog product list normalizes backend product records for table rendering", async () => {
  const productList = await import("./packages/sdkwork-clawrouter-pc-admin-catalog/src/ProductListPage.tsx");

  const listResult = {
    code: "2000",
    data: {
      items: [
        {
          id: "spu-1",
          spuNo: "SPU-001",
          title: "Pro Plan",
          productType: "subscription",
          status: "active",
          currencyCode: "CNY",
          minPriceAmount: "99.00",
          media: [
            { mediaRole: "video", resource: { kind: "video", source: "external_url", url: "https://cdn.example.test/intro.mp4" } },
            { mediaRole: "main_image", resource: { kind: "image", source: "external_url", publicUrl: "https://cdn.example.test/cover.png" } },
          ],
          updatedAt: "2026-05-31T10:30:00Z",
        },
      ],
      total: 66,
      page: 2,
      pageSize: 50,
    },
  };

  assert.deepEqual(productList.readProductRecords(listResult).map((record: Record<string, unknown>) => record.id), ["spu-1"]);
  assert.deepEqual(productList.readProductCollectionMeta(listResult), { total: 66, page: 2, pageSize: 50 });
  assert.deepEqual(productList.readProductCoverResource(listResult.data.items[0]), {
    kind: "image",
    source: "external_url",
    publicUrl: "https://cdn.example.test/cover.png",
  });
  assert.equal(productList.productTypeLabel("subscription"), "订阅服务");
  assert.equal(productList.productTypeLabel("physical_good"), "实物商品");
  assert.equal(productList.productStatusLabel("active"), "销售中");
  assert.equal(productList.productStatusTone("active"), "green");
  assert.equal(productList.productStatusTone("archived"), "gray");
  assert.match(productList.formatProductDate("2026-05-31T10:30:00Z"), /2026/);
});

test("admin catalog product list computes resilient server-side pagination state", async () => {
  const productList = await import("./packages/sdkwork-clawrouter-pc-admin-catalog/src/ProductListPage.tsx");

  assert.deepEqual(productList.normalizeProductPagination({ page: 0, pageSize: 999 }), { page: 1, pageSize: 100 });
  assert.deepEqual(productList.normalizeProductPagination({ page: 4, pageSize: 25 }), { page: 4, pageSize: 25 });
  assert.deepEqual(productList.normalizeProductPagination({ page: Number.NaN, pageSize: 30 }), { page: 1, pageSize: 20 });
  assert.equal(productList.clampProductPage(6, 5), 5);
  assert.equal(productList.clampProductPage(-3, 5), 1);
  assert.equal(productList.calculateProductTotalPages(0, 50), 1);
  assert.equal(productList.calculateProductTotalPages(101, 50), 3);
  assert.deepEqual(productList.renderProductPageWindow(1, 1), [1]);
  assert.deepEqual(productList.renderProductPageWindow(1, 8), [1, 2, 3, "ellipsis-end", 8]);
  assert.deepEqual(productList.renderProductPageWindow(4, 8), [1, "ellipsis-start", 3, 4, 5, "ellipsis-end", 8]);
  assert.deepEqual(productList.renderProductPageWindow(8, 8), [1, "ellipsis-start", 6, 7, 8]);
});

test("admin catalog non-product sections keep the shared resource center", () => {
  const indexSource = readCommerceProductAdminFile("index.tsx");

  assert.match(indexSource, /<AdminResourceCenter/);
  assert.match(indexSource, /tableViewportDataAttribute="admin-catalog-table-viewport"/);
  assert.match(indexSource, /showSectionNavigation=\{false\}/);
});

test("admin catalog table-heavy custom pages stay inside the admin viewport", () => {
  const productListSource = readCommerceProductAdminFile("ProductListPage.tsx");
  const skuSource = readCommerceProductAdminFile("SkuManagementPage.tsx");
  const categorySource = readCommerceProductAdminFile("CategoryManagementPage.tsx");
  const attributeSource = readCommerceProductAdminFile("AttributeManagementPage.tsx");

  assert.match(productListSource, /data-admin-product-list-table-viewport/);
  assert.match(productListSource, /className="min-h-0 flex-1 overflow-auto"/);
  assert.match(productListSource, /data-admin-product-list-table[\s\S]*data-admin-product-list-pagination/);
  assert.match(skuSource, /relative flex h-full min-h-0 w-full flex-col overflow-hidden/);
  assert.match(skuSource, /className="h-full overflow-auto"/);
  assert.match(categorySource, /relative flex h-full min-h-0 w-full flex-col overflow-hidden/);
  assert.doesNotMatch(categorySource, /h-\[calc\(100vh-96px\)\]/);
  assert.match(attributeSource, /className="flex h-full min-h-0 flex-col gap-3 overflow-hidden/);
  assert.doesNotMatch(attributeSource, /h-\[calc\(100vh-96px\)\]/);
});
