import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Loader2,
  X,
  ChevronRight,
  RefreshCw,
  Pencil,
  Trash2,
} from 'lucide-react';
import {
  BusinessStatePanel,
} from 'sdkwork-claw-router-commons';
import {
  createMembershipAdminRechargePackage,
  deleteMembershipAdminRechargePackage,
  createMembershipAdminPlan,
  fetchMembershipAdminEntitlements,
  fetchMembershipAdminMembers,
  fetchMembershipAdminPackageCatalog,
  fetchMembershipAdminPlans,
  fetchMembershipAdminRechargePackages,
  updateMembershipAdminRechargePackage,
  type MembershipsAdminPackageGroup,
  type MembershipsAdminPackageItem,
  type MembershipsAdminPlanItem,
  type MembershipsAdminRechargePackageItem,
  type MembershipsAdminRechargePackageMutationInput,
  type MembershipsAdminRecord,
} from './membershipsService';

type PackageGroup = MembershipsAdminPackageGroup;
type PackageItem = MembershipsAdminPackageItem;
type PlanItem = MembershipsAdminPlanItem;
type RechargePackageItem = MembershipsAdminRechargePackageItem;
type AdminRecord = MembershipsAdminRecord;

type AdminTab = 'packages' | 'plans' | 'members' | 'entitlements' | 'rechargePackages';

type MembershipsAdminProps = {
  sectionId?: string;
};

function resolveMembershipSectionId(sectionId?: string): AdminTab {
  if (
    sectionId === 'packages'
    || sectionId === 'plans'
    || sectionId === 'members'
    || sectionId === 'entitlements'
    || sectionId === 'rechargePackages'
  ) {
    return sectionId;
  }
  return 'packages';
}

export function MembershipsAdmin({ sectionId }: MembershipsAdminProps = {}) {
  const { t } = useTranslation();
  const activeTab = resolveMembershipSectionId(sectionId);
  const isPackageTab = activeTab === 'packages';
  const [groups, setGroups] = useState<PackageGroup[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isPackagesLoading, setIsPackagesLoading] = useState(isPackageTab);
  const [packageLoadError, setPackageLoadError] = useState<string | null>(null);
  const [isAddPackageModalOpen, setIsAddPackageModalOpen] = useState(false);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [newPackageName, setNewPackageName] = useState('');
  const [newPackagePlanId, setNewPackagePlanId] = useState('');
  const [newPackagePrice, setNewPackagePrice] = useState('');
  const [newPackageCurrency, setNewPackageCurrency] = useState('CNY');
  const [newPackageDuration, setNewPackageDuration] = useState('30');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  const loadPackageCatalog = useCallback(async () => {
    setIsPackagesLoading(true);
    setPackageLoadError(null);
    try {
      const catalog = await fetchMembershipAdminPackageCatalog();
      setPackages(catalog.packages);
      setGroups(catalog.groups);
      setSelectedGroupId((currentGroupId) => currentGroupId ?? catalog.groups[0]?.id ?? null);
      setPlans(catalog.plans);
    } catch (error) {
      setPackageLoadError(error instanceof Error ? error.message : t('admin.commerce.memberships.error', 'Membership data could not be loaded'));
    } finally {
      setIsPackagesLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!isPackageTab) {
      return;
    }
    void loadPackageCatalog();
  }, [isPackageTab, loadPackageCatalog]);

  const filteredPackages = useMemo(
    () => packages.filter((pkg) => pkg.groupId === selectedGroupId),
    [packages, selectedGroupId],
  );

  const selectedGroup = useMemo(
    () => groups.find((g) => g.id === selectedGroupId) ?? null,
    [groups, selectedGroupId],
  );

  if (isPackageTab && isPackagesLoading) {
    return (
      <BusinessStatePanel
        kind="loading"
        title={t('admin.commerce.memberships.loading', 'Loading membership records...')}
        className="min-h-96"
      />
    );
  }

  if (isPackageTab && packageLoadError) {
    return (
      <BusinessStatePanel
        kind="error"
        title={t('admin.commerce.memberships.error', 'Membership data could not be loaded')}
        description={packageLoadError}
        onRetry={loadPackageCatalog}
        className="min-h-96"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('admin.commerce.memberships.title', 'Memberships')}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t('admin.commerce.memberships.desc', 'Membership plans, purchasable packages, recharge packages, members, and entitlement grants.')}
          </p>
        </div>
      </div>

      {isPackageTab ? (
        <div className="flex gap-6 min-h-[600px]">
          {/* Left: Group List */}
          <div className="w-72 shrink-0 rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t('admin.commerce.memberships.groups.title', 'Package Groups')}
              </h3>
              <button
                onClick={() => { setNewGroupName(''); setNewGroupDescription(''); setIsAddGroupModalOpen(true); }}
                className="flex items-center gap-1 rounded-md bg-lobster-50 px-2 py-1 text-xs font-medium text-lobster-600 hover:bg-lobster-100 dark:bg-lobster-500/10 dark:text-lobster-400 dark:hover:bg-lobster-500/20"
                type="button"
              >
                <Plus className="h-3.5 w-3.5" />
                {t('admin.commerce.memberships.groups.add', 'Add')}
              </button>
            </div>
            <div className="max-h-[540px] overflow-y-auto p-2">
              {groups.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-slate-400">
                  {t('admin.commerce.memberships.groups.empty', 'No package groups')}
                </p>
              ) : (
                groups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroupId(group.id)}
                    className={`group flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                      selectedGroupId === group.id
                        ? 'bg-lobster-50 dark:bg-lobster-500/10'
                        : 'hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm font-medium ${
                        selectedGroupId === group.id
                          ? 'text-lobster-600 dark:text-lobster-400'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {group.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {group.packageCount} {t('admin.commerce.memberships.groups.packages', 'packages')}
                      </p>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-colors ${
                      selectedGroupId === group.id ? 'text-lobster-500' : 'text-slate-300'
                    }`} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Package List */}
          <div className="flex-1 rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {selectedGroup?.name ?? t('admin.commerce.memberships.packages.title', 'Packages')}
                </h3>
                {selectedGroup?.description && (
                  <p className="mt-0.5 text-xs text-slate-400">{selectedGroup.description}</p>
                )}
              </div>
              {selectedGroupId && (
                <button
                  onClick={() => {
                    setNewPackageName('');
                    setNewPackagePlanId('');
                    setNewPackagePrice('');
                    setNewPackageCurrency('CNY');
                    setNewPackageDuration('30');
                    setIsAddPackageModalOpen(true);
                  }}
                  className="flex items-center gap-1 rounded-md bg-lobster-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-lobster-700"
                  type="button"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t('admin.commerce.memberships.packages.add', 'Add Package')}
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              {filteredPackages.length === 0 ? (
                <p className="px-4 py-12 text-center text-sm text-slate-400">
                  {selectedGroupId
                    ? t('admin.commerce.memberships.packages.emptyGroup', 'No packages in this group')
                    : t('admin.commerce.memberships.packages.empty', 'Select a group to view packages')
                  }
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/5">
                      <th className="px-4 py-2.5 text-left font-medium text-slate-500 dark:text-slate-400">{t('admin.col.package', 'Package')}</th>
                      <th className="px-4 py-2.5 text-left font-medium text-slate-500 dark:text-slate-400">{t('admin.col.plan', 'Plan')}</th>
                      <th className="px-4 py-2.5 text-right font-medium text-slate-500 dark:text-slate-400">{t('admin.col.price', 'Price')}</th>
                      <th className="px-4 py-2.5 text-left font-medium text-slate-500 dark:text-slate-400">{t('admin.col.currency', 'Currency')}</th>
                      <th className="px-4 py-2.5 text-left font-medium text-slate-500 dark:text-slate-400">{t('admin.col.type', 'Type')}</th>
                      <th className="px-4 py-2.5 text-left font-medium text-slate-500 dark:text-slate-400">{t('admin.col.status', 'Status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPackages.map((pkg) => (
                      <tr key={pkg.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-white">{pkg.packageNo}</td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{pkg.planId}</td>
                        <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-300">{pkg.priceAmount}</td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{pkg.currencyCode}</td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{pkg.recurrenceCycle || `${pkg.durationDays}d`}</td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            pkg.status === 'active'
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                              : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                          }`}>
                            {pkg.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      ) : activeTab === 'plans' ? (
        <PlansTab />
      ) : activeTab === 'members' ? (
        <MembersTab />
      ) : activeTab === 'rechargePackages' ? (
        <RechargePackagesTab />
      ) : (
        <EntitlementsTab />
      )}

      {/* Add Package Modal */}
      {isAddPackageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsAddPackageModalOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('admin.commerce.memberships.packages.addTitle', 'Add Package')}
              </h3>
              <button onClick={() => setIsAddPackageModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white" type="button">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('admin.commerce.memberships.packages.form.name', 'Package Name')}
                </label>
                <input
                  value={newPackageName}
                  onChange={(e) => setNewPackageName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5 dark:text-white"
                  placeholder={t('admin.commerce.memberships.packages.form.namePlaceholder', 'Enter package name')}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('admin.commerce.memberships.packages.form.plan', 'Membership Plan')}
                </label>
                <select
                  value={newPackagePlanId}
                  onChange={(e) => setNewPackagePlanId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5 dark:text-white"
                >
                  <option value="">{t('admin.commerce.memberships.packages.form.selectPlan', 'Select plan')}</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>{plan.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t('admin.commerce.memberships.packages.form.price', 'Price')}
                  </label>
                  <input
                    value={newPackagePrice}
                    onChange={(e) => setNewPackagePrice(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t('admin.commerce.memberships.packages.form.currency', 'Currency')}
                  </label>
                  <select
                    value={newPackageCurrency}
                    onChange={(e) => setNewPackageCurrency(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5 dark:text-white"
                  >
                    <option value="CNY">CNY</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('admin.commerce.memberships.packages.form.duration', 'Duration (days)')}
                </label>
                <input
                  value={newPackageDuration}
                  onChange={(e) => setNewPackageDuration(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5 dark:text-white"
                  placeholder="30"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsAddPackageModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/20 dark:text-slate-300 dark:hover:bg-white/5"
                type="button"
              >
                {t('admin.action.cancel', 'Cancel')}
              </button>
              <button
                onClick={() => setIsAddPackageModalOpen(false)}
                className="rounded-lg bg-lobster-600 px-4 py-2 text-sm font-medium text-white hover:bg-lobster-700"
                type="button"
              >
                {t('admin.commerce.memberships.packages.form.submit', 'Create Package')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Group Modal */}
      {isAddGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsAddGroupModalOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('admin.commerce.memberships.groups.addTitle', 'Add Package Group')}
              </h3>
              <button onClick={() => setIsAddGroupModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white" type="button">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('admin.commerce.memberships.groups.form.name', 'Group Name')}
                </label>
                <input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5 dark:text-white"
                  placeholder={t('admin.commerce.memberships.groups.form.namePlaceholder', 'e.g. Annual, Monthly')}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('admin.commerce.memberships.groups.form.description', 'Description')}
                </label>
                <textarea
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5 dark:text-white"
                  rows={3}
                  placeholder={t('admin.commerce.memberships.groups.form.descriptionPlaceholder', 'Group description')}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsAddGroupModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/20 dark:text-slate-300 dark:hover:bg-white/5"
                type="button"
              >
                {t('admin.action.cancel', 'Cancel')}
              </button>
              <button
                onClick={() => setIsAddGroupModalOpen(false)}
                className="rounded-lg bg-lobster-600 px-4 py-2 text-sm font-medium text-white hover:bg-lobster-700"
                type="button"
              >
                {t('admin.commerce.memberships.groups.form.submit', 'Create Group')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RechargePackagesTab() {
  const { t } = useTranslation();
  const [rechargePackages, setRechargePackages] = useState<RechargePackageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<RechargePackageItem | null>(null);
  const [formRmb, setFormRmb] = useState('');
  const [formBonus, setFormBonus] = useState('0');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deletingPackageId, setDeletingPackageId] = useState<string | null>(null);

  const loadRechargePackages = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      setRechargePackages(await fetchMembershipAdminRechargePackages());
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : t('admin.commerce.memberships.rechargePackages.error', 'Recharge packages could not be loaded'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadRechargePackages();
  }, [loadRechargePackages]);

  const openCreateForm = () => {
    setEditingPackage(null);
    setFormRmb('');
    setFormBonus('0');
    setFormStatus('active');
    setSaveError(null);
    setIsFormOpen(true);
  };

  const openEditForm = (pkg: RechargePackageItem) => {
    setEditingPackage(pkg);
    setFormRmb(pkg.priceAmount);
    setFormBonus(pkg.bonusAmount);
    setFormStatus(pkg.status === 'inactive' ? 'inactive' : 'active');
    setSaveError(null);
    setIsFormOpen(true);
  };

  const readRechargePackageForm = (): MembershipsAdminRechargePackageMutationInput => {
    const parsedBonus = Number.parseInt(formBonus.trim(), 10);
    if (!Number.isInteger(parsedBonus) || parsedBonus < 0) {
      throw new Error(t('admin.commerce.memberships.rechargePackages.form.error', 'Recharge package could not be saved'));
    }
    return {
      rmb: formRmb,
      bonus: parsedBonus,
      status: formStatus,
    };
  };

  const handleSaveRechargePackage = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const input = readRechargePackageForm();
      const savedPackage = editingPackage
        ? await updateMembershipAdminRechargePackage(editingPackage.id, input)
        : await createMembershipAdminRechargePackage(input);
      setRechargePackages((currentPackages) => {
        if (!editingPackage) {
          return [savedPackage, ...currentPackages];
        }
        return currentPackages.map((pkg) => (pkg.id === savedPackage.id ? savedPackage : pkg));
      });
      setIsFormOpen(false);
      setEditingPackage(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : t('admin.commerce.memberships.rechargePackages.form.error', 'Recharge package could not be saved'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRechargePackage = async (pkg: RechargePackageItem) => {
    const confirmed = window.confirm(t('admin.commerce.memberships.rechargePackages.deleteConfirm', 'Delete this recharge package?'));
    if (!confirmed) {
      return;
    }
    setDeletingPackageId(pkg.id);
    setLoadError(null);
    try {
      await deleteMembershipAdminRechargePackage(pkg.id);
      setRechargePackages((currentPackages) => currentPackages.filter((item) => item.id !== pkg.id));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : t('admin.commerce.memberships.rechargePackages.error', 'Recharge packages could not be loaded'));
    } finally {
      setDeletingPackageId(null);
    }
  };

  if (isLoading) {
    return <BusinessStatePanel kind="loading" title={t('admin.commerce.memberships.loading', 'Loading...')} className="min-h-48" />;
  }

  if (loadError) {
    return (
      <BusinessStatePanel
        kind="error"
        title={t('admin.commerce.memberships.rechargePackages.error', 'Recharge packages could not be loaded')}
        description={loadError}
        onRetry={loadRechargePackages}
        className="min-h-48"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {t('admin.commerce.memberships.rechargePackages.title', 'Recharge Packages')}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t('admin.commerce.memberships.rechargePackages.desc', 'Maintain point recharge packages used by member purchases and wallet top-ups.')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { void loadRechargePackages(); }}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            type="button"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {t('admin.action.reload', 'Reload')}
          </button>
          <button
            onClick={openCreateForm}
            className="inline-flex items-center gap-1 rounded-md bg-lobster-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-lobster-700"
            type="button"
          >
            <Plus className="h-3.5 w-3.5" />
            {t('admin.commerce.memberships.rechargePackages.add', 'Add')}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
        {rechargePackages.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-slate-400">
            {t('admin.commerce.memberships.rechargePackages.empty', 'No recharge packages')}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5">
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.package', 'Package')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.name', 'Name')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.sku', 'SKU')}</th>
                <th className="px-4 py-2.5 text-right font-medium text-slate-500">{t('admin.col.price', 'Price')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.currency', 'Currency')}</th>
                <th className="px-4 py-2.5 text-right font-medium text-slate-500">{t('admin.col.grant', 'Grant')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.status', 'Status')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.updatedAt', 'Updated At')}</th>
                <th className="px-4 py-2.5 text-right font-medium text-slate-500">{t('admin.col.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {rechargePackages.map((pkg) => (
                <tr key={pkg.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-white">{pkg.packageNo}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{pkg.name}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{pkg.skuId || '-'}</td>
                  <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-300">{pkg.priceAmount}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{pkg.currencyCode}</td>
                  <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-300">{pkg.grantAmount}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      pkg.status === 'active'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                    }`}>
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{pkg.updatedAt || '-'}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditForm(pkg)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                        title={t('admin.commerce.memberships.rechargePackages.edit', 'Edit')}
                        type="button"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { void handleDeleteRechargePackage(pkg); }}
                        disabled={deletingPackageId === pkg.id}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
                        title={t('admin.commerce.memberships.rechargePackages.delete', 'Delete')}
                        type="button"
                      >
                        {deletingPackageId === pkg.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsFormOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingPackage
                  ? t('admin.commerce.memberships.rechargePackages.editTitle', 'Edit Recharge Package')
                  : t('admin.commerce.memberships.rechargePackages.addTitle', 'Add Recharge Package')
                }
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white" type="button">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              {saveError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                  {saveError}
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('admin.commerce.memberships.rechargePackages.form.rmb', 'RMB Amount')}
                </label>
                <input
                  value={formRmb}
                  onChange={(event) => setFormRmb(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5 dark:text-white"
                  placeholder={t('admin.commerce.memberships.rechargePackages.form.rmbPlaceholder', '10.00')}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('admin.commerce.memberships.rechargePackages.form.bonus', 'Bonus Points')}
                </label>
                <input
                  value={formBonus}
                  onChange={(event) => setFormBonus(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5 dark:text-white"
                  min={0}
                  step={1}
                  type="number"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('admin.commerce.memberships.rechargePackages.form.status', 'Status')}
                </label>
                <select
                  value={formStatus}
                  onChange={(event) => setFormStatus(event.target.value as 'active' | 'inactive')}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5 dark:text-white"
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsFormOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/20 dark:text-slate-300 dark:hover:bg-white/5"
                type="button"
              >
                {t('admin.action.cancel', 'Cancel')}
              </button>
              <button
                onClick={handleSaveRechargePackage}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-lobster-600 px-4 py-2 text-sm font-medium text-white hover:bg-lobster-700 disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingPackage
                  ? t('admin.commerce.memberships.rechargePackages.form.updateSubmit', 'Update Package')
                  : t('admin.commerce.memberships.rechargePackages.form.submit', 'Create Package')
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlansTab() {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlanCode, setNewPlanCode] = useState('');
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanRank, setNewPlanRank] = useState('0');
  const [newPlanStatus, setNewPlanStatus] = useState<'active' | 'inactive' | 'disabled'>('active');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadPlans = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      setPlans(await fetchMembershipAdminPlans());
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : t('admin.commerce.memberships.error', 'Membership data could not be loaded'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  const openCreateModal = () => {
    setNewPlanCode('');
    setNewPlanName('');
    setNewPlanRank('0');
    setNewPlanStatus('active');
    setSaveError(null);
    setIsCreateModalOpen(true);
  };

  const handleCreatePlan = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const createdPlan = await createMembershipAdminPlan({
        code: newPlanCode,
        name: newPlanName,
        rank: parseOptionalInteger(newPlanRank),
        status: newPlanStatus,
      });
      setPlans((currentPlans) => [createdPlan, ...currentPlans]);
      setIsCreateModalOpen(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : t('admin.commerce.memberships.plans.form.error', 'Membership level could not be created'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <BusinessStatePanel kind="loading" title={t('admin.commerce.memberships.loading', 'Loading...')} className="min-h-48" />;
  }

  if (loadError) {
    return (
      <BusinessStatePanel
        kind="error"
        title={t('admin.commerce.memberships.error', 'Membership data could not be loaded')}
        description={loadError}
        onRetry={loadPlans}
        className="min-h-48"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {t('admin.commerce.memberships.plans.title', 'Membership Levels')}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t('admin.commerce.memberships.plans.desc', 'Manage membership level definitions and benefit plan status.')}
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1 rounded-md bg-lobster-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-lobster-700"
          type="button"
        >
          <Plus className="h-3.5 w-3.5" />
          {t('admin.commerce.memberships.plans.add', 'Add Level')}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
        {plans.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-slate-400">
            {t('admin.commerce.memberships.plans.empty', 'No membership levels')}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5">
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.level', 'Level')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.name', 'Name')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.code', 'Code')}</th>
                <th className="px-4 py-2.5 text-right font-medium text-slate-500">{t('admin.col.rank', 'Rank')}</th>
                <th className="px-4 py-2.5 text-right font-medium text-slate-500">{t('admin.col.benefits', 'Benefits')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.status', 'Status')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.updatedAt', 'Updated At')}</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-white">{plan.planNo || plan.levelCode || plan.id}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{plan.name}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{plan.levelCode}</td>
                  <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-300">{plan.rank}</td>
                  <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-300">{plan.benefitCount}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      plan.status === 'active'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                    }`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{plan.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsCreateModalOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('admin.commerce.memberships.plans.addTitle', 'Add Membership Level')}
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white" type="button">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              {saveError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                  {saveError}
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('admin.commerce.memberships.plans.form.code', 'Level Code')}
                </label>
                <input
                  value={newPlanCode}
                  onChange={(e) => setNewPlanCode(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5 dark:text-white"
                  placeholder={t('admin.commerce.memberships.plans.form.codePlaceholder', 'e.g. vip_gold')}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('admin.commerce.memberships.plans.form.name', 'Level Name')}
                </label>
                <input
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5 dark:text-white"
                  placeholder={t('admin.commerce.memberships.plans.form.namePlaceholder', 'e.g. Gold Member')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t('admin.commerce.memberships.plans.form.rank', 'Rank')}
                  </label>
                  <input
                    value={newPlanRank}
                    onChange={(e) => setNewPlanRank(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5 dark:text-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t('admin.commerce.memberships.plans.form.status', 'Status')}
                  </label>
                  <select
                    value={newPlanStatus}
                    onChange={(e) => setNewPlanStatus(e.target.value as 'active' | 'inactive' | 'disabled')}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5 dark:text-white"
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                    <option value="disabled">disabled</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/20 dark:text-slate-300 dark:hover:bg-white/5"
                type="button"
              >
                {t('admin.action.cancel', 'Cancel')}
              </button>
              <button
                onClick={handleCreatePlan}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-lobster-600 px-4 py-2 text-sm font-medium text-white hover:bg-lobster-700 disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {t('admin.commerce.memberships.plans.form.submit', 'Create Level')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MembersTab() {
  const { t } = useTranslation();
  const [members, setMembers] = useState<AdminRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMembershipAdminMembers()
      .then(setMembers)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <BusinessStatePanel kind="loading" title={t('admin.commerce.memberships.loading', 'Loading...')} className="min-h-48" />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 dark:border-white/5">
            <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.membership', 'Membership')}</th>
            <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.user', 'User')}</th>
            <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.plan', 'Plan')}</th>
            <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.status', 'Status')}</th>
            <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.expires', 'Expires')}</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, i) => (
            <tr key={i} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
              <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-white">{String(member['membership_no'] ?? '')}</td>
              <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{String(member['owner_user_id'] ?? '')}</td>
              <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{String(member['plan_id'] ?? '')}</td>
              <td className="px-4 py-2.5">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  member['status'] === 'active'
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                }`}>
                  {String(member['status'] ?? '')}
                </span>
              </td>
              <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{String(member['expires_at'] ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EntitlementsTab() {
  const { t } = useTranslation();
  const [entitlements, setEntitlements] = useState<AdminRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMembershipAdminEntitlements()
      .then(setEntitlements)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <BusinessStatePanel kind="loading" title={t('admin.commerce.memberships.loading', 'Loading...')} className="min-h-48" />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 dark:border-white/5">
            <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.entitlement', 'Entitlement')}</th>
            <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.plan', 'Plan')}</th>
            <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.benefit', 'Benefit')}</th>
            <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.quota', 'Quota')}</th>
            <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.col.status', 'Status')}</th>
          </tr>
        </thead>
        <tbody>
          {entitlements.map((ent, i) => (
            <tr key={i} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
              <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-white">{String(ent['entitlement_no'] ?? '')}</td>
              <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{String(ent['plan_id'] ?? '')}</td>
              <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{String(ent['benefit_code'] ?? '')}</td>
              <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-300">{String(ent['quota_amount'] ?? '')}</td>
              <td className="px-4 py-2.5">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  ent['status'] === 'active'
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                }`}>
                  {String(ent['status'] ?? '')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function parseOptionalInteger(value: string): number | undefined {
  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }
  const parsed = Number.parseInt(normalized, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}
