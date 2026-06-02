import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Ban,
  ChevronRight,
  CheckCircle2,
  CircleOff,
  Edit2,
  Folder,
  FolderPlus,
  FolderTree,
  LayoutTemplate,
  Loader2,
  Package,
  Plus,
  Search,
  Store,
  Trash2,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AdminTableShell, BottomPagination, BusinessStateTableRow, ConfirmDialog, readMediaResourceUrl } from 'sdkwork-claw-router-commons';
import {
  AdminAppService,
  createAdminAppInputFromForm,
  createAdminAppTemplateInputFromForm,
  createAppCategoryInputFromForm,
  updateAdminAppInputFromForm,
  updateAdminAppTemplateInputFromForm,
  updateAppCategoryInputFromForm,
  type AdminApp,
  type AdminAppCategory,
  type AdminAppPage,
  type AdminAppMarketStatus,
  type AdminAppStatus,
  type AdminAppTemplate,
  type AdminAppTemplatePage,
  type AdminAppTemplatePublishStatus,
} from '../services/adminAppService';

type AdminAppTab = 'apps' | 'templates';
type AppModalMode = 'create' | 'edit';
type TemplateModalMode = 'create' | 'edit';
type CategoryModalMode = 'create' | 'edit';
type AppStatusFilter = '' | AdminAppStatus;
type AppMarketStatusFilter = '' | AdminAppMarketStatus;
type TemplatePublishStatusFilter = '' | AdminAppTemplatePublishStatus;
type CategoryTreeNode = AdminAppCategory & { children: CategoryTreeNode[]; depth: number };
type CategoryModalState = {
  mode: CategoryModalMode;
  category: AdminAppCategory | null;
  parentId: string | null;
} | null;

const emptyAdminAppPage: AdminAppPage = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 20,
  hasNextPage: false,
};

const emptyAdminAppTemplatePage: AdminAppTemplatePage = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 20,
  hasNextPage: false,
};

const statusOptions = [
  { value: '', labelKey: 'admin.app.filters.allRuntime' },
  { value: 'ACTIVE', labelKey: 'admin.app.status.active' },
  { value: 'INACTIVE', labelKey: 'admin.app.status.inactive' },
];

const marketStatusOptions = [
  { value: '', labelKey: 'admin.app.filters.allMarketplace' },
  { value: 'DRAFT', labelKey: 'admin.app.status.draft' },
  { value: 'PUBLISHED', labelKey: 'admin.app.status.published' },
  { value: 'OFFLINE', labelKey: 'admin.app.status.offline' },
];

const templatePublishStatusOptions = [
  { value: '', labelKey: 'admin.app.filters.allTemplatePublishStatus' },
  { value: 'DRAFT', labelKey: 'admin.app.status.draft' },
  { value: 'PUBLISHED', labelKey: 'admin.app.status.published' },
  { value: 'OFFLINE', labelKey: 'admin.app.status.offline' },
];

function buildCategoryTree(categories: AdminAppCategory[]): CategoryTreeNode[] {
  const nodes = new Map<string, CategoryTreeNode>();
  const parentById = new Map<string, string | null>();
  categories.forEach((category) => {
    nodes.set(category.id, { ...category, children: [], depth: 0 });
    parentById.set(category.id, category.parentId);
  });

  const roots: CategoryTreeNode[] = [];
  nodes.forEach((node) => {
    const parentId = node.parentId;
    const parent = parentId ? nodes.get(parentId) : undefined;
    if (!parent || parentId === node.id || hasCategoryParentCycle(node.id, parentId, parentById)) {
      roots.push(node);
      return;
    }
    parent.children.push(node);
  });

  const sortAndDepth = (items: CategoryTreeNode[], depth: number) => {
    items.sort(compareCategoryNodes);
    items.forEach((item) => {
      item.depth = depth;
      sortAndDepth(item.children, depth + 1);
    });
  };
  sortAndDepth(roots, 0);
  return roots;
}

function hasCategoryParentCycle(categoryId: string, parentId: string | null, parentById: Map<string, string | null>): boolean {
  let current = parentId;
  const visited = new Set<string>();
  while (current) {
    if (current === categoryId || visited.has(current)) {
      return true;
    }
    visited.add(current);
    current = parentById.get(current) ?? null;
  }
  return false;
}

function compareCategoryNodes(left: CategoryTreeNode, right: CategoryTreeNode): number {
  if (right.sortWeight !== left.sortWeight) {
    return right.sortWeight - left.sortWeight;
  }
  const nameOrder = left.name.localeCompare(right.name);
  return nameOrder || left.id.localeCompare(right.id);
}

function flattenCategoryTree(tree: CategoryTreeNode[]): CategoryTreeNode[] {
  const items: CategoryTreeNode[] = [];
  const visit = (nodes: CategoryTreeNode[]) => {
    nodes.forEach((node) => {
      items.push(node);
      visit(node.children);
    });
  };
  visit(tree);
  return items;
}

function AppCategoryTree({
  categories,
  tree,
  selectedCategoryId,
  selectedCategoryName,
  totalApps,
  loading,
  onSelect,
  onCreateRoot,
  onCreateChild,
  onEditCategory,
  onDeleteCategory,
}: {
  categories: AdminAppCategory[];
  tree: CategoryTreeNode[];
  selectedCategoryId: string;
  selectedCategoryName: string | undefined;
  totalApps: number;
  loading: boolean;
  onSelect: (categoryId: string) => void;
  onCreateRoot: () => void;
  onCreateChild: (category: AdminAppCategory) => void;
  onEditCategory: (category: AdminAppCategory) => void;
  onDeleteCategory: (category: AdminAppCategory) => void;
}) {
  const { t } = useTranslation();
  return (
    <aside
      data-admin-app-category-tree
      className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#171717]"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 p-3 dark:border-white/10">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <FolderTree className="h-4 w-4 text-sky-600 dark:text-sky-300" />
            <span>{t('admin.app.tree.title')}</span>
          </div>
          <div className="mt-1 truncate text-xs text-slate-500">
            {t('admin.app.tree.selected', { name: selectedCategoryName || t('admin.app.tree.all') })}
          </div>
        </div>
        <IconButton
          title={t('admin.app.actions.createCategory')}
          onClick={onCreateRoot}
          icon={<FolderPlus className="h-4 w-4" />}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <button
          type="button"
          onClick={() => onSelect('')}
          className={`mb-1 flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors ${
            !selectedCategoryId
              ? 'bg-sky-50 text-sky-800 dark:bg-sky-500/15 dark:text-sky-100'
              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.04]'
          }`}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Folder className="h-4 w-4 shrink-0" />
            <span className="truncate font-semibold">{t('admin.app.tree.all')}</span>
          </span>
          <span className="rounded bg-white px-1.5 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-300">
            {t('admin.app.tree.count', { count: totalApps })}
          </span>
        </button>

        {loading ? (
          <div className="flex items-center gap-2 px-2 py-3 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('admin.app.loading.categories')}
          </div>
        ) : tree.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 px-3 py-6 text-center text-sm text-slate-500 dark:border-white/10">
            {t('admin.app.tree.empty')}
          </div>
        ) : (
          tree.map((node) => (
            <CategoryTreeItem
              key={node.id}
              node={node}
              selectedCategoryId={selectedCategoryId}
              onSelect={onSelect}
              onCreateChild={onCreateChild}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
            />
          ))
        )}
      </div>
      <div className="shrink-0 border-t border-slate-200 px-3 py-2 text-xs text-slate-500 dark:border-white/10">
        {t('admin.app.tree.total', { count: categories.length })}
      </div>
    </aside>
  );
}

function CategoryTreeItem({
  node,
  selectedCategoryId,
  onSelect,
  onCreateChild,
  onEditCategory,
  onDeleteCategory,
}: {
  node: CategoryTreeNode;
  selectedCategoryId: string;
  onSelect: (categoryId: string) => void;
  onCreateChild: (category: AdminAppCategory) => void;
  onEditCategory: (category: AdminAppCategory) => void;
  onDeleteCategory: (category: AdminAppCategory) => void;
}) {
  const { t } = useTranslation();
  const isSelected = selectedCategoryId === node.id;
  return (
    <div>
      <div
        className={`group flex items-center gap-1 rounded-lg py-1.5 pl-2 pr-1 transition-colors ${
          isSelected
            ? 'bg-sky-50 text-sky-800 dark:bg-sky-500/15 dark:text-sky-100'
            : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.04]'
        }`}
        style={{ marginLeft: `${node.depth * 14}px` }}
      >
        <button
          type="button"
          onClick={() => onSelect(node.id)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <ChevronRight className={`h-3.5 w-3.5 shrink-0 text-slate-400 ${node.children.length > 0 ? '' : 'opacity-0'}`} />
          <Folder className="h-4 w-4 shrink-0" />
          <span className="truncate text-sm font-semibold">{node.name}</span>
          {!node.visible || node.status < 0 ? <span className="rounded bg-slate-100 px-1 text-[10px] text-slate-500 dark:bg-white/10">{node.status}</span> : null}
        </button>
        <span className="shrink-0 rounded bg-white px-1.5 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-300">
          0
        </span>
        <div className="flex shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <IconButton title={t('admin.app.actions.addChildCategory')} onClick={() => onCreateChild(node)} icon={<FolderPlus className="h-3.5 w-3.5" />} />
          <IconButton title={t('admin.app.actions.editCategory')} onClick={() => onEditCategory(node)} icon={<Edit2 className="h-3.5 w-3.5" />} />
          <IconButton title={t('admin.app.actions.deleteCategory')} onClick={() => onDeleteCategory(node)} icon={<Trash2 className="h-3.5 w-3.5" />} danger />
        </div>
      </div>
      {node.children.map((child) => (
        <CategoryTreeItem
          key={child.id}
          node={child}
          selectedCategoryId={selectedCategoryId}
          onSelect={onSelect}
          onCreateChild={onCreateChild}
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory}
        />
      ))}
    </div>
  );
}

export function AppAdmin() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AdminAppTab>('apps');
  const [categories, setCategories] = useState<AdminAppCategory[]>([]);
  const [apps, setApps] = useState<AdminApp[]>([]);
  const [pageInfo, setPageInfo] = useState<AdminAppPage>(emptyAdminAppPage);
  const [templates, setTemplates] = useState<AdminAppTemplate[]>([]);
  const [templatePageInfo, setTemplatePageInfo] = useState<AdminAppTemplatePage>(emptyAdminAppTemplatePage);
  const [keyword, setKeyword] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [status, setStatus] = useState<AppStatusFilter>('');
  const [marketStatus, setMarketStatus] = useState<AppMarketStatusFilter>('');
  const [templatePublishStatus, setTemplatePublishStatus] = useState<TemplatePublishStatusFilter>('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<AppModalMode>('create');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AdminApp | null>(null);
  const [templateModalMode, setTemplateModalMode] = useState<TemplateModalMode>('create');
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AdminAppTemplate | null>(null);
  const [categoryModalState, setCategoryModalState] = useState<CategoryModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminApp | null>(null);
  const [deleteTemplateTarget, setDeleteTemplateTarget] = useState<AdminAppTemplate | null>(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<AdminAppCategory | null>(null);

  const adminAppQuery = useMemo(() => {
    const normalizedKeyword = keyword.trim();
    return {
      searchQuery: normalizedKeyword,
      status: status || undefined,
      marketStatus: marketStatus || undefined,
      categoryId: selectedCategoryId || undefined,
      page,
      pageSize,
    };
  }, [keyword, marketStatus, page, pageSize, selectedCategoryId, status]);

  const adminTemplateQuery = useMemo(() => {
    const normalizedKeyword = keyword.trim();
    return {
      searchQuery: normalizedKeyword,
      publishStatus: templatePublishStatus || undefined,
      categoryId: selectedCategoryId || undefined,
      page,
      pageSize,
    };
  }, [keyword, page, pageSize, selectedCategoryId, templatePublishStatus]);

  const loadApps = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const result = await AdminAppService.fetchApps(adminAppQuery);
      setApps(result.items);
      setPageInfo(result);
    } catch (error) {
      setApps([]);
      setPageInfo({ ...emptyAdminAppPage, page, pageSize });
      setLoadError(errorMessage(error, t('admin.app.errors.loadFallback')));
    } finally {
      setLoading(false);
    }
  }, [adminAppQuery, page, pageSize, t]);

  useEffect(() => {
    if (activeTab === 'apps') {
      void loadApps();
    }
  }, [activeTab, loadApps]);

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const result = await AdminAppService.fetchAppTemplates(adminTemplateQuery);
      setTemplates(result.items);
      setTemplatePageInfo(result);
    } catch (error) {
      setTemplates([]);
      setTemplatePageInfo({ ...emptyAdminAppTemplatePage, page, pageSize });
      setLoadError(errorMessage(error, t('admin.app.errors.templateLoadFallback')));
    } finally {
      setLoading(false);
    }
  }, [adminTemplateQuery, page, pageSize, t]);

  useEffect(() => {
    if (activeTab === 'templates') {
      void loadTemplates();
    }
  }, [activeTab, loadTemplates]);

  const loadCategories = useCallback(async () => {
    setCategoryLoading(true);
    setLoadError(null);
    try {
      setCategories(await AdminAppService.fetchAppCategories());
    } catch (error) {
      setLoadError(errorMessage(error, t('admin.app.errors.categoryLoadFallback')));
    } finally {
      setCategoryLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const summary = useMemo(() => ({
    total: activeTab === 'templates' ? templatePageInfo.total : pageInfo.total,
    active: apps.filter((item) => item.status === 'ACTIVE').length,
    published: activeTab === 'templates'
      ? templates.filter((item) => item.publishStatus === 'PUBLISHED').length
      : apps.filter((item) => item.marketStatus === 'PUBLISHED').length,
    draft: activeTab === 'templates'
      ? templates.filter((item) => item.publishStatus === 'DRAFT').length
      : apps.filter((item) => item.marketStatus === 'DRAFT').length,
    templates: templatePageInfo.total,
  }), [activeTab, apps, pageInfo.total, templatePageInfo.total, templates]);

  const categoryNameById = useMemo(() => new Map(categories.map((item) => [item.id, item.name])), [categories]);
  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);
  const selectedCategoryName = selectedCategoryId ? categoryNameById.get(selectedCategoryId) : t('admin.app.tree.all');

  const openCreateCategory = (parentId: string | null = selectedCategoryId || null) => {
    setActionError(null);
    setCategoryModalState({ mode: 'create', category: null, parentId });
  };

  const openEditCategory = (category: AdminAppCategory) => {
    setActionError(null);
    setCategoryModalState({ mode: 'edit', category, parentId: category.parentId });
  };

  const openCreate = () => {
    if (activeTab === 'templates') {
      openCreateTemplate();
      return;
    }
    setModalMode('create');
    setEditingApp(null);
    setActionError(null);
    setModalOpen(true);
  };

  const openEdit = (app: AdminApp) => {
    setModalMode('edit');
    setEditingApp(app);
    setActionError(null);
    setModalOpen(true);
  };

  const openCreateTemplate = () => {
    setTemplateModalMode('create');
    setEditingTemplate(null);
    setActionError(null);
    setTemplateModalOpen(true);
  };

  const openEditTemplate = (template: AdminAppTemplate) => {
    setTemplateModalMode('edit');
    setEditingTemplate(template);
    setActionError(null);
    setTemplateModalOpen(true);
  };

  const handleSaveApp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) {
      return;
    }
    setSaving(true);
    setActionError(null);
    try {
      const form = new FormData(event.currentTarget);
      if (modalMode === 'edit' && editingApp) {
        await AdminAppService.updateApp(editingApp.id, updateAdminAppInputFromForm(form));
      } else {
        await AdminAppService.createApp(createAdminAppInputFromForm(form));
      }
      await loadApps();
      setModalOpen(false);
      setEditingApp(null);
    } catch (error) {
      setActionError(errorMessage(error, t('admin.app.errors.saveFallback')));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving || !categoryModalState) {
      return;
    }
    setSaving(true);
    setActionError(null);
    try {
      const form = new FormData(event.currentTarget);
      if (categoryModalState.mode === 'edit' && categoryModalState.category) {
        const updated = await AdminAppService.updateAppCategory(categoryModalState.category.id, updateAppCategoryInputFromForm(form));
        setCategories((items) => items.map((item) => item.id === updated.id ? updated : item));
      } else {
        const created = await AdminAppService.createAppCategory(createAppCategoryInputFromForm(form));
        setCategories((items) => [...items, created]);
        setSelectedCategoryId(created.id);
      }
      setCategoryModalState(null);
    } catch (error) {
      setActionError(errorMessage(error, t('admin.app.errors.categorySaveFallback')));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTemplate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) {
      return;
    }
    setSaving(true);
    setActionError(null);
    try {
      const form = new FormData(event.currentTarget);
      if (templateModalMode === 'edit' && editingTemplate) {
        await AdminAppService.updateAppTemplate(editingTemplate.id, updateAdminAppTemplateInputFromForm(form));
      } else {
        await AdminAppService.createAppTemplate(createAdminAppTemplateInputFromForm(form));
      }
      await loadTemplates();
      setTemplateModalOpen(false);
      setEditingTemplate(null);
    } catch (error) {
      setActionError(errorMessage(error, t('admin.app.errors.templateSaveFallback')));
    } finally {
      setSaving(false);
    }
  };

  const runAppAction = async (app: AdminApp, action: 'enable' | 'disable' | 'publish' | 'offline') => {
    setPendingActionId(app.id);
    setActionError(null);
    try {
      await {
        enable: () => AdminAppService.enableApp(app.id),
        disable: () => AdminAppService.disableApp(app.id),
        publish: () => AdminAppService.publishApp(app.id),
        offline: () => AdminAppService.offlineApp(app.id),
      }[action]();
      await loadApps();
    } catch (error) {
      setActionError(errorMessage(error, t('admin.app.errors.actionFallback', { action: t(`admin.app.actions.${action}`) })));
    } finally {
      setPendingActionId(null);
    }
  };

  const runTemplateAction = async (template: AdminAppTemplate, action: 'publish' | 'offline') => {
    setPendingActionId(`template:${template.id}`);
    setActionError(null);
    try {
      await {
        publish: () => AdminAppService.publishAppTemplate(template.id),
        offline: () => AdminAppService.offlineAppTemplate(template.id),
      }[action]();
      await loadTemplates();
    } catch (error) {
      setActionError(errorMessage(error, t('admin.app.errors.actionFallback', { action: t(`admin.app.actions.${action}`) })));
    } finally {
      setPendingActionId(null);
    }
  };

  const executeDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    const id = deleteTarget.id;
    setPendingActionId(id);
    setActionError(null);
    try {
      const deleted = await AdminAppService.deleteApp(id);
      if (deleted) {
        await loadApps();
      }
      setDeleteTarget(null);
    } catch (error) {
      setActionError(errorMessage(error, t('admin.app.errors.deleteFallback')));
    } finally {
      setPendingActionId(null);
    }
  };

  const executeDeleteCategory = async () => {
    if (!deleteCategoryTarget) {
      return;
    }
    const id = deleteCategoryTarget.id;
    setPendingActionId(`category:${id}`);
    setActionError(null);
    try {
      const deleted = await AdminAppService.deleteAppCategory(id);
      if (deleted) {
        setCategories((items) => items.filter((item) => item.id !== id));
        if (selectedCategoryId === id) {
          setSelectedCategoryId('');
        }
      }
      setDeleteCategoryTarget(null);
    } catch (error) {
      setActionError(errorMessage(error, t('admin.app.errors.categoryDeleteFallback')));
    } finally {
      setPendingActionId(null);
    }
  };

  const executeDeleteTemplate = async () => {
    if (!deleteTemplateTarget) {
      return;
    }
    const id = deleteTemplateTarget.id;
    setPendingActionId(`template:${id}`);
    setActionError(null);
    try {
      const deleted = await AdminAppService.deleteAppTemplate(id);
      if (deleted) {
        await loadTemplates();
      }
      setDeleteTemplateTarget(null);
    } catch (error) {
      setActionError(errorMessage(error, t('admin.app.errors.templateDeleteFallback')));
    } finally {
      setPendingActionId(null);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-4 overflow-hidden">
      <div className="flex shrink-0 justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" />
          {activeTab === 'templates' ? t('admin.app.actions.createTemplate') : t('admin.app.actions.create')}
        </button>
      </div>

      <div data-admin-app-tabs className="flex shrink-0 gap-2 rounded-lg border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-[#171717]">
        <button
          type="button"
          onClick={() => {
            setActiveTab('apps');
            setPage(1);
          }}
          className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
            activeTab === 'apps'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.04]'
          }`}
        >
          <Package className="h-4 w-4" />
          {t('admin.app.tabs.apps')}
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('templates');
            setPage(1);
          }}
          className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
            activeTab === 'templates'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.04]'
          }`}
        >
          <LayoutTemplate className="h-4 w-4" />
          {t('admin.app.tabs.templates')}
        </button>
      </div>

      <div className="grid shrink-0 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric label={t('admin.app.metrics.total')} value={summary.total} />
        <Metric label={t('admin.app.metrics.active')} value={summary.active} />
        <Metric label={t('admin.app.metrics.published')} value={summary.published} />
        <Metric label={activeTab === 'templates' ? t('admin.app.metrics.templates') : t('admin.app.metrics.draft')} value={activeTab === 'templates' ? summary.templates : summary.draft} />
      </div>

      <div data-admin-app-layout className="grid min-h-0 flex-1 grid-rows-[minmax(0,240px)_minmax(0,1fr)] gap-4 overflow-hidden xl:grid-cols-[320px_minmax(0,1fr)] xl:grid-rows-[minmax(0,1fr)]">
        <AppCategoryTree
          categories={categories}
          tree={categoryTree}
          selectedCategoryId={selectedCategoryId}
          selectedCategoryName={selectedCategoryName}
          totalApps={pageInfo.total}
          loading={categoryLoading}
          onSelect={(categoryId) => {
            setPage(1);
            setSelectedCategoryId(categoryId);
          }}
          onCreateRoot={() => openCreateCategory(null)}
          onCreateChild={(category) => openCreateCategory(category.id)}
          onEditCategory={openEditCategory}
          onDeleteCategory={setDeleteCategoryTarget}
        />

        <AdminTableShell
          data-admin-app-table-card
          viewportProps={{ 'data-admin-app-table-viewport': true }}
          header={(
            <>
              <div className="border-b border-slate-200 p-3 dark:border-white/10">
                <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
                  <div className="relative min-w-0 xl:w-[320px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={keyword}
                      onChange={(event) => {
                        setPage(1);
                        setKeyword(event.target.value);
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      placeholder={t('admin.app.filters.searchPlaceholder')}
                    />
                  </div>
                  <select
                    value={status}
                    onChange={(event) => {
                      setPage(1);
                      setStatus(event.target.value as AppStatusFilter);
                    }}
                    className={`rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 dark:border-white/10 dark:bg-[#202020] dark:text-slate-200 ${activeTab === 'apps' ? '' : 'hidden'}`}
                  >
                    {statusOptions.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
                  </select>
                  <select
                    value={marketStatus}
                    onChange={(event) => {
                      setPage(1);
                      setMarketStatus(event.target.value as AppMarketStatusFilter);
                    }}
                    className={`rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 dark:border-white/10 dark:bg-[#202020] dark:text-slate-200 ${activeTab === 'apps' ? '' : 'hidden'}`}
                  >
                    {marketStatusOptions.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
                  </select>
                  <select
                    value={templatePublishStatus}
                    onChange={(event) => {
                      setPage(1);
                      setTemplatePublishStatus(event.target.value as TemplatePublishStatusFilter);
                    }}
                    className={`rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 dark:border-white/10 dark:bg-[#202020] dark:text-slate-200 ${activeTab === 'templates' ? '' : 'hidden'}`}
                  >
                    {templatePublishStatusOptions.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
                  </select>
                </div>
              </div>
              {actionError ? (
                <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                  {actionError}
                </div>
              ) : null}
            </>
          )}
          footer={(
            <div data-admin-app-pagination>
              <BottomPagination
                page={page}
                pageSize={pageSize}
                itemCount={activeTab === 'templates' ? templates.length : apps.length}
                hasNextPage={activeTab === 'templates' ? templatePageInfo.hasNextPage : pageInfo.hasNextPage}
                disabled={loading}
                showingLabel={t('admin.app.pagination.showing')}
                pageLabel={t('admin.app.pagination.page', { page })}
                pageSizeLabel={t('admin.app.pagination.pageSize')}
                previousLabel={t('common.actions.previousPage')}
                nextLabel={t('common.actions.nextPage')}
                onPreviousPage={() => setPage((current) => Math.max(1, current - 1))}
                onNextPage={() => setPage((current) => current + 1)}
                onPageSizeChange={(nextPageSize) => {
                  setPageSize(nextPageSize);
                  setPage(1);
                }}
              />
            </div>
          )}
        >
          {activeTab === 'templates' ? (
            <table data-admin-app-template-table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/[0.03] dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t('admin.app.table.template')}</th>
                  <th className="px-4 py-3 font-semibold">{t('admin.app.templateTable.scope')}</th>
                  <th className="px-4 py-3 font-semibold">{t('admin.app.templateTable.manifests')}</th>
                  <th className="px-4 py-3 font-semibold">{t('admin.app.templateTable.lifecycle')}</th>
                  <th className="px-4 py-3 text-right font-semibold">{t('admin.app.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                {loading ? (
                  <BusinessStateTableRow colSpan={5} kind="loading" title={t('admin.app.template.state.loading')} />
                ) : loadError ? (
                  <BusinessStateTableRow colSpan={5} kind="error" title={loadError} onRetry={() => void loadTemplates()} />
                ) : templates.length === 0 ? (
                  <BusinessStateTableRow colSpan={5} kind="empty" title={t('admin.app.template.state.empty')} />
                ) : (
                  templates.map((template) => (
                    <tr key={template.id} className="align-top transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.03]">
                      <td className="px-4 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                            <LayoutTemplate className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-slate-900 dark:text-white">{template.templateName}</span>
                              <Badge value={template.templateType ?? 'template'} />
                            </div>
                            <div className="mt-1 font-mono text-xs text-slate-600 dark:text-slate-300">{template.templateCode}</div>
                            <div className="mt-1 font-mono text-xs text-slate-500">{template.templateNo}</div>
                            {template.gitRepoUrl ? (
                              <div className="mt-1 max-w-lg truncate font-mono text-xs text-slate-500">
                                {t('admin.app.fields.gitRepoUrl')}: {template.gitRepoUrl}
                              </div>
                            ) : null}
                            {template.gitSubPath || template.gitRef ? (
                              <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                                {template.gitRef ? <span>{t('admin.app.fields.gitRef')}: {template.gitRef}</span> : null}
                                {template.gitSubPath ? <span>{t('admin.app.fields.gitSubPath')}: {template.gitSubPath}</span> : null}
                              </div>
                            ) : null}
                            <div className="mt-2 max-w-lg text-xs leading-5 text-slate-500 dark:text-slate-400">{template.description || t('admin.app.empty.noDescription')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                        <div>{template.visibility}</div>
                        <div className="mt-1 text-xs text-slate-500">{template.categoryCode || (template.categoryId ? categoryNameById.get(template.categoryId) ?? template.categoryId : '-')}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                        <div>{template.runtime || '-'} · {template.framework || '-'}</div>
                        <div className="mt-1 text-xs text-slate-500">
                          {t('admin.app.templateTable.manifestCount', { count: template.dependencyManifest.length + template.capabilityManifest.length })}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1.5">
                          <StatusBadge value={template.publishStatus} label={appStatusLabel(template.publishStatus, t)} />
                          {template.featured ? <Badge value={t('admin.app.template.featured')} /> : null}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <IconButton title={t('common.actions.edit')} onClick={() => openEditTemplate(template)} icon={<Edit2 className="h-4 w-4" />} />
                          <IconButton
                            title={template.publishStatus === 'PUBLISHED' ? t('common.actions.offline') : t('common.actions.publish')}
                            onClick={() => void runTemplateAction(template, template.publishStatus === 'PUBLISHED' ? 'offline' : 'publish')}
                            icon={template.publishStatus === 'PUBLISHED' ? <CircleOff className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                            disabled={pendingActionId === `template:${template.id}`}
                          />
                          <IconButton
                            title={t('common.actions.delete')}
                            onClick={() => setDeleteTemplateTarget(template)}
                            icon={<Trash2 className="h-4 w-4" />}
                            disabled={pendingActionId === `template:${template.id}`}
                            danger
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/[0.03] dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">{t('admin.app.table.app')}</th>
                <th className="px-4 py-3 font-semibold">{t('admin.app.table.delivery')}</th>
                <th className="px-4 py-3 font-semibold">{t('admin.app.table.lifecycle')}</th>
                <th className="px-4 py-3 font-semibold">{t('admin.app.table.endpoints')}</th>
                <th className="px-4 py-3 text-right font-semibold">{t('admin.app.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {loading ? (
                <BusinessStateTableRow colSpan={5} kind="loading" title={t('admin.app.state.loading')} />
              ) : loadError ? (
                <BusinessStateTableRow colSpan={5} kind="error" title={loadError} onRetry={() => void loadApps()} />
              ) : apps.length === 0 ? (
                <BusinessStateTableRow colSpan={5} kind="empty" title={t('admin.app.state.empty')} />
              ) : (
                apps.map((app) => (
                  <tr key={app.id} className="align-top transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.03]">
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300">
                          <Store className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-white">{app.name}</span>
                            <Badge value={app.appType ?? 'app'} />
                          </div>
                          <div className="mt-1 font-mono text-xs text-slate-600 dark:text-slate-300">{app.appKey || '-'}</div>
                          <div className="mt-1 font-mono text-xs text-slate-500">{app.uuid}</div>
                          <div className="mt-2 max-w-lg text-xs leading-5 text-slate-500 dark:text-slate-400">{app.description || t('admin.app.empty.noDescription')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      <div>{app.packageName || '-'}</div>
                      <div className="mt-1 text-xs text-slate-500">{app.bundleId || app.version || '-'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5">
                        <StatusBadge value={app.status} label={appStatusLabel(app.status, t)} />
                        <StatusBadge value={app.marketStatus} label={appStatusLabel(app.marketStatus, t)} />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      <div className="max-w-xs truncate">{app.accessUrl || '-'}</div>
                      <div className="mt-1 max-w-xs truncate text-xs text-slate-500">{readMediaResourceUrl(app.artifact) || app.storeUrl || '-'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <IconButton title={t('common.actions.edit')} onClick={() => openEdit(app)} icon={<Edit2 className="h-4 w-4" />} />
                        <IconButton
                          title={app.marketStatus === 'PUBLISHED' ? t('common.actions.offline') : t('common.actions.publish')}
                          onClick={() => void runAppAction(app, app.marketStatus === 'PUBLISHED' ? 'offline' : 'publish')}
                          icon={app.marketStatus === 'PUBLISHED' ? <CircleOff className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          disabled={pendingActionId === app.id}
                        />
                        <IconButton
                          title={app.status === 'ACTIVE' ? t('common.actions.disable') : t('common.actions.enable')}
                          onClick={() => void runAppAction(app, app.status === 'ACTIVE' ? 'disable' : 'enable')}
                          icon={app.status === 'ACTIVE' ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          disabled={pendingActionId === app.id}
                        />
                        <IconButton
                          title={t('common.actions.delete')}
                          onClick={() => setDeleteTarget(app)}
                          icon={<Trash2 className="h-4 w-4" />}
                          disabled={pendingActionId === app.id}
                          danger
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          )}
        </AdminTableShell>
      </div>

      {modalOpen ? (
        <AppModal
          mode={modalMode}
          app={editingApp}
          isSaving={saving}
          error={actionError}
          onClose={() => {
            if (!saving) {
              setModalOpen(false);
              setEditingApp(null);
            }
          }}
          onSubmit={handleSaveApp}
        />
      ) : null}

      {templateModalOpen ? (
        <TemplateModal
          mode={templateModalMode}
          template={editingTemplate}
          categories={categories}
          isSaving={saving}
          error={actionError}
          onClose={() => {
            if (!saving) {
              setTemplateModalOpen(false);
              setEditingTemplate(null);
            }
          }}
          onSubmit={handleSaveTemplate}
        />
      ) : null}

      {categoryModalState ? (
        <CategoryModal
          mode={categoryModalState.mode}
          category={categoryModalState.category}
          categories={categories}
          parentId={categoryModalState.parentId}
          isSaving={saving}
          error={actionError}
          onClose={() => {
            if (!saving) {
              setCategoryModalState(null);
            }
          }}
          onSubmit={handleSaveCategory}
        />
      ) : null}

      {deleteTarget ? (
        <ConfirmDialog
          title={t('admin.app.confirm.deleteTitle')}
          description={t('admin.app.confirm.deleteDescription', { name: deleteTarget.name })}
          confirmLabel={t('admin.app.confirm.deleteConfirm')}
          tone="danger"
          isBusy={pendingActionId === deleteTarget.id}
          icon={<Trash2 className="h-4 w-4" />}
          onConfirm={() => void executeDelete()}
          onCancel={() => {
            if (!pendingActionId) {
              setDeleteTarget(null);
            }
          }}
        />
      ) : null}

      {deleteTemplateTarget ? (
        <ConfirmDialog
          title={t('admin.app.confirm.deleteTemplate.title')}
          description={t('admin.app.confirm.deleteTemplate.description', { name: deleteTemplateTarget.templateName })}
          confirmLabel={t('common.actions.delete')}
          tone="danger"
          isBusy={pendingActionId === `template:${deleteTemplateTarget.id}`}
          icon={<Trash2 className="h-4 w-4" />}
          onConfirm={() => void executeDeleteTemplate()}
          onCancel={() => {
            if (!pendingActionId) {
              setDeleteTemplateTarget(null);
            }
          }}
        />
      ) : null}

      {deleteCategoryTarget ? (
        <ConfirmDialog
          title={t('admin.app.confirm.deleteCategory.title')}
          description={t('admin.app.confirm.deleteCategory.description', { name: deleteCategoryTarget.name })}
          confirmLabel={t('common.actions.delete')}
          tone="danger"
          isBusy={pendingActionId === `category:${deleteCategoryTarget.id}`}
          icon={<Trash2 className="h-4 w-4" />}
          onConfirm={() => void executeDeleteCategory()}
          onCancel={() => {
            if (!pendingActionId) {
              setDeleteCategoryTarget(null);
            }
          }}
        />
      ) : null}
    </div>
  );
}

function AppModal({
  mode,
  app,
  isSaving,
  error,
  onClose,
  onSubmit,
}: {
  mode: AppModalMode;
  app: AdminApp | null;
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const { t } = useTranslation();
  const isEdit = mode === 'edit';
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#171717]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{isEdit ? t('admin.app.modals.editTitle') : t('admin.app.modals.createTitle')}</h3>
            <p className="mt-1 text-xs text-slate-500">{t('admin.app.modals.description')}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="max-h-[calc(90vh-73px)] overflow-y-auto p-5">
          {error ? <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</div> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t('admin.app.fields.name')} name="name" defaultValue={app?.name} required />
            <Field label={t('admin.app.fields.appKey')} name="appKey" defaultValue={standardAppKey(app)} required />
            <Field label={t('admin.app.fields.version')} name="version" defaultValue={isEdit ? app?.version ?? '' : app?.version ?? '1.0.0'} />
            <Field label={t('admin.app.fields.appType')} name="appType" defaultValue={isEdit ? app?.appType ?? '' : app?.appType ?? 'web'} />
            <Field label={t('admin.app.fields.packageName')} name="packageName" defaultValue={app?.packageName ?? ''} />
            <Field label={t('admin.app.fields.bundleId')} name="bundleId" defaultValue={app?.bundleId ?? ''} />
            <Field label={t('admin.app.fields.accessUrl')} name="accessUrl" defaultValue={app?.accessUrl ?? ''} />
            <Field label={t('admin.app.fields.storeUrl')} name="storeUrl" defaultValue={app?.storeUrl ?? ''} />
            <Field label={t('admin.app.fields.artifact')} name="artifact" defaultValue={readMediaResourceUrl(app?.artifact)} />
            <Field label={t('admin.app.fields.icon')} name="icon" defaultValue={readMediaResourceUrl(app?.icon)} />
            <Field label={t('admin.app.fields.projectId')} name="projectId" defaultValue={app?.projectId ?? ''} />
            {!isEdit ? (
              <>
                <SelectField label={t('admin.app.fields.runtimeStatus')} name="status" defaultValue={app?.status ?? 'ACTIVE'}>
                  <option value="ACTIVE">{t('admin.app.status.active')}</option>
                  <option value="INACTIVE">{t('admin.app.status.inactive')}</option>
                </SelectField>
                <SelectField label={t('admin.app.fields.marketStatus')} name="marketStatus" defaultValue={app?.marketStatus ?? 'DRAFT'}>
                  <option value="DRAFT">{t('admin.app.status.draft')}</option>
                  <option value="PUBLISHED">{t('admin.app.status.published')}</option>
                  <option value="OFFLINE">{t('admin.app.status.offline')}</option>
                </SelectField>
              </>
            ) : null}
          </div>
          <div className="mt-4">
            <TextArea label={t('admin.app.fields.description')} name="description" rows={4} defaultValue={app?.description ?? ''} plain />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextArea label={t('admin.app.fields.resourceList')} name="resourceList" defaultValue={formatJson(app?.resourceList ?? {})} />
            <TextArea label={t('admin.app.fields.config')} name="config" defaultValue={formatJson(app?.config ?? {})} />
            <TextArea label={t('admin.app.fields.platforms')} name="platforms" defaultValue={formatJson(app?.platforms ?? {})} />
            <TextArea label={t('admin.app.fields.installPlatforms')} name="installPlatforms" defaultValue={formatJson(app?.installPlatforms ?? {})} />
            <TextArea label={t('admin.app.fields.installSkill')} name="installSkill" defaultValue={formatJson(app?.installSkill ?? {})} />
            <TextArea label={t('admin.app.fields.installConfig')} name="installConfig" defaultValue={formatJson(app?.installConfig ?? {})} />
            <TextArea label={t('admin.app.fields.releaseNotes')} name="releaseNotes" defaultValue={formatJson(app?.releaseNotes ?? [])} />
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">
              {t('common.actions.cancel')}
            </button>
            <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {t('common.actions.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TemplateModal({
  mode,
  template,
  categories,
  isSaving,
  error,
  onClose,
  onSubmit,
}: {
  mode: TemplateModalMode;
  template: AdminAppTemplate | null;
  categories: AdminAppCategory[];
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const { t } = useTranslation();
  const isEdit = mode === 'edit';
  const categoryOptions = useMemo(() => flattenCategoryTree(buildCategoryTree(categories)), [categories]);
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div data-admin-app-template-modal className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#171717]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{isEdit ? t('admin.app.modals.template.editTitle') : t('admin.app.modals.template.createTitle')}</h3>
            <p className="mt-1 text-xs text-slate-500">{t('admin.app.modals.template.description')}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="max-h-[calc(90vh-73px)] overflow-y-auto p-5">
          {error ? <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</div> : null}
          <div className="grid gap-4 md:grid-cols-2">
            {isEdit ? (
              <Field label={t('admin.app.fields.templateCode')} name="displayTemplateCode" defaultValue={template?.templateCode ?? ''} />
            ) : (
              <Field label={t('admin.app.fields.templateCode')} name="templateCode" defaultValue={template?.templateCode ?? ''} required />
            )}
            <Field label={t('admin.app.fields.templateName')} name="templateName" defaultValue={template?.templateName ?? ''} required />
            <Field label={t('admin.app.fields.templateNo')} name="templateNo" defaultValue={template?.templateNo ?? ''} />
            <SelectField label={t('admin.app.fields.category')} name="categoryId" defaultValue={template?.categoryId ?? ''}>
              <option value="">{t('admin.app.tree.all')}</option>
              {categoryOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {`${'  '.repeat(item.depth)}${item.name}`}
                </option>
              ))}
            </SelectField>
            <Field label={t('admin.app.fields.categoryCode')} name="categoryCode" defaultValue={template?.categoryCode ?? ''} />
            <Field label={t('admin.app.fields.templateType')} name="templateType" defaultValue={template?.templateType ?? 'dashboard'} />
            <Field label={t('admin.app.fields.runtime')} name="runtime" defaultValue={template?.runtime ?? 'web'} />
            <Field label={t('admin.app.fields.framework')} name="framework" defaultValue={template?.framework ?? 'react'} />
            <Field label={t('admin.app.fields.language')} name="language" defaultValue={template?.language ?? 'typescript'} />
            <Field label={t('admin.app.fields.icon')} name="icon" defaultValue={readMediaResourceUrl(template?.icon)} />
            <Field label={t('admin.app.fields.cover')} name="cover" defaultValue={readMediaResourceUrl(template?.cover)} />
            <SelectField label={t('admin.app.fields.visibility')} name="visibility" defaultValue={template?.visibility ?? 'TENANT'}>
              <option value="PRIVATE">{t('admin.app.template.visibility.private')}</option>
              <option value="TENANT">{t('admin.app.template.visibility.tenant')}</option>
              <option value="PUBLIC">{t('admin.app.template.visibility.public')}</option>
            </SelectField>
            <SelectField label={t('admin.app.fields.publishStatus')} name="publishStatus" defaultValue={template?.publishStatus ?? 'DRAFT'}>
              <option value="DRAFT">{t('admin.app.status.draft')}</option>
              <option value="PUBLISHED">{t('admin.app.status.published')}</option>
              <option value="OFFLINE">{t('admin.app.status.offline')}</option>
            </SelectField>
            <SelectField label={t('admin.app.fields.featured')} name="featured" defaultValue={String(template?.featured ?? false)}>
              <option value="true">{t('admin.app.boolean.yes')}</option>
              <option value="false">{t('admin.app.boolean.no')}</option>
            </SelectField>
            <Field label={t('admin.app.fields.sortWeight')} name="sortWeight" type="number" defaultValue={String(template?.sortWeight ?? 0)} />
            <Field label={t('admin.app.fields.sourceAppId')} name="sourceAppId" defaultValue={template?.sourceAppId ?? ''} />
            <Field label={t('admin.app.fields.gitRepoUrl')} name="gitRepoUrl" defaultValue={template?.gitRepoUrl ?? ''} />
            <Field label={t('admin.app.fields.gitRef')} name="gitRef" defaultValue={template?.gitRef ?? ''} />
            <Field label={t('admin.app.fields.gitSubPath')} name="gitSubPath" defaultValue={template?.gitSubPath ?? ''} />
          </div>
          <div className="mt-4">
            <TextArea label={t('admin.app.fields.description')} name="description" rows={4} defaultValue={template?.description ?? ''} plain />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextArea label={t('admin.app.fields.appConfigSchema')} name="appConfigSchema" defaultValue={formatJson(template?.appConfigSchema ?? {})} />
            <TextArea label={t('admin.app.fields.defaultAppConfig')} name="defaultAppConfig" defaultValue={formatJson(template?.defaultAppConfig ?? {})} />
            <TextArea label={t('admin.app.fields.variableSchema')} name="variableSchema" defaultValue={formatJson(template?.variableSchema ?? {})} />
            <TextArea label={t('admin.app.fields.dependencyManifest')} name="dependencyManifest" defaultValue={formatJson(template?.dependencyManifest ?? [])} />
            <TextArea label={t('admin.app.fields.capabilityManifest')} name="capabilityManifest" defaultValue={formatJson(template?.capabilityManifest ?? [])} />
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">
              {t('common.actions.cancel')}
            </button>
            <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {t('common.actions.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CategoryModal({
  mode,
  category,
  categories,
  parentId,
  isSaving,
  error,
  onClose,
  onSubmit,
}: {
  mode: CategoryModalMode;
  category: AdminAppCategory | null;
  categories: AdminAppCategory[];
  parentId: string | null;
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const { t } = useTranslation();
  const isEdit = mode === 'edit';
  const parentOptions = useMemo(
    () => flattenCategoryTree(buildCategoryTree(categories)).filter((item) => item.id !== category?.id),
    [categories, category?.id],
  );
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-[#171717]">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isEdit ? t('admin.app.modals.category.editTitle') : t('admin.app.modals.category.createTitle')}
            </h3>
            <p className="mt-1 text-xs text-slate-500">{t('admin.app.modals.category.description')}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        {error ? <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</div> : null}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t('admin.app.fields.name')} name="name" defaultValue={category?.name ?? ''} required />
            <Field label={t('admin.app.fields.code')} name="code" defaultValue={category?.code ?? ''} />
            <SelectField label={t('admin.app.fields.parentCategory')} name="parentId" defaultValue={category?.parentId ?? parentId ?? ''}>
              <option value="">{t('admin.app.tree.root')}</option>
              {parentOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {`${'  '.repeat(item.depth)}${item.name}`}
                </option>
              ))}
            </SelectField>
            <Field label={t('admin.app.fields.sortWeight')} name="sortWeight" type="number" defaultValue={String(category?.sortWeight ?? 0)} />
            <SelectField label={t('admin.app.fields.visible')} name="visible" defaultValue={String(category?.visible ?? true)}>
              <option value="true">{t('admin.app.boolean.yes')}</option>
              <option value="false">{t('admin.app.boolean.no')}</option>
            </SelectField>
            <Field label={t('admin.app.fields.status')} name="status" type="number" defaultValue={String(category?.status ?? 1)} />
            <Field label={t('admin.app.fields.icon')} name="icon" defaultValue={readMediaResourceUrl(category?.icon)} />
            <Field label={t('admin.app.fields.path')} name="path" defaultValue={category?.path ?? ''} />
          </div>
          <TextArea label={t('admin.app.fields.description')} name="description" defaultValue={category?.description ?? ''} rows={4} plain />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">
              {t('common.actions.cancel')}
            </button>
            <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {t('common.actions.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-[#171717]">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value.toLocaleString()}</div>
    </div>
  );
}

function Field({ label, name, defaultValue = '', type = 'text', required = false }: { label: string; name: string; defaultValue?: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
      />
    </label>
  );
}

function SelectField({ label, name, defaultValue, children }: { label: string; name: string; defaultValue: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 dark:border-white/10 dark:bg-[#202020] dark:text-white"
      >
        {children}
      </select>
    </label>
  );
}

function TextArea({ label, name, defaultValue, rows = 8, plain = false }: { label: string; name: string; defaultValue: string; rows?: number; plain?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className={`w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 dark:border-white/10 dark:bg-white/5 dark:text-white ${plain ? '' : 'font-mono text-xs'}`}
      />
    </label>
  );
}

function IconButton({ title, icon, disabled, danger = false, onClick }: { title: string; icon: React.ReactNode; disabled?: boolean; danger?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        danger
          ? 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:text-red-300 dark:hover:bg-red-500/10'
          : 'border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-700 dark:border-white/10 dark:text-slate-300 dark:hover:border-sky-500/40 dark:hover:text-sky-300'
      }`}
    >
      {icon}
    </button>
  );
}

function Badge({ value }: { value: string }) {
  return <span className="rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">{value}</span>;
}

function StatusBadge({ label, value }: { label: string; value: string }) {
  const tone = value === 'PUBLISHED' || value === 'ACTIVE'
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
    : value === 'OFFLINE' || value === 'INACTIVE'
      ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'
      : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300';
  return <span className={`inline-flex w-fit rounded-md px-2 py-0.5 text-xs font-semibold ${tone}`}>{label}</span>;
}

function appStatusLabel(value: AdminAppStatus | AdminAppMarketStatus, t: ReturnType<typeof useTranslation>['t']): string {
  if (value === 'ACTIVE') return t('admin.app.status.active');
  if (value === 'INACTIVE') return t('admin.app.status.inactive');
  if (value === 'DRAFT') return t('admin.app.status.draft');
  if (value === 'PUBLISHED') return t('admin.app.status.published');
  if (value === 'OFFLINE') return t('admin.app.status.offline');
  return value;
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function standardAppKey(app: AdminApp | null): string {
  if (!app) {
    return '';
  }
  if (app.appKey) {
    return app.appKey;
  }
  return app.config.standard.appKey;
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
