import React, { useEffect, useMemo, useState } from 'react';
import {
  Ban,
  CheckCircle2,
  CircleOff,
  Edit2,
  Loader2,
  Package,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import { BusinessStateTableRow, ConfirmDialog } from 'sdkwork-claw-router-commons';
import {
  AdminSkillService,
  createSkillCategoryInputFromForm,
  createSkillArtifactInputFromForm,
  createSkillAssetInputFromForm,
  createSkillPackageInputFromForm,
  createSkillInputFromForm,
  updateSkillArtifactInputFromForm,
  updateSkillAssetInputFromForm,
  updateSkillPackageInputFromForm,
  updateSkillInputFromForm,
  type AdminSkill,
  type AdminSkillArtifact,
  type AdminSkillAsset,
  type AdminSkillCategory,
  type AdminSkillPackage,
} from './skillService';

type SkillModalMode = 'create' | 'edit';
type PackageModalMode = 'create' | 'edit';
type AssetModalMode = 'create' | 'edit';
type ArtifactModalMode = 'create' | 'edit';
type DeleteTarget = AdminSkill | null;
type PackageDeleteTarget = AdminSkillPackage | null;
type ReviewTarget = { skill: AdminSkill; action: 'approve' | 'reject' } | null;
type ResourceTarget = AdminSkill | null;

const marketStatusOptions = [
  { value: '', label: 'All statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'OFFLINE', label: 'Offline' },
  { value: 'DEPRECATED', label: 'Deprecated' },
];

const reviewStatusOptions = [
  { value: '', label: 'All review' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

export function SkillAdmin() {
  const [categories, setCategories] = useState<AdminSkillCategory[]>([]);
  const [packages, setPackages] = useState<AdminSkillPackage[]>([]);
  const [skills, setSkills] = useState<AdminSkill[]>([]);
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [marketStatus, setMarketStatus] = useState('');
  const [reviewStatus, setReviewStatus] = useState('');
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
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [deletePackageTarget, setDeletePackageTarget] = useState<PackageDeleteTarget>(null);
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget>(null);
  const [resourceTarget, setResourceTarget] = useState<ResourceTarget>(null);

  const loadAll = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [nextCategories, nextPackages, nextSkills] = await Promise.all([
        AdminSkillService.fetchSkillCategories(),
        AdminSkillService.fetchSkillPackages({ page: 1, pageSize: 100 }),
        AdminSkillService.fetchSkills({ page: 1, pageSize: 100 }),
      ]);
      setCategories(nextCategories);
      setPackages(nextPackages);
      setSkills(nextSkills);
    } catch (error) {
      setLoadError(errorMessage(error, 'Failed to load agent skills.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  const categoryNameById = useMemo(() => new Map(categories.map((item) => [item.id, item.name])), [categories]);
  const packageNameById = useMemo(() => new Map(packages.map((item) => [item.id, item.name])), [packages]);

  const filteredPackages = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return packages.filter((item) => {
      if (categoryId && item.categoryId !== categoryId) {
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
  }, [categoryId, keyword, packages]);

  const filteredSkills = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return skills.filter((skill) => {
      if (categoryId && skill.categoryId !== categoryId) {
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
  }, [categoryId, keyword, marketStatus, reviewStatus, skills]);

  const summary = useMemo(() => {
    return {
      total: skills.length,
      packages: packages.length,
      published: skills.filter((item) => item.marketStatus === 'PUBLISHED').length,
      pending: skills.filter((item) => item.reviewStatus === 'PENDING').length,
      enabled: skills.filter((item) => item.enabled).length,
    };
  }, [packages.length, skills]);

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

  const handleCreateCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) {
      return;
    }
    setSaving(true);
    setActionError(null);
    try {
      const created = await AdminSkillService.createSkillCategory(createSkillCategoryInputFromForm(new FormData(event.currentTarget)));
      setCategories((items) => [...items, created].sort((left, right) => left.sortWeight - right.sortWeight));
      setCategoryModalOpen(false);
    } catch (error) {
      setActionError(errorMessage(error, 'Failed to create category.'));
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

  return (
    <div className="flex h-full w-full flex-col space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
            <Store className="h-6 w-6 text-emerald-500" />
            Agent Skills
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage marketplace skills, review workflow, categories, and runtime availability.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setCategoryModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-emerald-500/40 dark:hover:text-emerald-300"
          >
            <Plus className="h-4 w-4" />
            Category
          </button>
          <button
            type="button"
            onClick={openCreatePackage}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-emerald-500/40 dark:hover:text-emerald-300"
          >
            <Plus className="h-4 w-4" />
            Package
          </button>
          <button
            type="button"
            onClick={openCreateSkill}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <Plus className="h-4 w-4" />
            Skill
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Metric label="Total" value={summary.total} />
        <Metric label="Packages" value={summary.packages} />
        <Metric label="Published" value={summary.published} />
        <Metric label="Pending Review" value={summary.pending} />
        <Metric label="Enabled" value={summary.enabled} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#171717]">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-white/10">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Package className="h-4 w-4 text-emerald-500" />
              Skill Packages
            </h3>
            <p className="mt-1 text-xs text-slate-500">Curated bundles for grouping marketplace skills.</p>
          </div>
          <button
            type="button"
            onClick={openCreatePackage}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <Plus className="h-4 w-4" />
            Package
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/[0.03] dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Package</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">State</th>
                <th className="px-4 py-3 font-semibold">Tags</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {loading ? (
                <BusinessStateTableRow colSpan={5} kind="loading" title="Loading packages" />
              ) : loadError ? (
                <BusinessStateTableRow colSpan={5} kind="error" title={loadError} onRetry={() => void loadAll()} />
              ) : filteredPackages.length === 0 ? (
                <BusinessStateTableRow colSpan={5} kind="empty" title="No packages found" />
              ) : (
                filteredPackages.map((item) => (
                  <tr key={item.id} className="align-top transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.03]">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                      <div className="mt-1 font-mono text-xs text-slate-500">{item.packageKey}</div>
                      <div className="mt-2 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">{item.summary || item.description || 'No summary'}</div>
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
                        <IconButton title="Edit" onClick={() => openEditPackage(item)} icon={<Edit2 className="h-4 w-4" />} />
                        <IconButton
                          title={item.enabled ? 'Disable' : 'Enable'}
                          onClick={() => void runPackageAction(item, item.enabled ? 'disable' : 'enable')}
                          icon={item.enabled ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          disabled={pendingActionId === `package:${item.id}`}
                        />
                        <IconButton
                          title="Delete"
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
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#171717]">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-white/10 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
              placeholder="Search skills, providers, tags"
            />
          </div>
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-[#202020] dark:text-slate-200"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <select
            value={marketStatus}
            onChange={(event) => setMarketStatus(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-[#202020] dark:text-slate-200"
          >
            {marketStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <select
            value={reviewStatus}
            onChange={(event) => setReviewStatus(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-[#202020] dark:text-slate-200"
          >
            {reviewStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
        {actionError ? (
          <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {actionError}
          </div>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/[0.03] dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Skill</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Lifecycle</th>
                <th className="px-4 py-3 font-semibold">Usage</th>
                <th className="px-4 py-3 font-semibold">Runtime</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {loading ? (
                <BusinessStateTableRow colSpan={6} kind="loading" title="Loading skills" />
              ) : loadError ? (
                <BusinessStateTableRow colSpan={6} kind="error" title={loadError} onRetry={() => void loadAll()} />
              ) : filteredSkills.length === 0 ? (
                <BusinessStateTableRow colSpan={6} kind="empty" title="No skills found" />
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
                            {skill.featured ? <Badge tone="amber">Featured</Badge> : null}
                            {skill.builtin || skill.isBuiltin ? <Badge tone="slate">Builtin</Badge> : null}
                          </div>
                          <div className="mt-1 font-mono text-xs text-slate-500">{skill.skillKey}</div>
                          <div className="mt-2 max-w-lg text-xs leading-5 text-slate-500 dark:text-slate-400">{skill.summary || skill.description || 'No summary'}</div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {skill.tags.slice(0, 4).map((tag) => <Badge key={tag} tone="emerald">{tag}</Badge>)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      <div>{skill.categoryId ? categoryNameById.get(skill.categoryId) ?? `#${skill.categoryId}` : '-'}</div>
                      <div className="mt-1 text-xs text-slate-500">{skill.packageId ? packageNameById.get(skill.packageId) ?? `#${skill.packageId}` : 'No package'}</div>
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
                      <div>{skill.installCount} installs</div>
                      <div className="mt-1 text-xs text-slate-500">{skill.ratingAvg} rating / {skill.ratingCount} reviews</div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      <div>{skill.runtime || '-'}</div>
                      <div className="mt-1 text-xs text-slate-500">{skill.entrypoint || '-'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <IconButton title="Edit" onClick={() => openEditSkill(skill)} icon={<Edit2 className="h-4 w-4" />} />
                        <IconButton title="Manage assets and artifacts" onClick={() => openResourceManager(skill)} icon={<Package className="h-4 w-4" />} />
                        <IconButton
                          title={skill.reviewStatus === 'APPROVED' ? 'Reject' : 'Approve'}
                          onClick={() => setReviewTarget({ skill, action: skill.reviewStatus === 'APPROVED' ? 'reject' : 'approve' })}
                          icon={skill.reviewStatus === 'APPROVED' ? <XCircle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                          disabled={pendingActionId === skill.id}
                        />
                        <IconButton
                          title={skill.marketStatus === 'PUBLISHED' ? 'Offline' : 'Publish'}
                          onClick={() => void runSkillAction(skill, skill.marketStatus === 'PUBLISHED' ? 'offline' : 'publish')}
                          icon={skill.marketStatus === 'PUBLISHED' ? <CircleOff className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          disabled={pendingActionId === skill.id}
                        />
                        <IconButton
                          title={skill.enabled ? 'Disable' : 'Enable'}
                          onClick={() => void runSkillAction(skill, skill.enabled ? 'disable' : 'enable')}
                          icon={skill.enabled ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          disabled={pendingActionId === skill.id}
                        />
                        <IconButton
                          title="Delete"
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
        </div>
      </div>

      {skillModalOpen ? (
        <SkillModal
          mode={skillModalMode}
          skill={editingSkill}
          categories={categories}
          packages={packages}
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

      {categoryModalOpen ? (
        <CategoryModal
          isSaving={saving}
          error={actionError}
          onClose={() => {
            if (!saving) {
              setCategoryModalOpen(false);
            }
          }}
          onSubmit={handleCreateCategory}
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
          title="Delete package"
          description={`Delete ${deletePackageTarget.name}. Skills linked to this package will stay available and lose only the package link.`}
          confirmLabel="Delete"
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
          title="Delete skill"
          description={`Delete ${deleteTarget.name}. Installed user bindings will be removed by the backend command.`}
          confirmLabel="Delete"
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

      {reviewTarget ? (
        <ConfirmDialog
          title={reviewTarget.action === 'approve' ? 'Approve skill' : 'Reject skill'}
          description={`${reviewTarget.action === 'approve' ? 'Approve' : 'Reject'} ${reviewTarget.skill.name} for marketplace review.`}
          confirmLabel={reviewTarget.action === 'approve' ? 'Approve' : 'Reject'}
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
  isSaving,
  error,
  onClose,
  onSubmit,
}: {
  mode: SkillModalMode;
  skill: AdminSkill | null;
  categories: AdminSkillCategory[];
  packages: AdminSkillPackage[];
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const isEdit = mode === 'edit';
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#171717]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{isEdit ? 'Edit Skill' : 'Create Skill'}</h3>
            <p className="mt-1 text-xs text-slate-500">Define marketplace metadata, runtime entrypoint, and default configuration.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="max-h-[calc(90vh-73px)] overflow-y-auto p-5">
          {error ? <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</div> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Skill Key" name="skillKey" defaultValue={skill?.skillKey} required={!isEdit} />
            <Field label="Name" name="name" defaultValue={skill?.name} required />
            <Field label="Summary" name="summary" defaultValue={skill?.summary} />
            <Field label="Provider" name="provider" defaultValue={skill?.provider || 'sdkwork'} />
            <SelectField label="Category" name="categoryId" defaultValue={skill?.categoryId ?? ''}>
              <option value="">No category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </SelectField>
            <SelectField label="Package" name="packageId" defaultValue={skill?.packageId ?? ''}>
              <option value="">No package</option>
              {packages.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </SelectField>
            <Field label="Version" name="version" defaultValue={skill?.version || '1.0.0'} />
            <Field label="Runtime" name="runtime" defaultValue={skill?.runtime || 'agent-skill'} />
            <Field label="Entrypoint" name="entrypoint" defaultValue={skill?.entrypoint || 'skill.json'} />
            <Field label="Icon" name="icon" defaultValue={skill?.icon} />
            <Field label="Cover Image" name="coverImage" defaultValue={skill?.coverImage} />
            <Field label="Manifest URL" name="manifestUrl" defaultValue={skill?.manifestUrl} />
            <Field label="Documentation URL" name="documentationUrl" defaultValue={skill?.documentationUrl} />
            <Field label="License" name="licenseName" defaultValue={skill?.licenseName || 'MIT'} />
            <Field label="Recommend Weight" name="recommendWeight" type="number" defaultValue={String(skill?.recommendWeight ?? 0)} />
            <Field label="Tags" name="tags" defaultValue={skill?.tags.join(', ')} />
            <Field label="Capabilities" name="capabilities" defaultValue={skill?.capabilities.join(', ')} />
            {!isEdit ? (
              <>
                <input type="hidden" name="sourceType" value="COMMUNITY" />
                <input type="hidden" name="marketStatus" value="DRAFT" />
                <input type="hidden" name="reviewStatus" value="PENDING" />
              </>
            ) : null}
            <SelectField label="Visibility" name="visibility" defaultValue={skill?.visibility ?? 'PUBLIC'}>
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
              <option value="UNLISTED">Unlisted</option>
            </SelectField>
            <SelectField label="Featured" name="featured" defaultValue={String(skill?.featured ?? false)}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </SelectField>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextArea label="Config Schema" name="configSchema" defaultValue={formatJson(skill?.configSchema ?? { type: 'object' })} />
            <TextArea label="Default Config" name="defaultConfig" defaultValue={formatJson(skill?.defaultConfig ?? {})} />
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save
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
  isSaving,
  error,
  onClose,
  onSubmit,
}: {
  mode: PackageModalMode;
  skillPackage: AdminSkillPackage | null;
  categories: AdminSkillCategory[];
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const isEdit = mode === 'edit';
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-[#171717]">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{isEdit ? 'Edit Package' : 'Create Package'}</h3>
            <p className="mt-1 text-xs text-slate-500">Packages group related agent skills for marketplace operations.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        {error ? <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</div> : null}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Package Key" name="packageKey" defaultValue={skillPackage?.packageKey} required={!isEdit} />
            <Field label="Name" name="name" defaultValue={skillPackage?.name} required />
            <Field label="Summary" name="summary" defaultValue={skillPackage?.summary} />
            <SelectField label="Category" name="categoryId" defaultValue={skillPackage?.categoryId ?? ''}>
              <option value="">No category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </SelectField>
            <Field label="Icon" name="icon" defaultValue={skillPackage?.icon} />
            <Field label="Cover Image" name="coverImage" defaultValue={skillPackage?.coverImage} />
            <Field label="Sort Weight" name="sortWeight" type="number" defaultValue={String(skillPackage?.sortWeight ?? 0)} />
            <Field label="Tags" name="tags" defaultValue={skillPackage?.tags.join(', ')} />
            <SelectField label="Enabled" name="enabled" defaultValue={String(skillPackage?.enabled ?? true)}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </SelectField>
            <SelectField label="Featured" name="featured" defaultValue={String(skillPackage?.featured ?? false)}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </SelectField>
          </div>
          <TextArea label="Description" name="description" defaultValue={skillPackage?.description ?? ''} />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CategoryModal({
  isSaving,
  error,
  onClose,
  onSubmit,
}: {
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-[#171717]">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Category</h3>
            <p className="mt-1 text-xs text-slate-500">Categories use type 19 for skills and type 20 for skill collections.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        {error ? <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</div> : null}
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Name" name="name" required />
          <Field label="Code" name="code" />
          <Field label="Description" name="description" />
          <Field label="Sort Weight" name="sortWeight" type="number" defaultValue="0" />
          <input type="hidden" name="visible" value="true" />
          <input type="hidden" name="status" value="1" />
          <input type="hidden" name="type" value="19" />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SkillResourcesModal({ skill, onClose }: { skill: AdminSkill; onClose: () => void }) {
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
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Manage assets and artifacts</h3>
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
              <button type="button" onClick={() => void loadResources()} className="font-semibold">Retry</button>
            </div>
          ) : null}
          {actionError ? <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{actionError}</div> : null}
          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-xl border border-slate-200 bg-slate-50/60 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/10">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Assets</h4>
                  <p className="mt-1 text-xs text-slate-500">{assets.length.toLocaleString()} records</p>
                </div>
                <button type="button" onClick={openCreateAsset} disabled={Boolean(saving)} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                  <Plus className="h-4 w-4" />
                  Asset
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Asset</th>
                      <th className="px-4 py-3 font-semibold">Shape</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white dark:divide-white/10 dark:bg-transparent">
                    {loading ? (
                      <BusinessStateTableRow colSpan={4} kind="loading" title="Loading assets" />
                    ) : assets.length === 0 ? (
                      <BusinessStateTableRow colSpan={4} kind="empty" title="No assets" />
                    ) : (
                      assets.map((asset) => (
                        <tr key={asset.id} className="align-top">
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900 dark:text-white">{asset.title || `Asset #${asset.id}`}</div>
                            <div className="mt-1 max-w-[260px] truncate font-mono text-xs text-slate-500">{asset.assetUrl}</div>
                            <div className="mt-1 text-xs text-slate-500">artifact {asset.artifactId || '-'}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                            <div>{asset.width && asset.height ? `${asset.width} x ${asset.height}` : '-'}</div>
                            <div className="mt-1 text-xs text-slate-500">{formatBytes(asset.fileSize)}</div>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge value={asset.status === 1 ? 'ENABLED' : 'DISABLED'} />
                            <div className="mt-1 text-xs text-slate-500">sort {asset.sortOrder}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <IconButton title="Edit asset" onClick={() => openEditAsset(asset)} icon={<Edit2 className="h-4 w-4" />} disabled={Boolean(saving)} />
                              <IconButton title="Delete asset" onClick={() => setDeleteAssetTarget(asset)} icon={<Trash2 className="h-4 w-4" />} disabled={Boolean(saving)} danger />
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
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Artifacts</h4>
                  <p className="mt-1 text-xs text-slate-500">{artifacts.length.toLocaleString()} records</p>
                </div>
                <button type="button" onClick={openCreateArtifact} disabled={Boolean(saving)} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                  <Plus className="h-4 w-4" />
                  Artifact
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Artifact</th>
                      <th className="px-4 py-3 font-semibold">Runtime</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white dark:divide-white/10 dark:bg-transparent">
                    {loading ? (
                      <BusinessStateTableRow colSpan={4} kind="loading" title="Loading artifacts" />
                    ) : artifacts.length === 0 ? (
                      <BusinessStateTableRow colSpan={4} kind="empty" title="No artifacts" />
                    ) : (
                      artifacts.map((artifact) => (
                        <tr key={artifact.id} className="align-top">
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900 dark:text-white">{artifact.version}</div>
                            <div className="mt-1 max-w-[260px] truncate font-mono text-xs text-slate-500">{artifact.artifactRef || artifact.artifactUrl || '-'}</div>
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
                              <IconButton title="Edit artifact" onClick={() => openEditArtifact(artifact)} icon={<Edit2 className="h-4 w-4" />} disabled={Boolean(saving)} />
                              <IconButton title="Delete artifact" onClick={() => setDeleteArtifactTarget(artifact)} icon={<Trash2 className="h-4 w-4" />} disabled={Boolean(saving)} danger />
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
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{assetMode === 'edit' ? 'Edit asset' : 'Create asset'}</h4>
                <button type="button" onClick={resetForms} disabled={Boolean(saving)} className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-60 dark:text-slate-300 dark:hover:bg-white/10">Cancel</button>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <SelectField label="Asset Type" name="assetType" defaultValue={String(editingAsset?.assetType ?? 1)}>
                  <option value="1">Image</option>
                  <option value="2">Video</option>
                  <option value="3">Document</option>
                </SelectField>
                <Field label="Artifact ID" name="artifactId" defaultValue={editingAsset?.artifactId ?? ''} />
                <Field label="Sort Order" name="sortOrder" type="number" defaultValue={String(editingAsset?.sortOrder ?? 0)} />
                <Field label="Asset URL" name="assetUrl" defaultValue={editingAsset?.assetUrl ?? ''} required={assetMode === 'create'} />
                <Field label="Thumbnail URL" name="thumbnailUrl" defaultValue={editingAsset?.thumbnailUrl ?? ''} />
                <Field label="Title" name="title" defaultValue={editingAsset?.title ?? ''} />
                <Field label="Alt Text" name="altText" defaultValue={editingAsset?.altText ?? ''} />
                <Field label="MIME Type" name="mimeType" defaultValue={editingAsset?.mimeType ?? ''} />
                <Field label="Status" name="status" type="number" defaultValue={String(editingAsset?.status ?? 1)} />
                <Field label="Width" name="width" type="number" defaultValue={String(editingAsset?.width ?? '')} />
                <Field label="Height" name="height" type="number" defaultValue={String(editingAsset?.height ?? '')} />
                <Field label="File Size" name="fileSize" type="number" defaultValue={String(editingAsset?.fileSize ?? '')} />
                <Field label="Duration Seconds" name="durationSeconds" defaultValue={editingAsset?.durationSeconds ?? ''} />
                <Field label="Published At" name="publishedAt" defaultValue={editingAsset?.publishedAt ?? ''} />
              </div>
              <div className="mt-4 flex justify-end">
                <button type="submit" disabled={Boolean(saving)} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                  {saving === 'asset' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save asset
                </button>
              </div>
            </form>
          ) : null}

          {artifactMode ? (
            <form onSubmit={handleSaveArtifact} className="mt-5 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{artifactMode === 'edit' ? 'Edit artifact' : 'Create artifact'}</h4>
                <button type="button" onClick={resetForms} disabled={Boolean(saving)} className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-60 dark:text-slate-300 dark:hover:bg-white/10">Cancel</button>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <SelectField label="Artifact Type" name="artifactType" defaultValue={String(editingArtifact?.artifactType ?? 1)}>
                  <option value="1">Manifest</option>
                  <option value="2">Bundle</option>
                  <option value="3">Binary</option>
                </SelectField>
                <Field label="Version" name="version" defaultValue={editingArtifact?.version ?? '1.0.0'} />
                <Field label="Runtime" name="runtime" defaultValue={editingArtifact?.runtime ?? 'agent-skill'} />
                <Field label="Platform Type" name="platformType" defaultValue={editingArtifact?.platformType ?? 'agent'} />
                <Field label="OS Name" name="osName" defaultValue={editingArtifact?.osName ?? 'runtime'} />
                <Field label="Artifact Size Bytes" name="artifactSizeBytes" type="number" defaultValue={String(editingArtifact?.artifactSizeBytes ?? '')} />
                <Field label="Artifact Ref" name="artifactRef" defaultValue={editingArtifact?.artifactRef ?? ''} />
                <Field label="Artifact URL" name="artifactUrl" defaultValue={editingArtifact?.artifactUrl ?? ''} />
                <Field label="Frameworks" name="frameworks" defaultValue={editingArtifact?.frameworks.join(', ') ?? ''} />
                <Field label="License" name="licenseName" defaultValue={editingArtifact?.licenseName ?? ''} />
                <Field label="Checksum Hash" name="checksumHash" defaultValue={editingArtifact?.checksumHash ?? ''} />
                <Field label="Status" name="status" type="number" defaultValue={String(editingArtifact?.status ?? 1)} />
                <Field label="Published At" name="publishedAt" defaultValue={editingArtifact?.publishedAt ?? ''} />
                <Field label="Deprecated At" name="deprecatedAt" defaultValue={editingArtifact?.deprecatedAt ?? ''} />
              </div>
              <div className="mt-4">
                <TextArea label="Release Notes" name="releaseNotes" defaultValue={editingArtifact?.releaseNotes ?? ''} />
              </div>
              <div className="mt-4 flex justify-end">
                <button type="submit" disabled={Boolean(saving)} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                  {saving === 'artifact' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save artifact
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </div>

      {deleteAssetTarget ? (
        <ConfirmDialog
          title="Delete asset"
          description={`Delete ${deleteAssetTarget.title || deleteAssetTarget.assetUrl}.`}
          confirmLabel="Delete"
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
          title="Delete artifact"
          description={`Delete artifact ${deleteArtifactTarget.version}.`}
          confirmLabel="Delete"
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

function TextArea({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={8}
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
