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
  Loader2,
  Package,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AdminTableShell, BottomPagination, BusinessStateTableRow, ConfirmDialog, readMediaResourceUrl } from 'sdkwork-claw-router-commons';
import {
  AdminSkillService,
  createSkillCategoryInputFromForm,
  createSkillArtifactInputFromForm,
  createSkillAssetInputFromForm,
  createSkillPackageInputFromForm,
  createSkillInputFromForm,
  updateSkillCategoryInputFromForm,
  updateSkillArtifactInputFromForm,
  updateSkillAssetInputFromForm,
  updateSkillPackageInputFromForm,
  updateSkillInputFromForm,
  type AdminSkill,
  type AdminSkillArtifact,
  type AdminSkillAsset,
  type AdminSkillCategory,
  type AdminSkillPackage,
  type SkillMarketStatus,
  type SkillReviewStatus,
} from './skillService';

type SkillModalMode = 'create' | 'edit';
type PackageModalMode = 'create' | 'edit';
type CategoryModalMode = 'create' | 'edit';
type AssetModalMode = 'create' | 'edit';
type ArtifactModalMode = 'create' | 'edit';
type SkillAdminTab = 'skills' | 'packages';
type SkillMarketStatusFilter = '' | SkillMarketStatus;
type SkillReviewStatusFilter = '' | SkillReviewStatus;
type DeleteTarget = AdminSkill | null;
type PackageDeleteTarget = AdminSkillPackage | null;
type CategoryDeleteTarget = AdminSkillCategory | null;
type ReviewTarget = { skill: AdminSkill; action: 'approve' | 'reject' } | null;
type ResourceTarget = AdminSkill | null;
type CategoryTreeNode = AdminSkillCategory & { children: CategoryTreeNode[]; depth: number };
type CategoryModalState = {
  mode: CategoryModalMode;
  category: AdminSkillCategory | null;
  parentId: string | null;
} | null;

const marketStatusOptions = [
  { value: '', labelKey: 'admin.skill.filters.allMarketStatuses' },
  { value: 'DRAFT', labelKey: 'admin.skill.status.draft' },
  { value: 'PUBLISHED', labelKey: 'admin.skill.status.published' },
  { value: 'OFFLINE', labelKey: 'admin.skill.status.offline' },
  { value: 'DEPRECATED', labelKey: 'admin.skill.status.deprecated' },
];

const reviewStatusOptions = [
  { value: '', labelKey: 'admin.skill.filters.allReviewStatuses' },
  { value: 'PENDING', labelKey: 'admin.skill.status.pending' },
  { value: 'APPROVED', labelKey: 'admin.skill.status.approved' },
  { value: 'REJECTED', labelKey: 'admin.skill.status.rejected' },
];

function buildCategoryTree(categories: AdminSkillCategory[]): CategoryTreeNode[] {
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

function isCategoryInSelectedTree(
  categoryId: string | null | undefined,
  selectedCategoryId: string,
  categories: AdminSkillCategory[],
): boolean {
  if (!selectedCategoryId) {
    return true;
  }
  if (!categoryId) {
    return false;
  }
  if (categoryId === selectedCategoryId) {
    return true;
  }
  const parentById = new Map(categories.map((category) => [category.id, category.parentId]));
  let current = parentById.get(categoryId) ?? null;
  const visited = new Set<string>();
  while (current && !visited.has(current)) {
    if (current === selectedCategoryId) {
      return true;
    }
    visited.add(current);
    current = parentById.get(current) ?? null;
  }
  return false;
}

function SkillCategoryTree({
  categories,
  tree,
  selectedCategoryId,
  selectedCategoryName,
  skills,
  packages,
  loading,
  onSelect,
  onCreateRoot,
  onCreateChild,
  onEditCategory,
  onDeleteCategory,
}: {
  categories: AdminSkillCategory[];
  tree: CategoryTreeNode[];
  selectedCategoryId: string;
  selectedCategoryName: string | undefined;
  skills: AdminSkill[];
  packages: AdminSkillPackage[];
  loading: boolean;
  onSelect: (categoryId: string) => void;
  onCreateRoot: () => void;
  onCreateChild: (category: AdminSkillCategory) => void;
  onEditCategory: (category: AdminSkillCategory) => void;
  onDeleteCategory: (category: AdminSkillCategory) => void;
}) {
  const { t } = useTranslation();
  const categoryUsage = useMemo(() => {
    const next = new Map<string, number>();
    [...skills, ...packages].forEach((item) => {
      if (item.categoryId) {
        next.set(item.categoryId, (next.get(item.categoryId) ?? 0) + 1);
      }
    });
    return next;
  }, [packages, skills]);

  return (
    <aside
      data-admin-skill-category-tree
      className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#171717]"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 p-3 dark:border-white/10">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <FolderTree className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
            <span>{t('admin.skill.tree.title')}</span>
          </div>
          <div className="mt-1 truncate text-xs text-slate-500">
            {t('admin.skill.tree.selected', { name: selectedCategoryName || t('admin.skill.tree.all') })}
          </div>
        </div>
        <IconButton
          title={t('admin.skill.actions.createCategory')}
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
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-100'
              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.04]'
          }`}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Folder className="h-4 w-4 shrink-0" />
            <span className="truncate font-semibold">{t('admin.skill.tree.all')}</span>
          </span>
          <span className="rounded bg-white px-1.5 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-300">
            {t('admin.skill.tree.count', { count: skills.length + packages.length })}
          </span>
        </button>

        {loading ? (
          <div className="flex items-center gap-2 px-2 py-3 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('admin.skill.loading.categories')}
          </div>
        ) : tree.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 px-3 py-6 text-center text-sm text-slate-500 dark:border-white/10">
            {t('admin.skill.tree.empty')}
          </div>
        ) : (
          tree.map((node) => (
            <CategoryTreeItem
              key={node.id}
              node={node}
              selectedCategoryId={selectedCategoryId}
              categoryUsage={categoryUsage}
              onSelect={onSelect}
              onCreateChild={onCreateChild}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
            />
          ))
        )}
      </div>
      <div className="shrink-0 border-t border-slate-200 px-3 py-2 text-xs text-slate-500 dark:border-white/10">
        {t('admin.skill.tree.total', { count: categories.length })}
      </div>
    </aside>
  );
}

function CategoryTreeItem({
  node,
  selectedCategoryId,
  categoryUsage,
  onSelect,
  onCreateChild,
  onEditCategory,
  onDeleteCategory,
}: {
  node: CategoryTreeNode;
  selectedCategoryId: string;
  categoryUsage: Map<string, number>;
  onSelect: (categoryId: string) => void;
  onCreateChild: (category: AdminSkillCategory) => void;
  onEditCategory: (category: AdminSkillCategory) => void;
  onDeleteCategory: (category: AdminSkillCategory) => void;
}) {
  const { t } = useTranslation();
  const isSelected = selectedCategoryId === node.id;
  return (
    <div>
      <div
        className={`group flex items-center gap-1 rounded-lg py-1.5 pl-2 pr-1 transition-colors ${
          isSelected
            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-100'
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
          {categoryUsage.get(node.id) ?? 0}
        </span>
        <div className="flex shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <IconButton title={t('admin.skill.actions.addChildCategory')} onClick={() => onCreateChild(node)} icon={<FolderPlus className="h-3.5 w-3.5" />} />
          <IconButton title={t('admin.skill.actions.editCategory')} onClick={() => onEditCategory(node)} icon={<Edit2 className="h-3.5 w-3.5" />} />
          <IconButton title={t('admin.skill.actions.deleteCategory')} onClick={() => onDeleteCategory(node)} icon={<Trash2 className="h-3.5 w-3.5" />} danger />
        </div>
      </div>
      {node.children.map((child) => (
        <CategoryTreeItem
          key={child.id}
          node={child}
          selectedCategoryId={selectedCategoryId}
          categoryUsage={categoryUsage}
          onSelect={onSelect}
          onCreateChild={onCreateChild}
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory}
        />
      ))}
    </div>
  );
}

export function SkillAdmin() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<AdminSkillCategory[]>([]);
  const [packages, setPackages] = useState<AdminSkillPackage[]>([]);
  const [skills, setSkills] = useState<AdminSkill[]>([]);
  const [activeTab, setActiveTab] = useState<SkillAdminTab>('skills');
  const [keyword, setKeyword] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [marketStatus, setMarketStatus] = useState<SkillMarketStatusFilter>('');
  const [reviewStatus, setReviewStatus] = useState<SkillReviewStatusFilter>('');
  const [skillPage, setSkillPage] = useState(1);
  const [packagePage, setPackagePage] = useState(1);
  const [skillPageSize, setSkillPageSize] = useState(20);
  const [packagePageSize, setPackagePageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [skillModalMode, setSkillModalMode] = useState<SkillModalMode>('create');
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<AdminSkill | null>(null);
  const [packageModalMode, setPackageModalMode] = useState<PackageModalMode>('create');
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<AdminSkillPackage | null>(null);
  const [categoryModalState, setCategoryModalState] = useState<CategoryModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [deletePackageTarget, setDeletePackageTarget] = useState<PackageDeleteTarget>(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<CategoryDeleteTarget>(null);
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget>(null);
  const [resourceTarget, setResourceTarget] = useState<ResourceTarget>(null);

  const packageQuery = useMemo(() => ({
    searchQuery: keyword.trim(),
    categoryId: selectedCategoryId || undefined,
    page: packagePage,
    pageSize: packagePageSize,
  }), [keyword, packagePage, packagePageSize, selectedCategoryId]);

  const skillQuery = useMemo(() => ({
    searchQuery: keyword.trim(),
    categoryId: selectedCategoryId || undefined,
    marketStatus: marketStatus || undefined,
    reviewStatus: reviewStatus || undefined,
    page: skillPage,
    pageSize: skillPageSize,
  }), [keyword, marketStatus, reviewStatus, selectedCategoryId, skillPage, skillPageSize]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [nextCategories, nextPackages, nextSkills] = await Promise.all([
        AdminSkillService.fetchSkillCategories(),
        AdminSkillService.fetchSkillPackages(packageQuery),
        AdminSkillService.fetchSkills(skillQuery),
      ]);
      setCategories(nextCategories);
      setPackages(nextPackages);
      setSkills(nextSkills);
    } catch (error) {
      setLoadError(errorMessage(error, 'Failed to load agent skills.'));
    } finally {
      setLoading(false);
    }
  }, [packageQuery, skillQuery]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const categoryNameById = useMemo(() => new Map(categories.map((item) => [item.id, item.name])), [categories]);
  const packageNameById = useMemo(() => new Map(packages.map((item) => [item.id, item.name])), [packages]);
  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);
  const selectedCategoryName = selectedCategoryId ? categoryNameById.get(selectedCategoryId) : t('admin.skill.tree.all');
  const defaultCategoryId = selectedCategoryId || '';

  const filteredPackages = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return packages.filter((item) => {
      if (!isCategoryInSelectedTree(item.categoryId, selectedCategoryId, categories)) {
        return false;
      }
      if (!normalizedKeyword) {
        return true;
      }
      return [item.name, item.packageKey, item.summary, item.tags.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(normalizedKeyword);
    });
  }, [categories, keyword, packages, selectedCategoryId]);

  const filteredSkills = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return skills.filter((skill) => {
      if (!isCategoryInSelectedTree(skill.categoryId, selectedCategoryId, categories)) {
        return false;
      }
      if (marketStatus && skill.marketStatus !== marketStatus) {
        return false;
      }
      if (reviewStatus && skill.reviewStatus !== reviewStatus) {
        return false;
      }
      if (!normalizedKeyword) {
        return true;
      }
      return [skill.name, skill.skillKey, skill.summary, skill.provider, skill.tags.join(' '), skill.capabilities.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(normalizedKeyword);
    });
  }, [categories, keyword, marketStatus, reviewStatus, selectedCategoryId, skills]);

  const openCreateSkill = () => {
    setSkillModalMode('create');
    setEditingSkill(null);
    setActionError(null);
    setSkillModalOpen(true);
  };

  const openEditSkill = (skill: AdminSkill) => {
    setSkillModalMode('edit');
    setEditingSkill(skill);
    setActionError(null);
    setSkillModalOpen(true);
  };

  const openCreatePackage = () => {
    setPackageModalMode('create');
    setEditingPackage(null);
    setActionError(null);
    setPackageModalOpen(true);
  };

  const openEditPackage = (skillPackage: AdminSkillPackage) => {
    setPackageModalMode('edit');
    setEditingPackage(skillPackage);
    setActionError(null);
    setPackageModalOpen(true);
  };

  const openResourceManager = (skill: AdminSkill) => {
    setResourceTarget(skill);
    setActionError(null);
  };

  const openCreateCategory = (parentId: string | null = selectedCategoryId || null) => {
    setActionError(null);
    setCategoryModalState({ mode: 'create', category: null, parentId });
  };

  const openEditCategory = (category: AdminSkillCategory) => {
    setActionError(null);
    setCategoryModalState({ mode: 'edit', category, parentId: category.parentId });
  };

  const handleSaveSkill = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) {
      return;
    }
    setSaving(true);
    setActionError(null);
    try {
      const form = new FormData(event.currentTarget);
      if (skillModalMode === 'edit' && editingSkill) {
        const updated = await AdminSkillService.updateSkill(editingSkill.id, updateSkillInputFromForm(form));
        setSkills((items) => items.map((item) => item.id === updated.id ? updated : item));
      } else {
        const created = await AdminSkillService.createSkill(createSkillInputFromForm(form));
        setSkills((items) => [created, ...items]);
      }
      setSkillModalOpen(false);
      setEditingSkill(null);
    } catch (error) {
      setActionError(errorMessage(error, 'Failed to save skill.'));
    } finally {
      setSaving(false);
    }
  };

  const handleSavePackage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) {
      return;
    }
    setSaving(true);
    setActionError(null);
    try {
      const form = new FormData(event.currentTarget);
      if (packageModalMode === 'edit' && editingPackage) {
        const updated = await AdminSkillService.updateSkillPackage(editingPackage.id, updateSkillPackageInputFromForm(form));
        setPackages((items) => items.map((item) => item.id === updated.id ? updated : item));
      } else {
        const created = await AdminSkillService.createSkillPackage(createSkillPackageInputFromForm(form));
        setPackages((items) => [created, ...items]);
      }
      setPackageModalOpen(false);
      setEditingPackage(null);
    } catch (error) {
      setActionError(errorMessage(error, 'Failed to save package.'));
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
        const updated = await AdminSkillService.updateSkillCategory(categoryModalState.category.id, updateSkillCategoryInputFromForm(form));
        setCategories((items) => items.map((item) => item.id === updated.id ? updated : item));
      } else {
        const created = await AdminSkillService.createSkillCategory(createSkillCategoryInputFromForm(form));
        setCategories((items) => [...items, created]);
        setSelectedCategoryId(created.id);
      }
      setCategoryModalState(null);
    } catch (error) {
      setActionError(errorMessage(error, 'Failed to save category.'));
    } finally {
      setSaving(false);
    }
  };

  const updateSkillInList = (updated: AdminSkill) => {
    setSkills((items) => items.map((item) => item.id === updated.id ? updated : item));
  };

  const updatePackageInList = (updated: AdminSkillPackage) => {
    setPackages((items) => items.map((item) => item.id === updated.id ? updated : item));
  };

  const runSkillAction = async (skill: AdminSkill, action: 'enable' | 'disable' | 'publish' | 'offline') => {
    setPendingActionId(skill.id);
    setActionError(null);
    try {
      const updated = await {
        enable: () => AdminSkillService.enableSkill(skill.id),
        disable: () => AdminSkillService.disableSkill(skill.id),
        publish: () => AdminSkillService.publishSkill(skill.id),
        offline: () => AdminSkillService.offlineSkill(skill.id),
      }[action]();
      updateSkillInList(updated);
    } catch (error) {
      setActionError(errorMessage(error, `Failed to ${action} skill.`));
    } finally {
      setPendingActionId(null);
    }
  };

  const runPackageAction = async (skillPackage: AdminSkillPackage, action: 'enable' | 'disable') => {
    setPendingActionId(`package:${skillPackage.id}`);
    setActionError(null);
    try {
      const updated = action === 'enable'
        ? await AdminSkillService.enableSkillPackage(skillPackage.id)
        : await AdminSkillService.disableSkillPackage(skillPackage.id);
      updatePackageInList(updated);
    } catch (error) {
      setActionError(errorMessage(error, `Failed to ${action} package.`));
    } finally {
      setPendingActionId(null);
    }
  };

  const executeReview = async () => {
    if (!reviewTarget) {
      return;
    }
    setPendingActionId(reviewTarget.skill.id);
    setActionError(null);
    try {
      const comment = reviewTarget.action === 'approve' ? 'Approved' : 'Rejected';
      const updated = reviewTarget.action === 'approve'
        ? await AdminSkillService.approveSkill(reviewTarget.skill.id, comment)
        : await AdminSkillService.rejectSkill(reviewTarget.skill.id, comment);
      updateSkillInList(updated);
      setReviewTarget(null);
    } catch (error) {
      setActionError(errorMessage(error, `Failed to ${reviewTarget.action} skill.`));
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
      const deleted = await AdminSkillService.deleteSkill(id);
      if (deleted) {
        setSkills((items) => items.filter((item) => item.id !== id));
      }
      setDeleteTarget(null);
    } catch (error) {
      setActionError(errorMessage(error, 'Failed to delete skill.'));
    } finally {
      setPendingActionId(null);
    }
  };

  const executeDeletePackage = async () => {
    if (!deletePackageTarget) {
      return;
    }
    const id = deletePackageTarget.id;
    setPendingActionId(`package:${id}`);
    setActionError(null);
    try {
      const deleted = await AdminSkillService.deleteSkillPackage(id);
      if (deleted) {
        setPackages((items) => items.filter((item) => item.id !== id));
        setSkills((items) => items.map((item) => item.packageId === id ? { ...item, packageId: null } : item));
      }
      setDeletePackageTarget(null);
    } catch (error) {
      setActionError(errorMessage(error, 'Failed to delete package.'));
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
      const deleted = await AdminSkillService.deleteSkillCategory(id);
      if (deleted) {
        setCategories((items) => items.filter((item) => item.id !== id));
        if (selectedCategoryId === id) {
          setSelectedCategoryId('');
        }
      }
      setDeleteCategoryTarget(null);
    } catch (error) {
      setActionError(errorMessage(error, 'Failed to delete category.'));
    } finally {
      setPendingActionId(null);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      <div data-admin-skill-layout className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <SkillCategoryTree
          categories={categories}
          tree={categoryTree}
          selectedCategoryId={selectedCategoryId}
          selectedCategoryName={selectedCategoryName}
          skills={skills}
          packages={packages}
          loading={loading}
          onSelect={(categoryId) => {
            setSkillPage(1);
            setPackagePage(1);
            setSelectedCategoryId(categoryId);
          }}
          onCreateRoot={() => openCreateCategory(null)}
          onCreateChild={(category) => openCreateCategory(category.id)}
          onEditCategory={openEditCategory}
          onDeleteCategory={setDeleteCategoryTarget}
        />
        <AdminTableShell
          data-admin-skill-table-card
          viewportProps={{ 'data-admin-skill-table-viewport': true }}
          header={(
            <>
              <div data-admin-skill-table-header className="border-b border-slate-200 p-3 dark:border-white/10">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div
                    role="tablist"
                    aria-label={t('admin.skill.tabs.label')}
                    className="inline-flex w-full rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-white/[0.03] sm:w-auto"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'skills'}
                      onClick={() => setActiveTab('skills')}
                      className={`inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors sm:min-w-[160px] ${
                        activeTab === 'skills'
                          ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      <span>{t('admin.skill.tabs.skills')}</span>
                      <span className={`rounded px-1.5 py-0.5 text-[11px] ${activeTab === 'skills' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200' : 'bg-white text-slate-500 dark:bg-white/10 dark:text-slate-300'}`}>
                        {skills.length.toLocaleString()}
                      </span>
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'packages'}
                      onClick={() => setActiveTab('packages')}
                      className={`inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors sm:min-w-[160px] ${
                        activeTab === 'packages'
                          ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      <span>{t('admin.skill.tabs.packages')}</span>
                      <span className={`rounded px-1.5 py-0.5 text-[11px] ${activeTab === 'packages' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200' : 'bg-white text-slate-500 dark:bg-white/10 dark:text-slate-300'}`}>
                        {packages.length.toLocaleString()}
                      </span>
                    </button>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openCreateCategory(null)}
                      className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-emerald-500/40 dark:hover:text-emerald-300"
                    >
                      <Plus className="h-4 w-4" />
                      {t('admin.skill.actions.createCategory')}
                    </button>
                    <button
                      type="button"
                      onClick={activeTab === 'packages' ? openCreatePackage : openCreateSkill}
                      className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                      <Plus className="h-4 w-4" />
                      {activeTab === 'packages' ? t('admin.skill.actions.createPackage') : t('admin.skill.actions.createSkill')}
                    </button>
                  </div>
                </div>
                <div data-admin-skill-table-filters className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-center">
                  <div className="relative min-w-0 lg:w-[320px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={keyword}
                      onChange={(event) => {
                        setSkillPage(1);
                        setPackagePage(1);
                        setKeyword(event.target.value);
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      placeholder={t('admin.skill.filters.searchPlaceholder')}
                    />
                  </div>
                  <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300">
                    <Folder className="h-4 w-4 text-slate-400" />
                    <span className="max-w-[220px] truncate">{selectedCategoryName}</span>
                  </div>
                  {activeTab === 'skills' ? (
                    <>
                      <select
                        value={marketStatus}
                        onChange={(event) => {
                          setSkillPage(1);
                          setMarketStatus(event.target.value as SkillMarketStatusFilter);
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-[#202020] dark:text-slate-200"
                      >
                        {marketStatusOptions.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
                      </select>
                      <select
                        value={reviewStatus}
                        onChange={(event) => {
                          setSkillPage(1);
                          setReviewStatus(event.target.value as SkillReviewStatusFilter);
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-[#202020] dark:text-slate-200"
                      >
                        {reviewStatusOptions.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
                      </select>
                    </>
                  ) : null}
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
            <div data-admin-skill-pagination>
              {activeTab === 'packages' ? (
                <BottomPagination
                  page={packagePage}
                  pageSize={packagePageSize}
                  itemCount={filteredPackages.length}
                  hasNextPage={filteredPackages.length >= packagePageSize}
                  disabled={loading}
                  showingLabel={t('admin.skill.pagination.showing')}
                  pageLabel={t('admin.skill.pagination.page', { page: packagePage })}
                  pageSizeLabel={t('admin.skill.pagination.pageSize')}
                  previousLabel={t('common.actions.previousPage')}
                  nextLabel={t('common.actions.nextPage')}
                  onPreviousPage={() => setPackagePage((current) => Math.max(1, current - 1))}
                  onNextPage={() => setPackagePage((current) => current + 1)}
                  onPageSizeChange={(nextPageSize) => {
                    setPackagePageSize(nextPageSize);
                    setPackagePage(1);
                  }}
                />
              ) : (
                <BottomPagination
                  page={skillPage}
                  pageSize={skillPageSize}
                  itemCount={filteredSkills.length}
                  hasNextPage={filteredSkills.length >= skillPageSize}
                  disabled={loading}
                  showingLabel={t('admin.skill.pagination.showing')}
                  pageLabel={t('admin.skill.pagination.page', { page: skillPage })}
                  pageSizeLabel={t('admin.skill.pagination.pageSize')}
                  previousLabel={t('common.actions.previousPage')}
                  nextLabel={t('common.actions.nextPage')}
                  onPreviousPage={() => setSkillPage((current) => Math.max(1, current - 1))}
                  onNextPage={() => setSkillPage((current) => current + 1)}
                  onPageSizeChange={(nextPageSize) => {
                    setSkillPageSize(nextPageSize);
                    setSkillPage(1);
                  }}
                />
              )}
            </div>
          )}
        >

      {activeTab === 'packages' ? (
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/[0.03] dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">{t('admin.skill.tables.package')}</th>
                <th className="px-4 py-3 font-semibold">{t('admin.skill.tables.category')}</th>
                <th className="px-4 py-3 font-semibold">{t('admin.skill.tables.state')}</th>
                <th className="px-4 py-3 font-semibold">{t('admin.skill.tables.tags')}</th>
                <th className="px-4 py-3 text-right font-semibold">{t('common.actions.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {loading ? (
                <BusinessStateTableRow colSpan={5} kind="loading" title={t('admin.skill.loading.packages')} />
              ) : loadError ? (
                <BusinessStateTableRow colSpan={5} kind="error" title={loadError} onRetry={() => void loadAll()} />
              ) : filteredPackages.length === 0 ? (
                <BusinessStateTableRow colSpan={5} kind="empty" title={t('admin.skill.empty.noPackages')} />
              ) : (
                filteredPackages.map((item) => (
                  <tr key={item.id} className="align-top transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.03]">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                      <div className="mt-1 font-mono text-xs text-slate-500">{item.packageKey}</div>
                      <div className="mt-2 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">{item.summary || item.description || t('admin.skill.empty.noSummary')}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      {item.categoryId ? categoryNameById.get(item.categoryId) ?? `#${item.categoryId}` : '-'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5">
                        <StatusBadge value={item.enabled ? 'ENABLED' : 'DISABLED'} />
                        {item.featured ? <StatusBadge value="FEATURED" /> : null}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.slice(0, 4).map((tag) => <Badge key={tag} tone="emerald">{tag}</Badge>)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <IconButton title={t('common.actions.edit')} onClick={() => openEditPackage(item)} icon={<Edit2 className="h-4 w-4" />} />
                        <IconButton
                          title={item.enabled ? t('common.actions.disable') : t('common.actions.enable')}
                          onClick={() => void runPackageAction(item, item.enabled ? 'disable' : 'enable')}
                          icon={item.enabled ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          disabled={pendingActionId === `package:${item.id}`}
                        />
                        <IconButton
                          title={t('common.actions.delete')}
                          onClick={() => setDeletePackageTarget(item)}
                          icon={<Trash2 className="h-4 w-4" />}
                          disabled={pendingActionId === `package:${item.id}`}
                          danger
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
      ) : null}

      {activeTab === 'skills' ? (
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/[0.03] dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">{t('admin.skill.tables.skill')}</th>
                <th className="px-4 py-3 font-semibold">{t('admin.skill.tables.category')}</th>
                <th className="px-4 py-3 font-semibold">{t('admin.skill.tables.lifecycle')}</th>
                <th className="px-4 py-3 font-semibold">{t('admin.skill.tables.usage')}</th>
                <th className="px-4 py-3 font-semibold">{t('admin.skill.tables.runtime')}</th>
                <th className="px-4 py-3 text-right font-semibold">{t('common.actions.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {loading ? (
                <BusinessStateTableRow colSpan={6} kind="loading" title={t('admin.skill.loading.skills')} />
              ) : loadError ? (
                <BusinessStateTableRow colSpan={6} kind="error" title={loadError} onRetry={() => void loadAll()} />
              ) : filteredSkills.length === 0 ? (
                <BusinessStateTableRow colSpan={6} kind="empty" title={t('admin.skill.empty.noSkills')} />
              ) : (
                filteredSkills.map((skill) => (
                  <tr key={skill.id} className="align-top transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.03]">
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-white">{skill.name}</span>
                            {skill.featured ? <Badge tone="amber">{t('admin.skill.status.featured')}</Badge> : null}
                            {skill.builtin || skill.isBuiltin ? <Badge tone="slate">{t('admin.skill.status.builtin')}</Badge> : null}
                          </div>
                          <div className="mt-1 font-mono text-xs text-slate-500">{skill.skillKey}</div>
                          <div className="mt-2 max-w-lg text-xs leading-5 text-slate-500 dark:text-slate-400">{skill.summary || skill.description || t('admin.skill.empty.noSummary')}</div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {skill.tags.slice(0, 4).map((tag) => <Badge key={tag} tone="emerald">{tag}</Badge>)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      <div>{skill.categoryId ? categoryNameById.get(skill.categoryId) ?? `#${skill.categoryId}` : '-'}</div>
                      <div className="mt-1 text-xs text-slate-500">{skill.packageId ? packageNameById.get(skill.packageId) ?? `#${skill.packageId}` : t('admin.skill.empty.noPackage')}</div>
                      <div className="mt-1 text-xs text-slate-500">{skill.provider || 'sdkwork'} / {skill.version || '1.0.0'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5">
                        <StatusBadge value={skill.marketStatus} />
                        <StatusBadge value={skill.reviewStatus} />
                        <StatusBadge value={skill.enabled ? 'ENABLED' : 'DISABLED'} />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      <div>{t('admin.skill.tables.installsValue', { count: skill.installCount })}</div>
                      <div className="mt-1 text-xs text-slate-500">{t('admin.skill.tables.ratingValue', { rating: skill.ratingAvg, count: skill.ratingCount })}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      <div>{skill.runtime || '-'}</div>
                      <div className="mt-1 text-xs text-slate-500">{skill.entrypoint || '-'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <IconButton title={t('common.actions.edit')} onClick={() => openEditSkill(skill)} icon={<Edit2 className="h-4 w-4" />} />
                        <IconButton title={t('admin.skill.actions.manageResources')} onClick={() => openResourceManager(skill)} icon={<Package className="h-4 w-4" />} />
                        <IconButton
                          title={skill.reviewStatus === 'APPROVED' ? t('admin.skill.actions.reject') : t('admin.skill.actions.approve')}
                          onClick={() => setReviewTarget({ skill, action: skill.reviewStatus === 'APPROVED' ? 'reject' : 'approve' })}
                          icon={skill.reviewStatus === 'APPROVED' ? <XCircle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                          disabled={pendingActionId === skill.id}
                        />
                        <IconButton
                          title={skill.marketStatus === 'PUBLISHED' ? t('common.actions.offline') : t('common.actions.publish')}
                          onClick={() => void runSkillAction(skill, skill.marketStatus === 'PUBLISHED' ? 'offline' : 'publish')}
                          icon={skill.marketStatus === 'PUBLISHED' ? <CircleOff className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          disabled={pendingActionId === skill.id}
                        />
                        <IconButton
                          title={skill.enabled ? t('common.actions.disable') : t('common.actions.enable')}
                          onClick={() => void runSkillAction(skill, skill.enabled ? 'disable' : 'enable')}
                          icon={skill.enabled ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          disabled={pendingActionId === skill.id}
                        />
                        <IconButton
                          title={t('common.actions.delete')}
                          onClick={() => setDeleteTarget(skill)}
                          icon={<Trash2 className="h-4 w-4" />}
                          disabled={pendingActionId === skill.id}
                          danger
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
      ) : null}
        </AdminTableShell>
      </div>

      {skillModalOpen ? (
        <SkillModal
          mode={skillModalMode}
          skill={editingSkill}
          categories={categories}
          packages={packages}
          defaultCategoryId={defaultCategoryId}
          isSaving={saving}
          error={actionError}
          onClose={() => {
            if (!saving) {
              setSkillModalOpen(false);
              setEditingSkill(null);
            }
          }}
          onSubmit={handleSaveSkill}
        />
      ) : null}

      {packageModalOpen ? (
        <PackageModal
          mode={packageModalMode}
          skillPackage={editingPackage}
          categories={categories}
          defaultCategoryId={defaultCategoryId}
          isSaving={saving}
          error={actionError}
          onClose={() => {
            if (!saving) {
              setPackageModalOpen(false);
              setEditingPackage(null);
            }
          }}
          onSubmit={handleSavePackage}
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

      {resourceTarget ? (
        <SkillResourcesModal
          skill={resourceTarget}
          onClose={() => setResourceTarget(null)}
        />
      ) : null}

      {deletePackageTarget ? (
        <ConfirmDialog
          title={t('admin.skill.confirm.deletePackage.title')}
          description={t('admin.skill.confirm.deletePackage.description', { name: deletePackageTarget.name })}
          confirmLabel={t('common.actions.delete')}
          tone="danger"
          isBusy={pendingActionId === `package:${deletePackageTarget.id}`}
          icon={<Trash2 className="h-4 w-4" />}
          onConfirm={() => void executeDeletePackage()}
          onCancel={() => {
            if (!pendingActionId) {
              setDeletePackageTarget(null);
            }
          }}
        />
      ) : null}

      {deleteTarget ? (
        <ConfirmDialog
          title={t('admin.skill.confirm.deleteSkill.title')}
          description={t('admin.skill.confirm.deleteSkill.description', { name: deleteTarget.name })}
          confirmLabel={t('common.actions.delete')}
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

      {deleteCategoryTarget ? (
        <ConfirmDialog
          title={t('admin.skill.confirm.deleteCategory.title')}
          description={t('admin.skill.confirm.deleteCategory.description', { name: deleteCategoryTarget.name })}
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

      {reviewTarget ? (
        <ConfirmDialog
          title={reviewTarget.action === 'approve' ? t('admin.skill.confirm.review.approveTitle') : t('admin.skill.confirm.review.rejectTitle')}
          description={t('admin.skill.confirm.review.description', {
            action: reviewTarget.action === 'approve' ? t('admin.skill.actions.approve') : t('admin.skill.actions.reject'),
            name: reviewTarget.skill.name,
          })}
          confirmLabel={reviewTarget.action === 'approve' ? t('admin.skill.actions.approve') : t('admin.skill.actions.reject')}
          isBusy={pendingActionId === reviewTarget.skill.id}
          icon={reviewTarget.action === 'approve' ? <ShieldCheck className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          onConfirm={() => void executeReview()}
          onCancel={() => {
            if (!pendingActionId) {
              setReviewTarget(null);
            }
          }}
        />
      ) : null}
    </div>
  );
}

function SkillModal({
  mode,
  skill,
  categories,
  packages,
  defaultCategoryId,
  isSaving,
  error,
  onClose,
  onSubmit,
}: {
  mode: SkillModalMode;
  skill: AdminSkill | null;
  categories: AdminSkillCategory[];
  packages: AdminSkillPackage[];
  defaultCategoryId: string;
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
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isEdit ? t('admin.skill.modals.skill.editTitle') : t('admin.skill.modals.skill.createTitle')}
            </h3>
            <p className="mt-1 text-xs text-slate-500">{t('admin.skill.modals.skill.description')}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="max-h-[calc(90vh-73px)] overflow-y-auto p-5">
          {error ? <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</div> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t('admin.skill.fields.skillKey')} name="skillKey" defaultValue={skill?.skillKey} required={!isEdit} />
            <Field label={t('admin.skill.fields.name')} name="name" defaultValue={skill?.name} required />
            <Field label={t('admin.skill.fields.summary')} name="summary" defaultValue={skill?.summary} />
            <Field label={t('admin.skill.fields.provider')} name="provider" defaultValue={skill?.provider || 'sdkwork'} />
            <SelectField label={t('admin.skill.fields.category')} name="categoryId" defaultValue={skill?.categoryId ?? defaultCategoryId}>
              <option value="">{t('admin.skill.empty.noCategory')}</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </SelectField>
            <SelectField label={t('admin.skill.fields.package')} name="packageId" defaultValue={skill?.packageId ?? ''}>
              <option value="">{t('admin.skill.empty.noPackage')}</option>
              {packages.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </SelectField>
            <Field label={t('admin.skill.fields.version')} name="version" defaultValue={skill?.version || '1.0.0'} />
            <Field label={t('admin.skill.fields.runtime')} name="runtime" defaultValue={skill?.runtime || 'agent-skill'} />
            <Field label={t('admin.skill.fields.entrypoint')} name="entrypoint" defaultValue={skill?.entrypoint || 'skill.json'} />
            <Field label={t('admin.skill.fields.icon')} name="icon" defaultValue={readMediaResourceUrl(skill?.icon)} />
            <Field label={t('admin.skill.fields.cover')} name="cover" defaultValue={readMediaResourceUrl(skill?.cover)} />
            <Field label={t('admin.skill.fields.manifestUrl')} name="manifestUrl" defaultValue={skill?.manifestUrl} />
            <Field label={t('admin.skill.fields.documentationUrl')} name="documentationUrl" defaultValue={skill?.documentationUrl} />
            <Field label={t('admin.skill.fields.license')} name="licenseName" defaultValue={skill?.licenseName || 'MIT'} />
            <Field label={t('admin.skill.fields.recommendWeight')} name="recommendWeight" type="number" defaultValue={String(skill?.recommendWeight ?? 0)} />
            <Field label={t('admin.skill.fields.tags')} name="tags" defaultValue={skill?.tags.join(', ')} />
            <Field label={t('admin.skill.fields.capabilities')} name="capabilities" defaultValue={skill?.capabilities.join(', ')} />
            {!isEdit ? (
              <>
                <input type="hidden" name="sourceType" value="COMMUNITY" />
                <input type="hidden" name="marketStatus" value="DRAFT" />
                <input type="hidden" name="reviewStatus" value="PENDING" />
              </>
            ) : null}
            <SelectField label={t('admin.skill.fields.visibility')} name="visibility" defaultValue={skill?.visibility ?? 'PUBLIC'}>
              <option value="PUBLIC">{t('admin.skill.visibility.public')}</option>
              <option value="PRIVATE">{t('admin.skill.visibility.private')}</option>
              <option value="UNLISTED">{t('admin.skill.visibility.unlisted')}</option>
            </SelectField>
            <SelectField label={t('admin.skill.fields.featured')} name="featured" defaultValue={String(skill?.featured ?? false)}>
              <option value="false">{t('admin.skill.boolean.no')}</option>
              <option value="true">{t('admin.skill.boolean.yes')}</option>
            </SelectField>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextArea label={t('admin.skill.fields.configSchema')} name="configSchema" defaultValue={formatJson(skill?.configSchema ?? { type: 'object' })} />
            <TextArea label={t('admin.skill.fields.defaultConfig')} name="defaultConfig" defaultValue={formatJson(skill?.defaultConfig ?? {})} />
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

function PackageModal({
  mode,
  skillPackage,
  categories,
  defaultCategoryId,
  isSaving,
  error,
  onClose,
  onSubmit,
}: {
  mode: PackageModalMode;
  skillPackage: AdminSkillPackage | null;
  categories: AdminSkillCategory[];
  defaultCategoryId: string;
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const { t } = useTranslation();
  const isEdit = mode === 'edit';
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-[#171717]">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isEdit ? t('admin.skill.modals.package.editTitle') : t('admin.skill.modals.package.createTitle')}
            </h3>
            <p className="mt-1 text-xs text-slate-500">{t('admin.skill.modals.package.description')}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        {error ? <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</div> : null}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t('admin.skill.fields.packageKey')} name="packageKey" defaultValue={skillPackage?.packageKey} required={!isEdit} />
            <Field label={t('admin.skill.fields.name')} name="name" defaultValue={skillPackage?.name} required />
            <Field label={t('admin.skill.fields.summary')} name="summary" defaultValue={skillPackage?.summary} />
            <SelectField label={t('admin.skill.fields.category')} name="categoryId" defaultValue={skillPackage?.categoryId ?? defaultCategoryId}>
              <option value="">{t('admin.skill.empty.noCategory')}</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </SelectField>
            <Field label={t('admin.skill.fields.icon')} name="icon" defaultValue={readMediaResourceUrl(skillPackage?.icon)} />
            <Field label={t('admin.skill.fields.cover')} name="cover" defaultValue={readMediaResourceUrl(skillPackage?.cover)} />
            <Field label={t('admin.skill.fields.sortWeight')} name="sortWeight" type="number" defaultValue={String(skillPackage?.sortWeight ?? 0)} />
            <Field label={t('admin.skill.fields.tags')} name="tags" defaultValue={skillPackage?.tags.join(', ')} />
            <SelectField label={t('admin.skill.fields.enabled')} name="enabled" defaultValue={String(skillPackage?.enabled ?? true)}>
              <option value="true">{t('admin.skill.boolean.yes')}</option>
              <option value="false">{t('admin.skill.boolean.no')}</option>
            </SelectField>
            <SelectField label={t('admin.skill.fields.featured')} name="featured" defaultValue={String(skillPackage?.featured ?? false)}>
              <option value="false">{t('admin.skill.boolean.no')}</option>
              <option value="true">{t('admin.skill.boolean.yes')}</option>
            </SelectField>
          </div>
          <TextArea label={t('admin.skill.fields.description')} name="description" defaultValue={skillPackage?.description ?? ''} />
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
  category: AdminSkillCategory | null;
  categories: AdminSkillCategory[];
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
              {isEdit ? t('admin.skill.modals.category.editTitle') : t('admin.skill.modals.category.createTitle')}
            </h3>
            <p className="mt-1 text-xs text-slate-500">{t('admin.skill.modals.category.description')}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        {error ? <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</div> : null}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t('admin.skill.fields.name')} name="name" defaultValue={category?.name ?? ''} required />
            <Field label={t('admin.skill.fields.code')} name="code" defaultValue={category?.code ?? ''} />
            <SelectField label={t('admin.skill.fields.parentCategory')} name="parentId" defaultValue={category?.parentId ?? parentId ?? ''}>
              <option value="">{t('admin.skill.tree.root')}</option>
              {parentOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {`${'  '.repeat(item.depth)}${item.name}`}
                </option>
              ))}
            </SelectField>
            <Field label={t('admin.skill.fields.sortWeight')} name="sortWeight" type="number" defaultValue={String(category?.sortWeight ?? 0)} />
            <SelectField label={t('admin.skill.fields.type')} name="type" defaultValue={String(category?.type ?? 19)}>
              <option value="19">{t('admin.skill.categoryTypes.skill')}</option>
              <option value="20">{t('admin.skill.categoryTypes.package')}</option>
            </SelectField>
            <SelectField label={t('admin.skill.fields.visible')} name="visible" defaultValue={String(category?.visible ?? true)}>
              <option value="true">{t('admin.skill.boolean.yes')}</option>
              <option value="false">{t('admin.skill.boolean.no')}</option>
            </SelectField>
            <Field label={t('admin.skill.fields.status')} name="status" type="number" defaultValue={String(category?.status ?? 1)} />
            <Field label={t('admin.skill.fields.icon')} name="icon" defaultValue={readMediaResourceUrl(category?.icon)} />
            <Field label={t('admin.skill.fields.path')} name="path" defaultValue={category?.path ?? ''} />
          </div>
          <TextArea label={t('admin.skill.fields.description')} name="description" defaultValue={category?.description ?? ''} rows={4} />
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

function SkillResourcesModal({ skill, onClose }: { skill: AdminSkill; onClose: () => void }) {
  const { t } = useTranslation();
  const [assets, setAssets] = useState<AdminSkillAsset[]>([]);
  const [artifacts, setArtifacts] = useState<AdminSkillArtifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [assetMode, setAssetMode] = useState<AssetModalMode | null>(null);
  const [artifactMode, setArtifactMode] = useState<ArtifactModalMode | null>(null);
  const [editingAsset, setEditingAsset] = useState<AdminSkillAsset | null>(null);
  const [editingArtifact, setEditingArtifact] = useState<AdminSkillArtifact | null>(null);
  const [deleteAssetTarget, setDeleteAssetTarget] = useState<AdminSkillAsset | null>(null);
  const [deleteArtifactTarget, setDeleteArtifactTarget] = useState<AdminSkillArtifact | null>(null);

  const loadResources = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [nextAssets, nextArtifacts] = await Promise.all([
        AdminSkillService.fetchSkillAssets(skill.id),
        AdminSkillService.fetchSkillArtifacts(skill.id),
      ]);
      setAssets(nextAssets);
      setArtifacts(nextArtifacts);
    } catch (error) {
      setLoadError(errorMessage(error, 'Failed to load skill resources.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadResources();
  }, [skill.id]);

  const openCreateAsset = () => {
    setActionError(null);
    setAssetMode('create');
    setEditingAsset(null);
  };

  const openEditAsset = (asset: AdminSkillAsset) => {
    setActionError(null);
    setAssetMode('edit');
    setEditingAsset(asset);
  };

  const openCreateArtifact = () => {
    setActionError(null);
    setArtifactMode('create');
    setEditingArtifact(null);
  };

  const openEditArtifact = (artifact: AdminSkillArtifact) => {
    setActionError(null);
    setArtifactMode('edit');
    setEditingArtifact(artifact);
  };

  const resetForms = () => {
    setAssetMode(null);
    setArtifactMode(null);
    setEditingAsset(null);
    setEditingArtifact(null);
  };

  const handleSaveAsset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) {
      return;
    }
    setSaving('asset');
    setActionError(null);
    try {
      const form = new FormData(event.currentTarget);
      if (assetMode === 'edit' && editingAsset) {
        const updated = await AdminSkillService.updateSkillAsset(skill.id, editingAsset.id, updateSkillAssetInputFromForm(form));
        setAssets((items) => items.map((item) => item.id === updated.id ? updated : item));
      } else {
        const created = await AdminSkillService.createSkillAsset(skill.id, createSkillAssetInputFromForm(form));
        setAssets((items) => [created, ...items]);
      }
      setAssetMode(null);
      setEditingAsset(null);
    } catch (error) {
      setActionError(errorMessage(error, 'Failed to save skill asset.'));
    } finally {
      setSaving(null);
    }
  };

  const handleSaveArtifact = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) {
      return;
    }
    setSaving('artifact');
    setActionError(null);
    try {
      const form = new FormData(event.currentTarget);
      if (artifactMode === 'edit' && editingArtifact) {
        const updated = await AdminSkillService.updateSkillArtifact(skill.id, editingArtifact.id, updateSkillArtifactInputFromForm(form));
        setArtifacts((items) => items.map((item) => item.id === updated.id ? updated : item));
      } else {
        const created = await AdminSkillService.createSkillArtifact(skill.id, createSkillArtifactInputFromForm(form));
        setArtifacts((items) => [created, ...items]);
      }
      setArtifactMode(null);
      setEditingArtifact(null);
    } catch (error) {
      setActionError(errorMessage(error, 'Failed to save skill artifact.'));
    } finally {
      setSaving(null);
    }
  };

  const executeDeleteAsset = async () => {
    if (!deleteAssetTarget || saving) {
      return;
    }
    setSaving(`asset:${deleteAssetTarget.id}`);
    setActionError(null);
    try {
      await AdminSkillService.deleteSkillAsset(skill.id, deleteAssetTarget.id);
      setAssets((items) => items.filter((item) => item.id !== deleteAssetTarget.id));
      setDeleteAssetTarget(null);
    } catch (error) {
      setActionError(errorMessage(error, 'Failed to delete skill asset.'));
    } finally {
      setSaving(null);
    }
  };

  const executeDeleteArtifact = async () => {
    if (!deleteArtifactTarget || saving) {
      return;
    }
    setSaving(`artifact:${deleteArtifactTarget.id}`);
    setActionError(null);
    try {
      await AdminSkillService.deleteSkillArtifact(skill.id, deleteArtifactTarget.id);
      setArtifacts((items) => items.filter((item) => item.id !== deleteArtifactTarget.id));
      setDeleteArtifactTarget(null);
    } catch (error) {
      setActionError(errorMessage(error, 'Failed to delete skill artifact.'));
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#171717]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-white/10">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('admin.skill.resources.title')}</h3>
            <p className="mt-1 truncate text-xs text-slate-500">{skill.name} / {skill.skillKey}</p>
          </div>
          <button type="button" onClick={onClose} disabled={Boolean(saving)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-60 dark:hover:bg-white/10 dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[calc(92vh-73px)] overflow-y-auto p-5">
          {loadError ? (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
              <span>{loadError}</span>
              <button type="button" onClick={() => void loadResources()} className="font-semibold">{t('common.actions.retry')}</button>
            </div>
          ) : null}
          {actionError ? <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{actionError}</div> : null}
          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-xl border border-slate-200 bg-slate-50/60 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/10">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('admin.skill.resources.assetsTitle')}</h4>
                  <p className="mt-1 text-xs text-slate-500">{t('admin.skill.resources.records', { count: assets.length })}</p>
                </div>
                <button type="button" onClick={openCreateAsset} disabled={Boolean(saving)} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                  <Plus className="h-4 w-4" />
                  {t('common.actions.asset')}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">{t('admin.skill.resources.asset')}</th>
                      <th className="px-4 py-3 font-semibold">{t('admin.skill.resources.shape')}</th>
                      <th className="px-4 py-3 font-semibold">{t('admin.skill.tables.state')}</th>
                      <th className="px-4 py-3 text-right font-semibold">{t('common.actions.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white dark:divide-white/10 dark:bg-transparent">
                    {loading ? (
                      <BusinessStateTableRow colSpan={4} kind="loading" title={t('admin.skill.loading.assets')} />
                    ) : assets.length === 0 ? (
                      <BusinessStateTableRow colSpan={4} kind="empty" title={t('admin.skill.empty.noAssets')} />
                    ) : (
                      assets.map((asset) => (
                        <tr key={asset.id} className="align-top">
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900 dark:text-white">{asset.title || `Asset #${asset.id}`}</div>
                            <div className="mt-1 max-w-[260px] truncate font-mono text-xs text-slate-500">{readMediaResourceUrl(asset.asset)}</div>
                            <div className="mt-1 text-xs text-slate-500">{t('admin.skill.resources.artifactRef', { value: asset.artifactId || '-' })}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                            <div>{asset.width && asset.height ? `${asset.width} x ${asset.height}` : '-'}</div>
                            <div className="mt-1 text-xs text-slate-500">{formatBytes(asset.fileSize)}</div>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge value={asset.status === 1 ? 'ENABLED' : 'DISABLED'} />
                            <div className="mt-1 text-xs text-slate-500">{t('admin.skill.resources.sortValue', { value: asset.sortOrder })}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <IconButton title={t('admin.skill.actions.editAsset')} onClick={() => openEditAsset(asset)} icon={<Edit2 className="h-4 w-4" />} disabled={Boolean(saving)} />
                              <IconButton title={t('admin.skill.actions.deleteAsset')} onClick={() => setDeleteAssetTarget(asset)} icon={<Trash2 className="h-4 w-4" />} disabled={Boolean(saving)} danger />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-slate-50/60 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/10">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('admin.skill.resources.artifactsTitle')}</h4>
                  <p className="mt-1 text-xs text-slate-500">{t('admin.skill.resources.records', { count: artifacts.length })}</p>
                </div>
                <button type="button" onClick={openCreateArtifact} disabled={Boolean(saving)} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                  <Plus className="h-4 w-4" />
                  {t('common.actions.artifact')}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">{t('admin.skill.resources.artifact')}</th>
                      <th className="px-4 py-3 font-semibold">{t('admin.skill.tables.runtime')}</th>
                      <th className="px-4 py-3 font-semibold">{t('admin.skill.tables.state')}</th>
                      <th className="px-4 py-3 text-right font-semibold">{t('common.actions.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white dark:divide-white/10 dark:bg-transparent">
                    {loading ? (
                      <BusinessStateTableRow colSpan={4} kind="loading" title={t('admin.skill.loading.artifacts')} />
                    ) : artifacts.length === 0 ? (
                      <BusinessStateTableRow colSpan={4} kind="empty" title={t('admin.skill.empty.noArtifacts')} />
                    ) : (
                      artifacts.map((artifact) => (
                        <tr key={artifact.id} className="align-top">
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900 dark:text-white">{artifact.version}</div>
                            <div className="mt-1 max-w-[260px] truncate font-mono text-xs text-slate-500">{artifact.artifactRef || readMediaResourceUrl(artifact.artifact) || '-'}</div>
                            <div className="mt-1 text-xs text-slate-500">{formatBytes(artifact.artifactSizeBytes)}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                            <div>{artifact.runtime || '-'}</div>
                            <div className="mt-1 text-xs text-slate-500">{artifact.frameworks.join(', ') || '-'}</div>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge value={artifact.status === 1 ? 'ENABLED' : 'DISABLED'} />
                            <div className="mt-1 text-xs text-slate-500">{artifact.platformType} / {artifact.osName}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <IconButton title={t('admin.skill.actions.editArtifact')} onClick={() => openEditArtifact(artifact)} icon={<Edit2 className="h-4 w-4" />} disabled={Boolean(saving)} />
                              <IconButton title={t('admin.skill.actions.deleteArtifact')} onClick={() => setDeleteArtifactTarget(artifact)} icon={<Trash2 className="h-4 w-4" />} disabled={Boolean(saving)} danger />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {assetMode ? (
            <form onSubmit={handleSaveAsset} className="mt-5 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {assetMode === 'edit' ? t('admin.skill.resources.editAsset') : t('admin.skill.resources.createAsset')}
                </h4>
                <button type="button" onClick={resetForms} disabled={Boolean(saving)} className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-60 dark:text-slate-300 dark:hover:bg-white/10">{t('common.actions.cancel')}</button>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <SelectField label={t('admin.skill.fields.assetType')} name="assetType" defaultValue={String(editingAsset?.assetType ?? 1)}>
                  <option value="1">{t('admin.skill.assetTypes.image')}</option>
                  <option value="2">{t('admin.skill.assetTypes.video')}</option>
                  <option value="3">{t('admin.skill.assetTypes.document')}</option>
                </SelectField>
                <Field label={t('admin.skill.fields.artifactId')} name="artifactId" defaultValue={editingAsset?.artifactId ?? ''} />
                <Field label={t('admin.skill.fields.sortOrder')} name="sortOrder" type="number" defaultValue={String(editingAsset?.sortOrder ?? 0)} />
                <Field label={t('admin.skill.fields.asset')} name="asset" defaultValue={readMediaResourceUrl(editingAsset?.asset)} required={assetMode === 'create'} />
                <Field label={t('admin.skill.fields.thumbnail')} name="thumbnail" defaultValue={readMediaResourceUrl(editingAsset?.thumbnail)} />
                <Field label={t('admin.skill.fields.title')} name="title" defaultValue={editingAsset?.title ?? ''} />
                <Field label={t('admin.skill.fields.altText')} name="altText" defaultValue={editingAsset?.altText ?? ''} />
                <Field label={t('admin.skill.fields.mimeType')} name="mimeType" defaultValue={editingAsset?.mimeType ?? ''} />
                <Field label={t('admin.skill.fields.status')} name="status" type="number" defaultValue={String(editingAsset?.status ?? 1)} />
                <Field label={t('admin.skill.fields.width')} name="width" type="number" defaultValue={String(editingAsset?.width ?? '')} />
                <Field label={t('admin.skill.fields.height')} name="height" type="number" defaultValue={String(editingAsset?.height ?? '')} />
                <Field label={t('admin.skill.fields.fileSize')} name="fileSize" type="number" defaultValue={String(editingAsset?.fileSize ?? '')} />
                <Field label={t('admin.skill.fields.durationSeconds')} name="durationSeconds" defaultValue={editingAsset?.durationSeconds ?? ''} />
                <Field label={t('admin.skill.fields.publishedAt')} name="publishedAt" defaultValue={editingAsset?.publishedAt ?? ''} />
              </div>
              <div className="mt-4 flex justify-end">
                <button type="submit" disabled={Boolean(saving)} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                  {saving === 'asset' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {t('common.actions.saveAsset')}
                </button>
              </div>
            </form>
          ) : null}

          {artifactMode ? (
            <form onSubmit={handleSaveArtifact} className="mt-5 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {artifactMode === 'edit' ? t('admin.skill.resources.editArtifact') : t('admin.skill.resources.createArtifact')}
                </h4>
                <button type="button" onClick={resetForms} disabled={Boolean(saving)} className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-60 dark:text-slate-300 dark:hover:bg-white/10">{t('common.actions.cancel')}</button>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <SelectField label={t('admin.skill.fields.artifactType')} name="artifactType" defaultValue={String(editingArtifact?.artifactType ?? 1)}>
                  <option value="1">{t('admin.skill.artifactTypes.manifest')}</option>
                  <option value="2">{t('admin.skill.artifactTypes.bundle')}</option>
                  <option value="3">{t('admin.skill.artifactTypes.binary')}</option>
                </SelectField>
                <Field label={t('admin.skill.fields.version')} name="version" defaultValue={editingArtifact?.version ?? '1.0.0'} />
                <Field label={t('admin.skill.fields.runtime')} name="runtime" defaultValue={editingArtifact?.runtime ?? 'agent-skill'} />
                <Field label={t('admin.skill.fields.platformType')} name="platformType" defaultValue={editingArtifact?.platformType ?? 'agent'} />
                <Field label={t('admin.skill.fields.osName')} name="osName" defaultValue={editingArtifact?.osName ?? 'runtime'} />
                <Field label={t('admin.skill.fields.artifactSizeBytes')} name="artifactSizeBytes" type="number" defaultValue={String(editingArtifact?.artifactSizeBytes ?? '')} />
                <Field label={t('admin.skill.fields.artifactRef')} name="artifactRef" defaultValue={editingArtifact?.artifactRef ?? ''} />
                <Field label={t('admin.skill.fields.artifact')} name="artifact" defaultValue={readMediaResourceUrl(editingArtifact?.artifact)} />
                <Field label={t('admin.skill.fields.frameworks')} name="frameworks" defaultValue={editingArtifact?.frameworks.join(', ') ?? ''} />
                <Field label={t('admin.skill.fields.license')} name="licenseName" defaultValue={editingArtifact?.licenseName ?? ''} />
                <Field label={t('admin.skill.fields.checksumHash')} name="checksumHash" defaultValue={editingArtifact?.checksumHash ?? ''} />
                <Field label={t('admin.skill.fields.status')} name="status" type="number" defaultValue={String(editingArtifact?.status ?? 1)} />
                <Field label={t('admin.skill.fields.publishedAt')} name="publishedAt" defaultValue={editingArtifact?.publishedAt ?? ''} />
                <Field label={t('admin.skill.fields.deprecatedAt')} name="deprecatedAt" defaultValue={editingArtifact?.deprecatedAt ?? ''} />
              </div>
              <div className="mt-4">
                <TextArea label={t('admin.skill.fields.releaseNotes')} name="releaseNotes" defaultValue={editingArtifact?.releaseNotes ?? ''} />
              </div>
              <div className="mt-4 flex justify-end">
                <button type="submit" disabled={Boolean(saving)} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                  {saving === 'artifact' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {t('common.actions.saveArtifact')}
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </div>

      {deleteAssetTarget ? (
        <ConfirmDialog
          title={t('admin.skill.confirm.deleteAsset.title')}
          description={t('admin.skill.confirm.deleteAsset.description', { name: deleteAssetTarget.title || readMediaResourceUrl(deleteAssetTarget.asset) })}
          confirmLabel={t('common.actions.delete')}
          tone="danger"
          isBusy={saving === `asset:${deleteAssetTarget.id}`}
          icon={<Trash2 className="h-4 w-4" />}
          onConfirm={() => void executeDeleteAsset()}
          onCancel={() => {
            if (!saving) {
              setDeleteAssetTarget(null);
            }
          }}
        />
      ) : null}

      {deleteArtifactTarget ? (
        <ConfirmDialog
          title={t('admin.skill.confirm.deleteArtifact.title')}
          description={t('admin.skill.confirm.deleteArtifact.description', { version: deleteArtifactTarget.version })}
          confirmLabel={t('common.actions.delete')}
          tone="danger"
          isBusy={saving === `artifact:${deleteArtifactTarget.id}`}
          icon={<Trash2 className="h-4 w-4" />}
          onConfirm={() => void executeDeleteArtifact()}
          onCancel={() => {
            if (!saving) {
              setDeleteArtifactTarget(null);
            }
          }}
        />
      ) : null}
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
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
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
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-[#202020] dark:text-white"
      >
        {children}
      </select>
    </label>
  );
}

function TextArea({ label, name, defaultValue, rows = 8 }: { label: string; name: string; defaultValue: string; rows?: number }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
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
          : 'border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:text-slate-300 dark:hover:border-emerald-500/40 dark:hover:text-emerald-300'
      }`}
    >
      {icon}
    </button>
  );
}

function Badge({ tone, children }: { tone: 'emerald' | 'amber' | 'slate'; children: React.ReactNode }) {
  const className = {
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    slate: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300',
  }[tone];
  return <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${className}`}>{children}</span>;
}

function StatusBadge({ value }: { value: string }) {
  const tone = value === 'PUBLISHED' || value === 'APPROVED' || value === 'ENABLED'
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
    : value === 'REJECTED' || value === 'DISABLED' || value === 'OFFLINE'
      ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'
      : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300';
  return <span className={`inline-flex w-fit rounded-md px-2 py-0.5 text-xs font-semibold ${tone}`}>{value}</span>;
}

function formatJson(value: Record<string, unknown>): string {
  return JSON.stringify(value, null, 2);
}

function formatBytes(value: number | null | undefined): string {
  if (!Number.isFinite(value) || !value || value < 0) {
    return '-';
  }
  if (value < 1024) {
    return `${value} B`;
  }
  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
