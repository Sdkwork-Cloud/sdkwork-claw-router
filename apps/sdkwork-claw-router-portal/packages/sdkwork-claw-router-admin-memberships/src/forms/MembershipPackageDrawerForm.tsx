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
  parseRequiredPositiveIntegerField,
} from './membershipFormValues';
import type {
  MembershipsAdminPackageGroup,
  MembershipsAdminPackageItem,
  MembershipsAdminPackageMutationInput,
  MembershipsAdminPlanItem,
} from '../membershipsService';

interface MembershipPackageDrawerFormProps {
  mode: 'create' | 'edit';
  initialValue?: MembershipsAdminPackageItem | null;
  groups: MembershipsAdminPackageGroup[];
  plans: MembershipsAdminPlanItem[];
  defaultGroupId?: string | null;
  onCancel: () => void;
  onSubmit: (input: MembershipsAdminPackageMutationInput) => Promise<void>;
}

export function MembershipPackageDrawerForm({
  mode,
  initialValue,
  groups,
  plans,
  defaultGroupId,
  onCancel,
  onSubmit,
}: MembershipPackageDrawerFormProps) {
  const { t } = useTranslation();
  const [code, setCode] = useState(initialValue?.packageNo ?? '');
  const [name, setName] = useState(initialValue?.name ?? '');
  const [packageGroupId, setPackageGroupId] = useState(initialValue?.groupId ?? defaultGroupId ?? groups[0]?.id ?? '');
  const [planId, setPlanId] = useState(initialValue?.planId ?? plans[0]?.id ?? '');
  const [priceAmount, setPriceAmount] = useState(initialValue?.priceAmount ?? '');
  const [currencyCode, setCurrencyCode] = useState(initialValue?.currencyCode ?? 'CNY');
  const [durationDays, setDurationDays] = useState(String(initialValue?.durationDays ?? 30));
  const [status, setStatus] = useState<'active' | 'inactive' | 'disabled'>(
    initialValue?.status === 'inactive' || initialValue?.status === 'disabled'
      ? initialValue.status
      : 'active',
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSubmit({
        code,
        packageGroupId,
        planId,
        name,
        priceAmount: parseRequiredMoneyAmountField(priceAmount, t('admin.commerce.memberships.packages.form.price', 'Price')),
        currencyCode,
        durationDays: parseRequiredPositiveIntegerField(durationDays, t('admin.commerce.memberships.packages.form.duration', 'Duration days')),
        status,
      });
    } catch (saveError) {
      setError(formatMembershipFormValidationError(
        saveError,
        t,
        t('admin.commerce.memberships.packages.form.error', 'Membership package could not be saved'),
      ));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MembershipFormFrame error={error}>
      <MembershipTextField label={t('admin.commerce.memberships.packages.form.code', 'Code')} value={code} onChange={setCode} placeholder="membership-month-pro" />
      <MembershipTextField label={t('admin.commerce.memberships.packages.form.name', 'Package Name')} value={name} onChange={setName} placeholder={t('admin.commerce.memberships.packages.form.namePlaceholder', 'Monthly Pro')} />
      <MembershipSelectField
        label={t('admin.commerce.memberships.packages.form.group', 'Package Group')}
        value={packageGroupId}
        placeholder={t('admin.commerce.memberships.packages.form.selectGroup', 'Select group')}
        options={groups.map((group) => ({ value: group.id, label: group.name }))}
        onChange={setPackageGroupId}
      />
      <MembershipSelectField
        label={t('admin.commerce.memberships.packages.form.plan', 'Plan')}
        value={planId}
        placeholder={t('admin.commerce.memberships.packages.form.selectPlan', 'Select plan')}
        options={plans.map((plan) => ({ value: plan.id, label: plan.name }))}
        onChange={setPlanId}
      />
      <div className="grid grid-cols-2 gap-4">
        <MembershipTextField label={t('admin.commerce.memberships.packages.form.price', 'Price')} value={priceAmount} onChange={setPriceAmount} placeholder="69.90" />
        <MembershipTextField label={t('admin.commerce.memberships.packages.form.currency', 'Currency')} value={currencyCode} onChange={setCurrencyCode} placeholder="CNY" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <MembershipTextField label={t('admin.commerce.memberships.packages.form.duration', 'Duration days')} value={durationDays} onChange={setDurationDays} />
        <MembershipSelectField
          label={t('admin.commerce.memberships.packages.form.status', 'Status')}
          value={status}
          options={[
            { value: 'active' },
            { value: 'inactive' },
            { value: 'disabled' },
          ]}
          onChange={(value) => setStatus(value as 'active' | 'inactive' | 'disabled')}
        />
      </div>
      <MembershipFormActions
        submitLabel={mode === 'edit'
          ? t('admin.commerce.memberships.packages.form.updateSubmit', 'Update Package')
          : t('admin.commerce.memberships.packages.form.submit', 'Create Package')}
        isSaving={isSaving}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </MembershipFormFrame>
  );
}
