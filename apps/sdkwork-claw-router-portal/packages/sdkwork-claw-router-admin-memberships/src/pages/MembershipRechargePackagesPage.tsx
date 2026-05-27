import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Plus, Trash2 } from 'lucide-react';
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
import { MembershipRechargePackageDrawerForm } from '../forms/MembershipRechargePackageDrawerForm';
import {
  createMembershipAdminRechargePackage,
  deleteMembershipAdminRechargePackage,
  fetchMembershipAdminRechargePackages,
  updateMembershipAdminRechargePackage,
  type MembershipsAdminRechargePackageItem,
  type MembershipsAdminRechargePackageMutationInput,
} from '../membershipsService';

export function MembershipRechargePackagesPage() {
  const { t } = useTranslation();
  const [packages, setPackages] = useState<MembershipsAdminRechargePackageItem[]>([]);
  const [editingPackage, setEditingPackage] = useState<MembershipsAdminRechargePackageItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPackages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setPackages(await fetchMembershipAdminRechargePackages());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('admin.commerce.memberships.rechargePackages.error', 'Recharge packages could not be loaded'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadPackages();
  }, [loadPackages]);

  const openCreateDrawer = () => {
    setEditingPackage(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (item: MembershipsAdminRechargePackageItem) => {
    setEditingPackage(item);
    setIsDrawerOpen(true);
  };

  const handleSavePackage = async (input: MembershipsAdminRechargePackageMutationInput) => {
    if (editingPackage) {
      await updateMembershipAdminRechargePackage(editingPackage.id, input);
    } else {
      await createMembershipAdminRechargePackage(input);
    }
    setIsDrawerOpen(false);
    setEditingPackage(null);
    await loadPackages();
  };

  const handleDeletePackage = async (item: MembershipsAdminRechargePackageItem) => {
    if (!confirmMembershipAction(t('admin.commerce.memberships.rechargePackages.deleteConfirmNamed', 'Delete recharge package {{name}}?', { name: item.name || item.packageNo }))) {
      return;
    }
    await deleteMembershipAdminRechargePackage(item.id);
    await loadPackages();
  };

  return (
    <>
      <MembershipAdminPageShell
        isLoading={isLoading}
        error={error}
        onRefresh={loadPackages}
        title={t('admin.commerce.memberships.rechargePackages.title', 'Recharge Packages')}
        description={t('admin.commerce.memberships.rechargePackages.desc', 'Manage wallet recharge packages and bonus balances.')}
        actions={(
          <button type="button" onClick={openCreateDrawer} className="inline-flex items-center gap-1 rounded-md bg-lobster-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-lobster-700">
            <Plus className="h-3.5 w-3.5" />
            {t('admin.commerce.memberships.rechargePackages.add', 'Add')}
          </button>
        )}
      >
        <MembershipTablePanel>
          {packages.length === 0 ? (
            <MembershipEmptyState title={t('admin.commerce.memberships.rechargePackages.empty', 'No recharge packages')} />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5">
                  <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.commerce.memberships.rechargePackages.table.package', 'Package')}</th>
                  <th className="px-4 py-2.5 text-right font-medium text-slate-500">{t('admin.commerce.memberships.rechargePackages.table.price', 'Price')}</th>
                  <th className="px-4 py-2.5 text-right font-medium text-slate-500">{t('admin.commerce.memberships.rechargePackages.table.bonus', 'Bonus')}</th>
                  <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.commerce.memberships.rechargePackages.table.status', 'Status')}</th>
                  <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.commerce.memberships.rechargePackages.table.updated', 'Updated')}</th>
                  <th className="px-4 py-2.5 text-right font-medium text-slate-500">{t('common.actions.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-slate-900 dark:text-white">{item.name || item.packageNo}</div>
                      <div className="text-xs text-slate-400">{item.packageNo}</div>
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-300">{item.priceAmount} {item.currencyCode}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-300">{item.bonusAmount}</td>
                    <td className="px-4 py-2.5"><MembershipStatusBadge status={item.status} /></td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{item.updatedAt}</td>
                    <td className="px-4 py-2.5">
                      <MembershipTableActions>
                        <MembershipIconActionButton label={t('admin.commerce.memberships.rechargePackages.edit', 'Edit')} icon={<Pencil className="h-4 w-4" />} onClick={() => openEditDrawer(item)} />
                        <MembershipIconActionButton label={t('admin.commerce.memberships.rechargePackages.delete', 'Delete')} icon={<Trash2 className="h-4 w-4" />} tone="danger" onClick={() => void handleDeletePackage(item)} />
                      </MembershipTableActions>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </MembershipTablePanel>
      </MembershipAdminPageShell>

      <MembershipDrawer
        title={editingPackage
          ? t('admin.commerce.memberships.rechargePackages.editTitle', 'Edit Recharge Package')
          : t('admin.commerce.memberships.rechargePackages.addTitle', 'Add Recharge Package')}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <MembershipRechargePackageDrawerForm
          mode={editingPackage ? 'edit' : 'create'}
          initialValue={editingPackage}
          onCancel={() => setIsDrawerOpen(false)}
          onSubmit={handleSavePackage}
        />
      </MembershipDrawer>
    </>
  );
}
