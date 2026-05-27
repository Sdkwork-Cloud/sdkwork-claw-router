import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MembershipFormActions,
  MembershipFormFrame,
  MembershipSelectField,
  MembershipTextField,
} from '../components/MembershipFormControls';
import {
  formatMembershipFormValidationError,
  parseRequiredMoneyAmountField,
  parseRequiredNonNegativeIntegerField,
} from './membershipFormValues';
import type {
  MembershipsAdminRechargePackageItem,
  MembershipsAdminRechargePackageMutationInput,
} from '../membershipsService';

interface MembershipRechargePackageDrawerFormProps {
  mode: 'create' | 'edit';
  initialValue?: MembershipsAdminRechargePackageItem | null;
  onCancel: () => void;
  onSubmit: (input: MembershipsAdminRechargePackageMutationInput) => Promise<void>;
}

export function MembershipRechargePackageDrawerForm({
  mode,
  initialValue,
  onCancel,
  onSubmit,
}: MembershipRechargePackageDrawerFormProps) {
  const { t } = useTranslation();
  const [rmb, setRmb] = useState(initialValue?.priceAmount ?? '');
  const [bonus, setBonus] = useState(initialValue?.bonusAmount ?? '0');
  const [status, setStatus] = useState<'active' | 'inactive'>(initialValue?.status === 'inactive' ? 'inactive' : 'active');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSubmit({
        rmb: parseRequiredMoneyAmountField(rmb, t('admin.commerce.memberships.rechargePackages.form.rmb', 'RMB Amount')),
        bonus: parseRequiredNonNegativeIntegerField(bonus, t('admin.commerce.memberships.rechargePackages.form.bonus', 'Bonus Points')),
        status,
      });
    } catch (saveError) {
      setError(formatMembershipFormValidationError(
        saveError,
        t,
        t('admin.commerce.memberships.rechargePackages.form.error', 'Recharge package could not be saved'),
      ));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MembershipFormFrame error={error}>
      <MembershipTextField label={t('admin.commerce.memberships.rechargePackages.form.rmb', 'RMB Amount')} value={rmb} onChange={setRmb} placeholder={t('admin.commerce.memberships.rechargePackages.form.rmbPlaceholder', '10.00')} />
      <MembershipTextField label={t('admin.commerce.memberships.rechargePackages.form.bonus', 'Bonus Points')} value={bonus} onChange={setBonus} placeholder="0" type="number" />
      <MembershipSelectField
        label={t('admin.commerce.memberships.rechargePackages.form.status', 'Status')}
        value={status}
        options={[
          { value: 'active' },
          { value: 'inactive' },
        ]}
        onChange={(value) => setStatus(value as 'active' | 'inactive')}
      />
      <MembershipFormActions
        submitLabel={mode === 'edit'
          ? t('admin.commerce.memberships.rechargePackages.form.updateSubmit', 'Update Package')
          : t('admin.commerce.memberships.rechargePackages.form.submit', 'Create Package')}
        isSaving={isSaving}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </MembershipFormFrame>
  );
}
