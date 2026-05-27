import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react';
import { MembershipAdminPageShell } from '../components/MembershipAdminPageShell';
import { MembershipDrawer } from '../components/MembershipDrawer';
import { MembershipEmptyState } from '../components/MembershipEmptyState';
import {
  MembershipIconActionButton,
  MembershipTableActions,
  MembershipTablePanel,
  confirmMembershipAction,
} from '../components/MembershipPageControls';
import { MembershipStatusBadge } from '../components/MembershipStatusBadge';
import { MembershipPackageDrawerForm } from '../forms/MembershipPackageDrawerForm';
import {
  createMembershipAdminPackage,
  deleteMembershipAdminPackage,
  fetchMembershipAdminPackageCatalog,
  updateMembershipAdminPackage,
  type MembershipsAdminPackageGroup,
  type MembershipsAdminPackageItem,
  type MembershipsAdminPackageMutationInput,
  type MembershipsAdminPlanItem,
} from '../membershipsService';

export function MembershipPackagesPage() {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<MembershipsAdminPackageGroup[]>([]);
  const [packages, setPackages] = useState<MembershipsAdminPackageItem[]>([]);
  const [plans, setPlans] = useState<MembershipsAdminPlanItem[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [editingPackage, setEditingPackage] = useState<MembershipsAdminPackageItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCatalog = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const catalog = await fetchMembershipAdminPackageCatalog();
      setGroups(catalog.groups);
      setPackages(catalog.packages);
      setPlans(catalog.plans);
      setSelectedGroupId((current) => current ?? catalog.groups[0]?.id ?? null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('admin.commerce.memberships.packages.error', 'Membership packages could not be loaded'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) ?? null,
    [groups, selectedGroupId],
  );
  const visiblePackages = useMemo(
    () => packages.filter((item) => !selectedGroupId || item.groupId === selectedGroupId),
    [packages, selectedGroupId],
  );

  const openCreateDrawer = () => {
    setEditingPackage(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (item: MembershipsAdminPackageItem) => {
    setEditingPackage(item);
    setIsDrawerOpen(true);
  };

  const handleSavePackage = async (input: MembershipsAdminPackageMutationInput) => {
    if (editingPackage) {
      await updateMembershipAdminPackage(editingPackage.id, input);
    } else {
      await createMembershipAdminPackage(input);
    }
    setIsDrawerOpen(false);
    setEditingPackage(null);
    await loadCatalog();
  };

  const handleDeletePackage = async (item: MembershipsAdminPackageItem) => {
    if (!confirmMembershipAction(t('admin.commerce.memberships.packages.deleteConfirmNamed', 'Delete membership package {{name}}?', { name: item.name || item.packageNo }))) {
      return;
    }
    await deleteMembershipAdminPackage(item.id);
    await loadCatalog();
  };

  return (
    <>
      <MembershipAdminPageShell
        isLoading={isLoading}
        error={error}
        onRefresh={loadCatalog}
        actions={(
          <button
            type="button"
            onClick={openCreateDrawer}
            className="inline-flex items-center gap-1 rounded-md bg-lobster-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-lobster-700"
          >
            <Plus className="h-3.5 w-3.5" />
            {t('admin.commerce.memberships.packages.add', 'Add Package')}
          </button>
        )}
      >
        <div className="grid min-h-[560px] gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
            <div className="border-b border-slate-200 px-4 py-3 dark:border-white/10">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t('admin.commerce.memberships.groups.title', 'Package Groups')}</h3>
            </div>
            <div className="max-h-[520px] overflow-y-auto p-2">
              {groups.length === 0 ? (
                <MembershipEmptyState title={t('admin.commerce.memberships.groups.empty', 'No package groups')} />
              ) : groups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors ${
                    selectedGroupId === group.id
                      ? 'bg-lobster-50 dark:bg-lobster-500/10'
                      : 'hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-200">{group.name}</span>
                    <span className="mt-0.5 block text-xs text-slate-400">{t('admin.commerce.memberships.groups.packagesCount', '{{count}} packages', { count: group.packageCount })}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                </button>
              ))}
            </div>
          </div>

          <MembershipTablePanel>
            <div className="border-b border-slate-200 px-4 py-3 dark:border-white/10">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {selectedGroup?.name ?? t('admin.commerce.memberships.packages.table.packages', 'Packages')}
              </h3>
              {selectedGroup?.description ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{selectedGroup.description}</p> : null}
            </div>
            {visiblePackages.length === 0 ? (
              <MembershipEmptyState title={t('admin.commerce.memberships.packages.emptyGroup', 'No packages in this group')} />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5">
                    <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.commerce.memberships.packages.table.package', 'Package')}</th>
                    <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.commerce.memberships.packages.table.plan', 'Plan')}</th>
                    <th className="px-4 py-2.5 text-right font-medium text-slate-500">{t('admin.commerce.memberships.packages.table.price', 'Price')}</th>
                    <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.commerce.memberships.packages.table.duration', 'Duration')}</th>
                    <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.commerce.memberships.packages.table.status', 'Status')}</th>
                    <th className="px-4 py-2.5 text-right font-medium text-slate-500">{t('common.actions.actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {visiblePackages.map((item) => (
                    <tr key={item.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-slate-900 dark:text-white">{item.name || item.packageNo}</div>
                        <div className="text-xs text-slate-400">{item.packageNo}</div>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{item.planId}</td>
                      <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-300">{item.priceAmount} {item.currencyCode}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{item.durationDays}d</td>
                      <td className="px-4 py-2.5"><MembershipStatusBadge status={item.status} /></td>
                      <td className="px-4 py-2.5">
                        <MembershipTableActions>
                          <MembershipIconActionButton label={t('common.actions.edit', 'Edit')} icon={<Pencil className="h-4 w-4" />} onClick={() => openEditDrawer(item)} />
                          <MembershipIconActionButton label={t('common.actions.delete', 'Delete')} icon={<Trash2 className="h-4 w-4" />} tone="danger" onClick={() => void handleDeletePackage(item)} />
                        </MembershipTableActions>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </MembershipTablePanel>
        </div>
      </MembershipAdminPageShell>

      <MembershipDrawer
        title={editingPackage
          ? t('admin.commerce.memberships.packages.editTitle', 'Edit Membership Package')
          : t('admin.commerce.memberships.packages.addTitle', 'Add Membership Package')}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <MembershipPackageDrawerForm
          mode={editingPackage ? 'edit' : 'create'}
          initialValue={editingPackage}
          groups={groups}
          plans={plans}
          defaultGroupId={selectedGroupId}
          onCancel={() => setIsDrawerOpen(false)}
          onSubmit={handleSavePackage}
        />
      </MembershipDrawer>
    </>
  );
}
